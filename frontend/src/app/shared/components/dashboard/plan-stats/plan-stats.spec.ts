import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanStats } from './plan-stats';

describe('PlanStats', () => {
  let component: PlanStats;
  let fixture: ComponentFixture<PlanStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
