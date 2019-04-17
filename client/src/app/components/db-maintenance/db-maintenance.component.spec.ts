import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbMaintenanceComponent } from './db-maintenance.component';

describe('DbMaintenanceComponent', () => {
  let component: DbMaintenanceComponent;
  let fixture: ComponentFixture<DbMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
