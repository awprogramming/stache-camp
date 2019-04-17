import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CamperComponent } from './camper.component';

describe('CamperComponent', () => {
  let component: CamperComponent;
  let fixture: ComponentFixture<CamperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CamperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
