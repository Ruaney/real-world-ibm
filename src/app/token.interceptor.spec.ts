import { HttpHeaders, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TokenInterceptor } from './token.interceptor';
import { of } from 'rxjs';
const API_URL = 'https://demo.realworld.io/api'
let store: any = {};
const mockSessionStorage = {
  getItem: (key: string): string => {
    return key in store ? store[key] : null;
  },
  setItem: (key: string, value: string) => {
    store[key] = `${value}`;
  },
  removeItem(key:string) {
    delete store[key];
  },
  clear: () => {
    store = {}
  }
};

Object.defineProperty(window, 'sessionStorage',{
  value: mockSessionStorage
})
describe('TokenInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let service: TokenInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        },

      ]
    });

    httpTestingController = TestBed.inject(HttpTestingController)
    service = TestBed.inject(TokenInterceptor);
    window.sessionStorage.clear()
    jest.restoreAllMocks();
  });

  afterEach(() => {
    //nao tem mais requests pendentes.
    httpTestingController.verify();
  })
  it('should be created', () => {
    const interceptor: TokenInterceptor = TestBed.inject(TokenInterceptor);

    expect(interceptor).toBeTruthy();
  });
  test('should go through function intercept', (done) => {
    const endpoint = `${API_URL}/articles`;
    sessionStorage.setItem('token', '1234')
    const getItemSpy = jest.spyOn(window.sessionStorage, 'getItem');
    const mockReq = new HttpRequest('GET', endpoint);
    const nextMock = {
      handle: jest.fn(() => of(new HttpResponse({ status: 200 })))
    }

    service.intercept(mockReq, nextMock).subscribe((res:any) => {
      expect(res.status).toBe(200)
      expect(getItemSpy).toHaveBeenCalled()
      expect(window.sessionStorage.getItem('token')).toBe('1234')
      done();
    });

  });

});
