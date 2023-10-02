import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from "angular-datatables";
import {User} from "../../models/user";
import {Subject} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {TokenService} from "../../services/token.service";
import {RoleService} from "../../services/role.service";
import {ToastrService} from "ngx-toastr";
import {Role} from "../../models/role";
import {NewUserDto} from "../../models/new-user.dto";
import {UpdateUserDto} from "../../models/update-user.dto";
import {Title} from "@angular/platform-browser";

declare var window: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: true})
  // @ts-ignore
  public dtElement: DataTableDirective;

  usersList: User[] = [];
  rolesList: Role[] = [];
  oneUser = <User>{};
  idToDelete: number = 0;
  newUserPassword: string = ''

  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  addModal: any;
  editModal: any;
  deleteModal: any;
  showUserPasswordModal: any;

  canAdd: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;

  public selectedValue: number = 0;

  public newUserForm: FormGroup;
  public updateUserForm: FormGroup;

  constructor(
    private _userService: UserService,
    private _tokenService: TokenService,
    private _roleService: RoleService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private title: Title,
  ) {
    this.title.setTitle('Usuarios');
    this.newUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      username: ['', [Validators.required, Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', Validators.required],
      role: [0, Validators.required]
    });
    this.updateUserForm = this.fb.group({
      id: [],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      username: ['', [Validators.required, Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.maxLength(100)]],
      role: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.tableOptions();
    this._userService.get().subscribe({
      next: (result: User[]) => {
        this.usersList = result;
        this.dtTrigger.next(0);
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
    this._roleService.get().subscribe({
      next: (result: Role[]) => {
        this.rolesList = result;
        if (this.rolesList.length > 0) {
          this.selectedValue = this.rolesList[0].id!;
        }
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });

    const roleId = this._tokenService.getRoleId();
    this._roleService.getById(roleId).subscribe((result: Role) => {
      const p = result.permissions.split(',');
      console.log(p);
      
      this.canAdd = p[18] === '1';
      this.canEdit = p[19] === '1';
      this.canDelete = p[20] === '1';
    });

    this.addModal = new window.bootstrap.Modal(document.getElementById('addUserModal'));
    this.editModal = new window.bootstrap.Modal(document.getElementById('editUserModal'));
    this.deleteModal = new window.bootstrap.Modal(document.getElementById('deleteUserModal'));
    this.showUserPasswordModal = new window.bootstrap.Modal(document.getElementById('showNewUserPasswordModal'));
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  tableOptions(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json'
      },
      dom: '<"container-fluid p-0"<"row"<"col"B><"col"f>>>rtip <"bottom"l>',
      buttons: [
        {
          extend: 'copy',
          exportOptions: {columns: [0, 1]},
        },
        {
          extend: 'print',
          exportOptions: {columns: [0, 1]},
        },
        {
          extend: 'excel',
          exportOptions: {columns: [0, 1]},
        },
        {
          extend: 'csv',
          exportOptions: {columns: [0, 1]},
        },
      ],
    }
  }

  generatePassword(): string {
    return Math.random().toString(36).slice(-8);
  }

  openAddUserModal(): void {
    this.newUserPassword = this.generatePassword();
    this.newUserForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: [this.newUserPassword, Validators.required],
      role: [this.selectedValue, Validators.required]
    });
    this.addModal.show();
  }

  openEditUserModal(id?: number): void {
    if (id) {
      this.getUser(id);
      this.editModal.show();
    }
  }

  openDeleteUserModal(id?: number): void {
    if (id) {
      this.idToDelete = id;
      this.deleteModal.show();
    }
  }

  getUsers(): void {
    // this.tableOptions();
    this._userService.get().subscribe({
      next: (result: User[]) => {
        this.usersList = result;
        this.rerenderer();
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
  }

  getUser(id: number): void {
    this._userService.getById(id).subscribe({
      next: (result: User) => {
        this.oneUser = result;
        this.updateUserForm.patchValue({
          id: result.id,
          name: result.name,
          username: result.username,
          email: result.email,
          role: result.role.id,
        });
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
  }

  createUser(): void {
    const name = this.newUserForm.get('name')?.value;
    const username = this.newUserForm.get('username')?.value;
    const email = this.newUserForm.get('email')?.value;
    const password = this.newUserForm.get('password')?.value;
    const role = +this.newUserForm.get('role')?.value;

    const newUser = new NewUserDto(name, username, email, password, role);
    this._userService.create(newUser).subscribe({
      next: () => {
        this.newUserForm.reset();
        this.getUsers();
        this.addModal.hide();
        this.toastr.success('Usuario agregado');
        this.showUserPasswordModal.show();
      },
      error: (error) => {
        if (error.status == 409) {
          this.toastr.error('Ya existe un usuario con ese nombre de usuario');
        } else {
          this.toastr.error(error.message);
        }
      }
    });
  }

  updateUser(): void {
    const id = this.updateUserForm.get('id')?.value;
    const name = this.updateUserForm.get('name')?.value;
    const username = this.updateUserForm.get('username')?.value;
    const email = this.updateUserForm.get('email')?.value;
    const role = this.updateUserForm.get('role')?.value;


    const updatedUser = new UpdateUserDto(id, name, username, email, role);
    this._userService.update(updatedUser).subscribe({
      next: () => {
        this.updateUserForm.reset();
        this.getUsers();
        this.editModal.hide();
        this.toastr.success('Usuario modificado');
      },
      error: (error) => {
        if (error.status == 409) {
          this.toastr.error('Ya existe un usuario con ese nombre de usuario');
        } else {
          this.toastr.error(error.message);
        }
      }
    });
  }

  deleteUser(): void {
    this._userService.delete(this.idToDelete).subscribe({
      next: () => {
        const deleted = this.usersList.find(x => x.id === this.idToDelete);
        if (deleted) {
          this.getUsers();
          // this.usersList.splice(this.usersList.indexOf(deleted), 1);
          this.toastr.success('Usuario eliminado');
        }
        this.deleteModal.hide();
      },
      error: (error) => {
        this.toastr.error('No se puede eliminar');
      }
    });
  }

  rerenderer(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(0);
    });
  }
}
