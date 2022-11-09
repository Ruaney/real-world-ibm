import { HttpClient } from '@angular/common/http';

import {  TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { delay, of, switchMap, take, throwError, toArray } from 'rxjs';

import { LoginService } from './login-service.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpClientMock = { post: jest.fn(), logout: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientMock },
        {
          provide: Router, useValue: {
            navigateByUrl: jest.fn()
          }
        },
        LoginService,
      ]
    });
    service = TestBed.inject(LoginService);

  });

  afterEach(() => {
    httpClientMock.post.mockReset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('state initial value', (done) => {
    service.state$.pipe(take(1)).subscribe((initialState) => {
      expect(initialState.isLoading).toEqual(false);
      expect(initialState.loginRequestStatus).toEqual('nao enviado');
      done();
    });
  });

  test('loginRequestStatus return success', (done) => {

    httpClientMock.post.mockReturnValue(of('login request').pipe(delay(1)));

    service.state$.pipe(take(3), toArray()).subscribe((s) => {

      expect(s[2].isLoading).toEqual(false);
      expect(s[2].loginRequestStatus).toEqual('success');
      expect(s[2].isLogged).toEqual(true);
      done();
    });

    service.loginSubmit('oi', 'test');
  });

  test('should be error when execute request login', (done) => {

    httpClientMock.post.mockReturnValue(
      of('login error').pipe(
        delay(1),
        switchMap(() => throwError(() => new Error('error')))
      )
    );


    service.state$.pipe(take(3), toArray()).subscribe((s) => {
      expect(s[2].loginRequestStatus).toEqual('error');
      expect(s[2].isLoading).toEqual(false);
      expect(s[2].isLogged).toEqual(false);

      done();
    })
    service.loginSubmit('oi', 'test');
  });

  test('should be success when execute logout', (done) => {
    sessionStorage.setItem('token', 'test');
    httpClientMock.logout.mockReturnValue(of('logout request').pipe(delay(1)));
    service.state$.pipe(take(3), toArray()).subscribe((s) => {
      expect(s[1].isLogged).toBe(false);
      expect(sessionStorage.getItem('token')).toBe(null);

      done();
    })

    service.logoutSubmit();
  })


});
