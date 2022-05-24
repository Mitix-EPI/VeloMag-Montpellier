import { TestBed } from '@angular/core/testing';

import { VelomagService } from './velomag.service';

describe('VelomagService', () => {
  let service: VelomagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VelomagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
