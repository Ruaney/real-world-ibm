import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, map, } from 'rxjs';

export type state = 'error' | 'success' | 'loading';
import { HttpClient } from '@angular/common/http';
export type payload = { email: string; password: string };
import { State } from '../models/State'
type User = {
  email: string,
  password: string
}
type FormLogin = {
  email: string;
  password: string;
}

let _state: State = {
  isLoading: false,
  loginRequestStatus: 'nao enviado',
  isLogged: false,
}

@Injectable()
export class LoginService {

  private readonly API_URL = 'https://api.realworld.io/api';

  private store = new BehaviorSubject<State>(_state);

  public state$ = this.store.asObservable();

  public status$ = this.state$.pipe(
    map((s) => s.loginRequestStatus),
    distinctUntilChanged()
  )

  public isLoading$ = this.state$.pipe(
    map((s) => s.isLoading),
    distinctUntilChanged()
  );

  public isLogged$ = this.state$.pipe(map((s) => { return s.isLogged }))


  constructor(private httpCliente: HttpClient, private router: Router) { }

  loginSubmit(email: string, password: string): void {
    const newState = this.reducer({
      type: 'login request',
      payload: { email, password }
    }, _state);

    this.setState(newState);
  }

  logoutSubmit() {
    const newState = this.reducer({
      type: 'logout request',
    }, _state)
    this.setState(newState);
  }

  private reducer(
    action: { type: string; payload?: User },
    currentState: State
  ): State {
    switch (action.type) {
      case 'logout request': {
        this.sideEffectLogout();
        const newState = { ...currentState };
        return newState as State;
      }
      case 'login request': {
        this.sideEffect(action.payload!.email, action.payload!.password);
        const newState = { ...currentState, isLoading: true, isLogged: false };
        return newState as State;
      }
      case 'login success': {
        const newState = {
          ...currentState,
          isLoading: false,
          loginRequestStatus: 'success',
          isLogged: true
        };
        return newState as State;
      }
      case 'login erro': {
        const newState = {
          ...currentState,
          isLoading: false,
          loginRequestStatus: 'error',
          isLogged: false,
        }
        return newState as State;
      }
      case 'logout request': {
        this.sideEffectLogout();
        const newState = {
          ...currentState
        }
        return newState as State;
      }
      case 'logout success': {
        const newState = {
          ...currentState,
          loginRequestStatus: 'success',
          isLogged: false,
          isLoading: false,
        }
        return newState as State;
      }
      default: {
        return currentState;
      }
    };

  }

  sideEffect(email: string, password: string) {
    this.httpCliente.post(`${this.API_URL}/users/login`, { user: { email, password } })
      .subscribe({
        next: (res: any) => {
          const newState = this.reducer({ type: 'login success' }, _state)
          if (res.user == undefined) {
            this.router.navigateByUrl('login')
          } else {
            sessionStorage.setItem('token', res.user.token);
          }
          this.store.next(newState);
          this.router.navigateByUrl('home')
        },
        error: () => {
          const newState = this.reducer({ type: 'login erro' }, _state);
          this.store.next(newState);
        },
      })
  }

  sideEffectLogout() {
    const newState = this.reducer({ type: 'logout success' }, _state)
    this.store.next(newState);
    sessionStorage.clear()
    this.router.navigateByUrl('/')

  }
  setState(state: State) {
    this.store.next(state)
  }

}
