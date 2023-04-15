import { TestBed } from '@angular/core/testing';

import { GrindstoneService } from './grindstone.service';

describe('GrindstoneService', () => {
  let service: GrindstoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrindstoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
