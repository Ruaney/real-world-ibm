import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, shareReplay } from 'rxjs';
import { Router } from '@angular/router';

export type State = {
  isLoading: boolean;
  cadastroRequestStatus: 'error' | 'success' | 'nao enviado',
}

let _state: State = {
  isLoading: false,
  cadastroRequestStatus: 'nao enviado',
}

type UserCadastro = {
  email: string,
  password: string,
  username: string
}

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  // err: any[] = []
  private store = new BehaviorSubject<State>(_state);
  public state$ = this.store.asObservable()
  api_url = "https://api.realworld.io/api"
  constructor(private http: HttpClient, private router: Router) { }

  cadastrarConta(form: UserCadastro) {
    const { username, email, password } = form
    const newState =
      this.reducer({
        type: 'cadastro request',
        payload: { username, email, password },

      }, _state)
    this.store.next(newState)
  }

  reducer(action: { type: string, payload?: UserCadastro }, currentState: State): State {
    switch (action.type) {
      case 'cadastro request': {
        this.sideEffect(action.payload!.email, action.payload!.password, action.payload!.username);
        const newState = {
          ...currentState,
          isLoading: true
        }
        return newState as State;
      }
      case 'cadastro success': {
        const newState = {
          ...currentState,
          isLoading: false,
          cadastroRequestStatus: 'success'
        };
        return newState as State;
      }
      case 'cadastro error': {
        const newState = {
          ...currentState,
          isLoading: false,
          cadastroRequestStatus: 'error'
        }

        return newState as State;
      }
      default: {
        return currentState;
      }
    }
  }


  sideEffect(email: string, password: string, username: string) {

    this.http.post(`${this.api_url}/users`, { user: { email, username, password } }).
      subscribe({
        next: (res: any) => {
          const newState = this.reducer({ type: 'cadastro success' }, _state)
          this.store.next(newState)
          this.router.navigate(['/'])
        },
        error: () => {
          const newState = this.reducer({ type: 'cadastro error' }, _state);
          this.store.next(newState);
        },

      })
  }
}

