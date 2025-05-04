import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferStatisticsComponent } from './transfer-statistics.component';

describe('TransferStatisticsComponent', () => {
  let component: TransferStatisticsComponent;
  let fixture: ComponentFixture<TransferStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
