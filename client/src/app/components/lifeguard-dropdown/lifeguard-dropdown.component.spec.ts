import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeguardDropdownComponent } from './lifeguard-dropdown.component';

describe('LifeguardDropdownComponent', () => {
  let component: LifeguardDropdownComponent;
  let fixture: ComponentFixture<LifeguardDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeguardDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeguardDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
