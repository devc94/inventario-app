import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {TokenService} from "../../services/token.service";
import {Router} from "@angular/router";
import {UserLoginDto} from "../../models/user-login.dto";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: UserLoginDto;
  public loginForm: FormGroup;

  constructor(
    private _authService: AuthService,
    private _tokenService: TokenService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.user = new UserLoginDto('', '');
  }

  ngOnInit(): void {
  }

  login(): void {
    this.user = this.loginForm.value;
    this._authService.login(this.user).subscribe({
      next: (data) => {
        if (!data.token) {
          return this.toastr.error('Credenciales incorrectas');
        }
        this._tokenService.setToken(data.token);
        return this.router.navigate(['/']).then();
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
  }

}
