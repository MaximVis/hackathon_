import secrets
import jwt
import datetime
from flask import Flask, jsonify, session, request, make_response
import psycopg2
from psycopg2 import OperationalError, DatabaseError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from functools import wraps
from decimal import Decimal


app = Flask(__name__)
CORS(app,
     origins="http://localhost:4200",
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"])




def get_query(query_number):
    query = ['''select * from profile where profile_phone = %s''',
             '''select * from profile where profile_mail = %s''',
             '''insert into profile(profile_phone, profile_mail, profile_password) values
             (%s, %s, %s) on conflict do nothing''',
             '''insert into card(card_fio, card_number, card_phone, card_mail, card_passport, card_type) values
             (%s, %s, %s, %s, %s, %s)''',
             '''select * from profile where profile_phone = %s and profile_password = %s''',
             '''select * from profile where profile_id = %s''',
             '''SELECT card_number, card_balance, card_type_name, profile_fio FROM card
             JOIN profile ON card_profile_id = profile_id join card_type on card_type = card_type_id where card_profile_id = %s'''
             ]
    return query[query_number]


def base_connection():
    try:
        connect = psycopg2.connect(user="postgres", password="123", host="localhost", port="5433", database="bank_app")

    except OperationalError as e:
        print(f"Ошибка с Postgre: {e}")
        return None
    return connect

def get_data(query, params):
    connection = None
    cursor = None
    try:
        connection = base_connection()
        cursor = connection.cursor()

        quer = get_query(query)
        cursor.execute(quer, params)

        if(query != 2 and query != 3):
            data = cursor.fetchall()
            return data
        else:
            connection.commit()
    except OperationalError as e:
        print(f"Ошибка подключения: {e}")
        return None
    except DatabaseError as e:
        print(f"Ошибка при выполнении запроса: {e}")
        return None
    finally:
        if connection:
            cursor.close()
            connection.close()





@app.route('/reg', methods=['POST'])
def reg():
    data = request.json
    card_phone = str(data['input']['card_phone'])
    card_mail = str(data['input']['card_mail'])
    profile_password = str(data['input']['profile_password'])
    check_phone = get_data(0, (card_phone, ))
    check_mail = get_data(1, (card_mail, ))
    if(check_phone):
        return jsonify({"message": "телефон уже есть в бд"})
    if(check_mail):
        return jsonify({"message": "почта уже регистрирована"})
    #регистрация аккаунта в бд
    profile_params = (card_phone, card_mail, profile_password, )
    get_data(2, profile_params)
    return jsonify({"message": "вы ввели число"})


@app.route('/card_reg', methods=['POST'])
def card_reg():
    data = request.json
    card_fio = data['input']['card_fio']
    card_phone = data['input']['card_phone']
    card_mail = data['input']['card_mail']
    card_pasport = data['input']['card_passport']
    card_type = data['input']['card_type']
    #генерация номера карты
    with open('card_number.txt', 'r', encoding='utf-8') as file:
        old_number = file.read()
    card_number = old_number
    with open('card_number.txt', 'w', encoding='utf-8') as file:
        file.write(str(int(old_number)+1))
    #запись
    profile_params = (card_fio, card_number, card_phone, card_mail, card_pasport, card_type)
    get_data(3, profile_params)
    return jsonify({"message": "вы ввели число"})


@app.route('/log', methods=['POST'])
def log():
    data = request.json
    card_phone = data['input']['card_phone']
    profile_password = data['input']['profile_password']

    # Получаем данные пользователя
    phone = get_data(0, (card_phone,))
    if not phone:
        return jsonify({"message": "телефон не зарегистрирован"}), 401

    # Проверяем пароль
    profile_params = (card_phone, profile_password,)
    user_data = get_data(4, profile_params)  # Предполагаем, что теперь возвращаем данные пользователя
    if not user_data:
        return jsonify({"message": "пароль неверный"}), 401

    # Создаем токен с информацией о пользователе
    token_data = {
        "user_id": user_data[0][0],  # или другой уникальный идентификатор
        "phone": card_phone,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }

    # Подписываем токен (используем JWT)
    auth_token = jwt.encode(token_data, 'your-secret-key', algorithm='HS256')

    response = make_response(jsonify({
        "message": "Успешный вход",
        "user": {
            "id": user_data[0][0],
            "phone": card_phone
        }
    }))

    response.set_cookie(
        'auth_token',
        value=auth_token,
        httponly=True,
        secure=True,
        samesite='Lax',
        max_age=86400
    )
    return response


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_token = request.cookies.get('auth_token')
        if not auth_token:
            return jsonify({"error": "Токен отсутствует"}), 401

        try:
            data = jwt.decode(auth_token, 'your-secret-key', algorithms=['HS256'])
            current_user = {
                "id": data['user_id'],
                "phone": data['phone']
            }
        except:
            return jsonify({"error": "Неверный токен"}), 401

        return f(current_user, *args, **kwargs)

    return decorated


@app.route('/protect', methods=['POST', 'GET'])
@token_required
def protect(current_user):
    user_id = current_user['id']
    #print(current_user)
    #print(current_user[0][0])
    #user_id = current_user[0][0]
    return jsonify({
        "message": "Доступ разрешен",
        "user": user_id
    })


@app.route('/get_profile', methods=['GET'])
def get_profile():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400

    profile_data = get_data(6, user_id)
    user_name = profile_data[0][3]
    total = sum(item[1] for item in profile_data)

    cleaned_data = [
        (item[0], float(item[1]), item[2], item[3])
        for item in profile_data
    ]
    print(cleaned_data)

    return jsonify({"user_name": user_name,
        "total_money": total,
        "massive_data": cleaned_data})


@app.route('/logout', methods=['GET'])
def logout():
    print("!11")
    response = make_response(jsonify({"message": "Успешный выход из системы"}))

    response.set_cookie(
        'auth_token',
        value='',
        expires=0,
        httponly=True,
        secure=True,
        samesite='Lax'
    )

    return response




if __name__ == '__main__':
    app.run(debug=True)