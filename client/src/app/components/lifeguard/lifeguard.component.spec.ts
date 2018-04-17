import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeguardComponent } from './lifeguard.component';

describe('LifeguardComponent', () => {
  let component: LifeguardComponent;
  let fixture: ComponentFixture<LifeguardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeguardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeguardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
