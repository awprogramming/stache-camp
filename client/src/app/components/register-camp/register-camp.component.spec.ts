import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCampComponent } from './register-camp.component';

describe('RegisterCampComponent', () => {
  let component: RegisterCampComponent;
  let fixture: ComponentFixture<RegisterCampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterCampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
