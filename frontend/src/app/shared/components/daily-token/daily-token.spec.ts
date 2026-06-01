import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyToken } from './daily-token';

describe('DailyToken', () => {
  let component: DailyToken;
  let fixture: ComponentFixture<DailyToken>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyToken]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyToken);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
