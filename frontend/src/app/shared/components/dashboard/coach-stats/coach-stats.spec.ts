import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachStats } from './coach-stats';

describe('CoachStats', () => {
  let component: CoachStats;
  let fixture: ComponentFixture<CoachStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
