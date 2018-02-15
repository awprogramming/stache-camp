import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounselorTypesDropdownComponent } from './counselor-types-dropdown.component';

describe('CounselorTypesDropdownComponent', () => {
  let component: CounselorTypesDropdownComponent;
  let fixture: ComponentFixture<CounselorTypesDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounselorTypesDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounselorTypesDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
