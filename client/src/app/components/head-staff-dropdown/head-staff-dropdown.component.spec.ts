import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadStaffDropdownComponent } from './head-staff-dropdown.component';

describe('HeadStaffDropdownComponent', () => {
  let component: HeadStaffDropdownComponent;
  let fixture: ComponentFixture<HeadStaffDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadStaffDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadStaffDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
