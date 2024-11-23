import { Component, Input, OnInit } from '@angular/core';
import { BackendErrorsInterface } from '../../../../types/backendErrors.interface';

@Component({
    selector: 'mc-backend-error-messages',
    templateUrl: './backend-error-messages.component.html',
    styleUrl: './backend-error-messages.component.scss',
    standalone: false
})
export class BackendErrorMessagesComponent implements OnInit {
  @Input('backendErrorsProps') backendErrorsProps: BackendErrorsInterface | null;
  errorMessages: string[];
  ngOnInit(): void {
    this.errorMessages = Object.keys(this.backendErrorsProps as BackendErrorsInterface).map(
      (name) => {
        const messages = (this.backendErrorsProps as BackendErrorsInterface)[name].join(', ');

        return `${name} ${messages}`;
      },
    );
  }
}
