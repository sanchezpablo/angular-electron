import { Component, ViewEncapsulation, OnInit, AfterViewInit, ViewChildren } from '@angular/core';
import { AuthenticationService } from '../../../providers/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { select } from '@angular-redux/store';

@Component({
    selector: 'app-signin',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, AfterViewInit {
    @ViewChildren('input') formInputs;
    @select() loginLastError;

    constructor(private authService: AuthenticationService, private formBuilder: FormBuilder, private translate: TranslateService) {}

    username = new FormControl('', [Validators.required, Validators.email]);
    password = new FormControl('', [Validators.required, Validators.minLength(6)]);
    showSpinner: boolean;

    signinForm = this.formBuilder.group({username: this.username, password: this.password});

    ngOnInit() {
    }

    ngAfterViewInit() {
      this.formInputs.first.nativeElement.focus();
    }

    login(): void {
      this.authService.login(this.username.value, this.password.value);
    }

    signup() {
      this.authService.signup(this.username.value, this.password.value);
    }

    logout() {
      this.authService.logout();
    }

    getUsernameErrorMessage() {
      return this.username.hasError('required') ? 'You must enter a value' :
          this.username.hasError('email') ? 'Not a valid email' : '';
    }

    getPasswordErrorMessage() {
      return this.password.hasError('required') ? 'You must enter a value' :
          this.password.hasError('minLength') ? 'Min length is 6 characters' : '';
    }
}
