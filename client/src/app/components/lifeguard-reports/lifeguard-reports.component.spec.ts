import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeguardReportsComponent } from './lifeguard-reports.component';

describe('LifeguardReportsComponent', () => {
  let component: LifeguardReportsComponent;
  let fixture: ComponentFixture<LifeguardReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeguardReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeguardReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
