import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Machine } from './machine';

describe('Machine', () => {
  let component: Machine;
  let fixture: ComponentFixture<Machine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Machine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Machine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
