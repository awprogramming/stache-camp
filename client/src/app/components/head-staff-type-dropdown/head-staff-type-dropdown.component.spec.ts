import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadStaffTypeDropdownComponent } from './head-staff-type-dropdown.component';

describe('HeadStaffTypeDropdownComponent', () => {
  let component: HeadStaffTypeDropdownComponent;
  let fixture: ComponentFixture<HeadStaffTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadStaffTypeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadStaffTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
