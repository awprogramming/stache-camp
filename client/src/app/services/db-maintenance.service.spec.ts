import { TestBed, inject } from '@angular/core/testing';

import { DbMaintenanceService } from './db-maintenance.service';

describe('DbMaintenanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DbMaintenanceService]
    });
  });

  it('should be created', inject([DbMaintenanceService], (service: DbMaintenanceService) => {
    expect(service).toBeTruthy();
  }));
});
