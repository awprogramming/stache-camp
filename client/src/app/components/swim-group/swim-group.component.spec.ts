import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimGroupComponent } from './swim-group.component';

describe('SwimGroupComponent', () => {
  let component: SwimGroupComponent;
  let fixture: ComponentFixture<SwimGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwimGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwimGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
