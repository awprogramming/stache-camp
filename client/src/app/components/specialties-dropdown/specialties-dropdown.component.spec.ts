import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialtiesDropdownComponent } from './specialties-dropdown.component';

describe('SpecialtiesDropdownComponent', () => {
  let component: SpecialtiesDropdownComponent;
  let fixture: ComponentFixture<SpecialtiesDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialtiesDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialtiesDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
