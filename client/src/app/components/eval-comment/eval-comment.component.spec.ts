import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvalCommentComponent } from './eval-comment.component';

describe('EvalCommentComponent', () => {
  let component: EvalCommentComponent;
  let fixture: ComponentFixture<EvalCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvalCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvalCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
