import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowWeSayComponent } from './how-we-say.component';

describe('HowWeSayComponent', () => {
  let component: HowWeSayComponent;
  let fixture: ComponentFixture<HowWeSayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowWeSayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowWeSayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
