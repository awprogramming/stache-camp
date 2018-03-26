import { TestBed, inject } from '@angular/core/testing';

import { MedsService } from './meds.service';

describe('MedsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MedsService]
    });
  });

  it('should be created', inject([MedsService], (service: MedsService) => {
    expect(service).toBeTruthy();
  }));
});
