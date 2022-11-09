import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService],
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup = this.formBuilder.group({
    inputEmail: ['', Validators.required],
    inputPassw: ['', Validators.required],

  });

  constructor(private loginService: LoginService, private formBuilder: FormBuilder) { }
  state$ = this.loginService.state$
  isLogged = this.loginService.isLogged$
  ngOnInit(): void {

  }

  onSubmit() {
    const { inputEmail, inputPassw } = this.formGroup.value;
    this.loginService.loginSubmit(
      inputEmail!, inputPassw
    );
    if (this.isLogged) {
      // this.router.navigateByUrl('list-articles')

    }
  }
}
