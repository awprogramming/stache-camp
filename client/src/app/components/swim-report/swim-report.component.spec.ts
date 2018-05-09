import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimReportComponent } from './swim-report.component';

describe('SwimReportComponent', () => {
  let component: SwimReportComponent;
  let fixture: ComponentFixture<SwimReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwimReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwimReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
