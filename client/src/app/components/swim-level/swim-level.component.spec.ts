import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimLevelComponent } from './swim-level.component';

describe('SwimLevelComponent', () => {
  let component: SwimLevelComponent;
  let fixture: ComponentFixture<SwimLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwimLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwimLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
