import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimStatComponent } from './swim-stat.component';

describe('SwimStatComponent', () => {
  let component: SwimStatComponent;
  let fixture: ComponentFixture<SwimStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwimStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwimStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
