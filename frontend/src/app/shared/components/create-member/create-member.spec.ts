import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMember } from './create-member';

describe('CreateMember', () => {
  let component: CreateMember;
  let fixture: ComponentFixture<CreateMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMember]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMember);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
