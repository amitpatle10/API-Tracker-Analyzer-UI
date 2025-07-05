import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiAnalyzerComponent } from './api-analyzer.component';

describe('ApiAnalyzerComponent', () => {
  let component: ApiAnalyzerComponent;
  let fixture: ComponentFixture<ApiAnalyzerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiAnalyzerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApiAnalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
