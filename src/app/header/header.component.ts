import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {TuiIcon} from '@taiga-ui/core';


@Component({
  standalone: true,
  selector: 'app-header',
  imports: [TuiIcon, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  banklogo = "https://sun9-6.userapi.com/impg/fNLhRdzenfM4QRvSmZL4jJ_hJblWQagNxfUCsA/HU5Z3XeEfCs.jpg?size=450x450&quality=95&sign=0ffaf6bd630bb404b5be8d9831e95650&type=album"

}
