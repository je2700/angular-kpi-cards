import { TestBed } from '@angular/core/testing';

import { KpiData } from './kpi-data';

describe('KpiData', () => {
  let service: KpiData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
