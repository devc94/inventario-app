import {Component, OnInit} from '@angular/core';
import {TokenService} from "../../services/token.service";
import {Router} from "@angular/router";
import {Payload} from "../../models/payload";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {ChangePasswordDto} from "../../models/change-password.dto";
import {ToastrService} from "ngx-toastr";

declare var window: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: Payload;
  isLogged: boolean = false;

  name: string;

  changePasswordModal: any;

  public changePasswordForm: FormGroup;

  constructor(
    private _userService: UserService,
    private _tokenService: TokenService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.name = '';
    this.user = new Payload(0, '', '', '', 0);

    this.changePasswordForm = this.fb.group({
      id: [],
      current_password: new FormControl('', Validators.required),
      new_password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.user = this._tokenService.getUser()!;
    this.name = this._tokenService.getName()!;
    this._tokenService.isLogged() ? this.isLogged = true : this.isLogged = false;

    this.changePasswordModal = new window.bootstrap.Modal(document.getElementById('changePasswordModal'));
  }

  openChangePasswordModal(): void {
    this.changePasswordForm.patchValue({
      id: this.user.id,
    });
    this.changePasswordModal.show();
    console.log(this.changePasswordForm.value);
  }

  changePassword(): void {
    const id = +this.changePasswordForm.get('id')?.value;
    const newPassword = this.changePasswordForm.get('new_password')?.value;
    const changePassword = new ChangePasswordDto(id, newPassword);
    console.log(changePassword);
    this._userService.changePassword(changePassword).subscribe({
      next: () => {
        this.changePasswordForm.reset();
        this.changePasswordModal.hide();
        this.toastr.success('Contraseña modificada correctamente');
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
  }

  logout(): void {
    this._tokenService.logout();
    this.router.navigate(['/login']).then();
  }

}
