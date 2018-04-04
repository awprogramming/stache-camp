import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterDropdownComponent } from './roster-dropdown.component';

describe('RosterDropdownComponent', () => {
  let component: RosterDropdownComponent;
  let fixture: ComponentFixture<RosterDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosterDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
