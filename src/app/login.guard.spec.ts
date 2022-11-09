import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LoginGuard } from './login.guard';

let store: any = {}
const sessionStorageMock = {
  getItem: (key: string): string => {
    return store[key]
  },
  setItem: (key: string, value: string) => {
    store[key] = `${value}`
  },
  clear: () => {
    store = {}
  }
}

Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock })
describe('LoginGuard', () => {
  let guard: LoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { navigateByUrl: jest.fn() } }
      ]
    });
    guard = TestBed.inject(LoginGuard);
    window.sessionStorage.clear()
    jest.restoreAllMocks()
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  test('should test isAuthenticated and return false', () => {
    guard.haveToken = false;
    expect(guard.isAuthenticated()).toBe(false)
  })
  test('should test isAuthenticated and return true', () => {
    guard.haveToken = true;
    expect(guard.isAuthenticated()).toBe(true)
  })
});
