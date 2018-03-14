import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RostersComponent } from './rosters.component';

describe('RostersComponent', () => {
  let component: RostersComponent;
  let fixture: ComponentFixture<RostersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RostersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RostersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
