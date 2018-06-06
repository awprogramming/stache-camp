import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelCompletedComponent } from './level-completed.component';

describe('LevelCompletedComponent', () => {
  let component: LevelCompletedComponent;
  let fixture: ComponentFixture<LevelCompletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelCompletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
