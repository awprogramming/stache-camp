import { TestBed, inject } from '@angular/core/testing';

import { EvaluationsService } from './evaluations.service';

describe('EvaluationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EvaluationsService]
    });
  });

  it('should be created', inject([EvaluationsService], (service: EvaluationsService) => {
    expect(service).toBeTruthy();
  }));
});
