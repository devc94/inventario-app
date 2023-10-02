import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Department} from '../../models/department';
import {Subject} from 'rxjs';
import {DepartmentService} from '../../services/department.service';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TokenService} from "../../services/token.service";
import {RoleService} from "../../services/role.service";
import {Role} from "../../models/role";
import {Title} from "@angular/platform-browser";

declare var window: any;

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: true})
  // @ts-ignore
  public dtElement: DataTableDirective;

  departmentList: Department[] = [];
  oneDepartment = <Department>{};
  idToDelete: number = 0;

  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  addModal: any;
  editModal: any;
  deleteModal: any;

  canAdd: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;

  public departmentForm: FormGroup;

  constructor(
    private departmentService: DepartmentService,
    private _tokenService: TokenService,
    private _roleService: RoleService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private title: Title,
  ) {
    this.title.setTitle('Departamentos');
    this.departmentForm = this.fb.group({
      id: [],
      name: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.tableOptions();
    this.departmentService.get().subscribe((result: Department[]) => {
      this.departmentList = result;
      this.dtTrigger.next(0);
    });

    const roleId = this._tokenService.getRoleId();
    this._roleService.getById(roleId).subscribe((result: Role) => {
      const p = result.permissions.split(',');
      this.canAdd = p[0] === '1';
      this.canEdit = p[1] === '1';
      this.canDelete = p[2] === '1';
    });

    this.addModal = new window.bootstrap.Modal(document.getElementById('addDepartmentModal'));
    this.editModal = new window.bootstrap.Modal(document.getElementById('editDepartmentModal'));
    this.deleteModal = new window.bootstrap.Modal(document.getElementById('deleteDepartmentModal'));
  }

  ngOnDestroy(): void {
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

  openAddDepartmentModal(): void {
    this.departmentForm = this.fb.group({
      id: [],
      name: new FormControl({value: '', disabled: false}, [Validators.required, Validators.maxLength(50)]),
    });
    this.addModal.show();
  }

  openEditDepartmentModal(id?: number): void {
    if (id) {
      this.getDepartment(id);
      this.editModal.show();
    }
  }

  openDeleteDepartmentModal(id?: number): void {
    if (id) {
      this.idToDelete = id;
      this.deleteModal.show();
    }
  }

  getDepartments(): void {
    // this.tableOptions();
    this.departmentService.get().subscribe((result: Department[]) => {
      this.departmentList = result;
      this.rerenderer();
    });
  }

  getDepartment(id: number): void {
    this.departmentService.getByID(id).subscribe((result: Department) => {
      this.oneDepartment = result;
      this.departmentForm.patchValue({
        id: result.id,
        name: result.name,
      });
    });
  }

  createDepartment(): void {
    this.departmentService.create(this.departmentForm.value).subscribe({
      next: () => {
        this.departmentForm.reset();
        this.getDepartments();
        this.addModal.hide();
        this.toastr.success('Departamento agregado');
      },
      error: (error) => {
        if (error.status == 409) {
          this.toastr.error('Ya existe un departamento con ese nombre');
        } else {
          this.toastr.error(error.message);
        }
      }
    });
  }

  updateDepartment(): void {
    this.departmentService.update(this.departmentForm.value).subscribe({
      next: () => {
        this.departmentForm.reset();
        this.getDepartments();
        this.editModal.hide();
        this.toastr.success('Departamento modificado');
      },
      error: (error) => {
        if (error.status == 409) {
          this.toastr.error('Ya existe un departamento con ese nombre');
        } else {
          this.toastr.error(error.message);
        }
      }
    });
  }

  deleteDepartment(): void {
    this.departmentService.delete(this.idToDelete).subscribe({
      next: () => {
        const deleted = this.departmentList.find(x => x.id === this.idToDelete);
        if (deleted) {
          this.getDepartments();
          // this.departmentList.splice(this.departmentList.indexOf(deleted), 1);
          // this.rerenderer();
          this.toastr.success('Departamento eliminado');
        }
        this.deleteModal.hide();
      },
      error: () => {
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
