import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadStaffComponent } from './head-staff.component';

describe('HeadStaffComponent', () => {
  let component: HeadStaffComponent;
  let fixture: ComponentFixture<HeadStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
