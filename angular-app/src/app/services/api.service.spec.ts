import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have correct environment info', () => {
    const envInfo = service.getEnvironmentInfo();
    expect(envInfo).toBeDefined();
    expect(envInfo.apiUrl).toBeDefined();
    expect(envInfo.endpoints).toBeDefined();
  });
});
