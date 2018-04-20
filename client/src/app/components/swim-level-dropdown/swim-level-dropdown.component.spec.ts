import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimLevelDropdownComponent } from './swim-level-dropdown.component';

describe('SwimLevelDropdownComponent', () => {
  let component: SwimLevelDropdownComponent;
  let fixture: ComponentFixture<SwimLevelDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwimLevelDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwimLevelDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
