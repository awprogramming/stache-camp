import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimLevelsComponent } from './swim-levels.component';

describe('SwimLevelsComponent', () => {
  let component: SwimLevelsComponent;
  let fixture: ComponentFixture<SwimLevelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwimLevelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwimLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
