import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { State } from '../models/State';


import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        ReactiveFormsModule,
      ],
      declarations: [LoginComponent],
      providers: [
        { provide: HttpClient, useValue: {} },
        { provide: FormBuilder },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  function setForm(email: string = '', password: string = '') {

    component.formGroup.controls['inputEmail'].setValue(email);
    component.formGroup.controls['inputPassw'].setValue(password);
    fixture.detectChanges();

  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('button disabled', () => {

    const loginButton = fixture.debugElement.query(By.css('button'));
    const btn = loginButton.nativeElement;

    expect(component.formGroup.valid).toBe(false);
    expect(btn.disabled).toBe(true);
  });

  test('when set informations, button is enabled', () => {

    setForm('email@email', 'passwsss');
    const loginButton = fixture.debugElement.query(By.css('button'))
    const btn = loginButton.nativeElement;

    expect(btn.disabled).toBe(false);
  })

  test('when click on button logar, button is disabled and show message carregando...', () => {
    setForm('email@email', 'passwsss');
    let state$: State = {
      isLoading: true,
      loginRequestStatus: 'nao enviado'
    };
    component.state$ = of(state$);
    fixture.detectChanges();

    const divLoading = fixture.debugElement.query(By.css('.isLoading'));
    const load = divLoading.nativeElement;
    const loginButton = fixture.debugElement.query(By.css('button'));
    const btn = loginButton.nativeElement;
    expect(load.textContent).toBe('aguarde...')
    expect(btn.disabled).toBe(true);

  })

  test('when click on button logar, is return error and show message error', () => {
    setForm('email@email', 'passwsss');
    let state$: State = {
      isLoading: false,
      loginRequestStatus: 'error'
    };
    component.state$ = of(state$);

    fixture.detectChanges();
    const divError = fixture.debugElement.query(By.css('.error'));
    const err = divError.nativeElement;
    expect(err.textContent).toBe('deu erro, email ou senha errado')


  })

});
