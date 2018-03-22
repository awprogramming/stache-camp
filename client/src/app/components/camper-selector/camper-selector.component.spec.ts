import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CamperSelectorComponent } from './camper-selector.component';

describe('CamperSelectorComponent', () => {
  let component: CamperSelectorComponent;
  let fixture: ComponentFixture<CamperSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CamperSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamperSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
