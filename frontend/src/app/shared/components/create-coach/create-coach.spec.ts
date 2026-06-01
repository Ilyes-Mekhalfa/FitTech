import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCoach } from './create-coach';

describe('CreateCoach', () => {
  let component: CreateCoach;
  let fixture: ComponentFixture<CreateCoach>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCoach]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCoach);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
