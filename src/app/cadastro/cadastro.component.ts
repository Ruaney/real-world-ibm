

import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CadastroService } from './cadastro.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {
  formGroup: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    username: ['', [Validators.required]]
  })
  constructor(private formBuilder: FormBuilder,
    private cadastroS: CadastroService) { }

  state$ = this.cadastroS.state$
  onSubmit() {

    this.cadastroS.cadastrarConta(this.formGroup.value)


  }
}
