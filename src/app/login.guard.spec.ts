import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LoginGuard } from './login.guard';
describe('LoginGuard', () => {
  let guard: LoginGuard;
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { navigateByUrl: jest.fn() } }
      ]
    });
    guard = TestBed.inject(LoginGuard);
    router = TestBed.get(Router);

  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  test('should test isAuthenticated and return false and redirect login', () => {
    const navigateByUrlSpy = jest.spyOn(router, 'navigateByUrl');
    
    guard.haveToken = false;

    expect(guard.isAuthenticated()).toBe(false)
    expect(navigateByUrlSpy).toHaveBeenCalled();

  })
  test('should test isAuthenticated and return true', () => {
    guard.haveToken = true;
    expect(guard.isAuthenticated()).toBe(true)
  })
});
