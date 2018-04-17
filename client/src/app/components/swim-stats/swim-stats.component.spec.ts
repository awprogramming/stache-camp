import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimStatsComponent } from './swim-stats.component';

describe('SwimStatsComponent', () => {
  let component: SwimStatsComponent;
  let fixture: ComponentFixture<SwimStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwimStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwimStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
