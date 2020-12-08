import { TestBed } from '@angular/core/testing';

import { QuizGuardGuard } from './quiz-guard.guard';

describe('QuizGuardGuard', () => {
  let guard: QuizGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(QuizGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
