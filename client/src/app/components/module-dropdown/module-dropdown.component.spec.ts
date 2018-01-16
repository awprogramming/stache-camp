import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleDropdownComponent } from './module-dropdown.component';

describe('ModuleDropdownComponent', () => {
  let component: ModuleDropdownComponent;
  let fixture: ComponentFixture<ModuleDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
