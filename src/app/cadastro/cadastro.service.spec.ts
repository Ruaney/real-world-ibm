import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { delay, of, switchMap, take, throwError, toArray } from 'rxjs';

import { CadastroService } from './cadastro.service';

describe('CadastroService', () => {
  let service: CadastroService;
  let httpClientMock = { post: jest.fn() };
  // let routerStub = 
  const form = {
    username: 'admin',
    password: 'admin',
    email: 'admin@mail.com',
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CadastroService,
        { provide: HttpClient, useValue: httpClientMock },
        { privide: Router, useValue: { navigateByUrl: () => jest.fn() } }
      ]
    });
    service = TestBed.inject(CadastroService);
  });
  afterEach(() => {
    httpClientMock.post.mockReset();
  })
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('initial state', (done) => {
    service.state$.pipe(take(1)).subscribe((initValues) => {

      expect(initValues.isLoading).toEqual(false);
      expect(initValues.cadastroRequestStatus).toEqual('nao enviado');

      done();
    });
  });

  test('cadastroRequestStatus return success', (done) => {
    
    httpClientMock.post.mockReturnValue(of('cadastro request')
      .pipe(delay(1)))

    service.state$.pipe(take(3), toArray()).subscribe((s) => {

      expect(s[2].cadastroRequestStatus).toBe('success');
      expect(s[1].isLoading).toBe(true);

      done();
    });
    service.cadastrarConta(form);
  })

  test('should be error when execute cadastro request', (done) => {
    httpClientMock.post.mockReturnValue(of('cadastro error')
      .pipe(delay(1),
        switchMap(() => throwError(() => new Error('error')))
      ))

    service.state$
      .pipe(take(3), toArray()).subscribe((s) => {
        expect(s[2].cadastroRequestStatus).toBe('error')
        expect(s[2].isLoading).toBe(false);
        done();
      })
      service.cadastrarConta(form)
  })
});