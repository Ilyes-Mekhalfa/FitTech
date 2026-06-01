import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberStats } from './member-stats';

describe('MemberStats', () => {
  let component: MemberStats;
  let fixture: ComponentFixture<MemberStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
