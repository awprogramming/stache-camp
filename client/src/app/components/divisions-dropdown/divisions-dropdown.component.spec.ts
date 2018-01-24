import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionsDropdownComponent } from './divisions-dropdown.component';

describe('DivisionsDropdownComponent', () => {
  let component: DivisionsDropdownComponent;
  let fixture: ComponentFixture<DivisionsDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivisionsDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
