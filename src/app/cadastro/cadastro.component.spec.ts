import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { CadastroComponent } from './cadastro.component';
type State = {
  isLoading: boolean;
  cadastroRequestStatus: 'error' | 'success' | 'nao enviado',
}

describe('CadastroComponent', () => {
  let component: CadastroComponent;
  let fixture: ComponentFixture<CadastroComponent>;
  // let loginService: LoginService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        // LoginService
      ],
      declarations: [CadastroComponent],
      providers: [
        { provide: HttpClient, useValue: {} },
        { provide: FormBuilder },
        // {provide: LoginService, useValue: {}},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    fixture = TestBed.createComponent(CadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function setForm(email: string = '', password: string = '', username: string = '') {

    component.formGroup.controls['email'].setValue(email);
    component.formGroup.controls['password'].setValue(password);
    component.formGroup.controls['username'].setValue(username);
    fixture.detectChanges();

  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  test('button disabled', () => {
    const cadastroButton = fixture.debugElement.query(By.css('button'))
    const btn = cadastroButton.nativeElement
    expect(btn.disabled).toBe(true);
    expect(component.formGroup.valid).toBe(false);
  });

  test('when set informations button is enabled', () => {
    setForm('admin@amdin', 'admin', 'admin')
    const cadastroButton = fixture.debugElement.query(By.css('button'))
    const btn = cadastroButton.nativeElement
    expect(btn.disabled).toBe(false);
    expect(component.formGroup.valid).toBe(true);
  });

  test('when click cadastrar, show element text Carregando...', () => {
    setForm('admin@amdin', 'admin', 'admin');
    const state$: State = {
      isLoading: true,
      cadastroRequestStatus: 'nao enviado'
    }
    component.state$ = of(state$);
    fixture.detectChanges();
    const loadingElement= fixture.debugElement.query(By.css('#loading'));
    const load = loadingElement.nativeElement;
    const cadastroButton = fixture.debugElement.query(By.css('button'));
    const btn = cadastroButton.nativeElement;
    expect(load.textContent).toBe('carregando...');
    expect(btn.disabled).toBe(true);
  });

  test('when click cadastrar, is show menssage error',()=>{
    const state$: State = {
      isLoading: false,
      cadastroRequestStatus: 'error'
    }
    component.state$ = of(state$);
    fixture.detectChanges();
    const cadastroError= fixture.debugElement.query(By.css('#error'));
    const div = cadastroError.nativeElement;
    expect(div.textContent).toEqual('Usuario ou email já utilizado.')
  })
});

