import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvalArchiveComponent } from './eval-archive.component';

describe('EvalArchiveComponent', () => {
  let component: EvalArchiveComponent;
  let fixture: ComponentFixture<EvalArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvalArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvalArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
