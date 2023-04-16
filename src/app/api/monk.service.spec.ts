import { TestBed } from '@angular/core/testing';

import { MonkService } from './monk.service';

describe('MonkService', () => {
  let service: MonkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
