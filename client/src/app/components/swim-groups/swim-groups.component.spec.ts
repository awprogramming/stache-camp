import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimGroupsComponent } from './swim-groups.component';

describe('SwimGroupsComponent', () => {
  let component: SwimGroupsComponent;
  let fixture: ComponentFixture<SwimGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwimGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwimGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
