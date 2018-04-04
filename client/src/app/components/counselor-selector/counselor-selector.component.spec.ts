import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounselorSelectorComponent } from './counselor-selector.component';

describe('CounselorSelectorComponent', () => {
  let component: CounselorSelectorComponent;
  let fixture: ComponentFixture<CounselorSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounselorSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounselorSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
