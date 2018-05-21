import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadStaffProfileComponent } from './head-staff-profile.component';

describe('HeadStaffProfileComponent', () => {
  let component: HeadStaffProfileComponent;
  let fixture: ComponentFixture<HeadStaffProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadStaffProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadStaffProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
