import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveEnterance } from './live-enterance';

describe('LiveEnterance', () => {
  let component: LiveEnterance;
  let fixture: ComponentFixture<LiveEnterance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveEnterance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveEnterance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
