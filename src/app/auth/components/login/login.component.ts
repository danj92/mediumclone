import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageAnalytics } from '../../../decorators/page-analytic';
import { myPrintLog } from '../../../decorators/print-log';
import { AppStateInterface } from '../../../shared/types/appState.interface';
import { BackendErrorsInterface } from '../../../shared/types/backendErrors.interface';
import { loginAction } from '../../store/actions/login.action';
import { isSubmittingSelector, validationErrorsSelector } from '../../store/selectors';
import { LoginRequestInterface } from '../../types/loginRequest.interface';

@Component({
    selector: 'mc-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    standalone: false
})
@PageAnalytics('LoginComponent')
export class LoginComponent {
  form: FormGroup;
  isSubmitting$: Observable<boolean>;
  backendErrors$: Observable<BackendErrorsInterface | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppStateInterface>,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeValues();
  }

  initializeValues() {
    this.isSubmitting$ = this.store.pipe(select(isSubmittingSelector));
    this.backendErrors$ = this.store.pipe(
      select(validationErrorsSelector),
    ) as Observable<BackendErrorsInterface | null>;
  }

  @myPrintLog('Inicializacja form')
  initializeForm(): void {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    const request: LoginRequestInterface = {
      user: this.form.value,
    };
    this.store.dispatch(loginAction({ request }));
  }
}
