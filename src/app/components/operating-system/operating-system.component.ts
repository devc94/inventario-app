import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {OperatingSystem} from '../../models/operating-system';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {OperatingSystemService} from '../../services/operating-system.service';
import {TokenService} from "../../services/token.service";
import {RoleService} from "../../services/role.service";
import {Role} from "../../models/role";
import {Title} from "@angular/platform-browser";

declare var window: any;

@Component({
  selector: 'app-operating-system',
  templateUrl: './operating-system.component.html',
  styleUrls: ['./operating-system.component.scss']
})
export class OperatingSystemComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: true})
  // @ts-ignore
  public dtElement: DataTableDirective;

  osList: OperatingSystem[] = [];
  oneOS = <OperatingSystem>{};
  idToDelete: number = 0;

  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  addModal: any;
  editModal: any;
  deleteModal: any;

  canAdd: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;

  public osForm: FormGroup;

  constructor(
    private osService: OperatingSystemService,
    private _tokenService: TokenService,
    private _roleService: RoleService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private title: Title,
  ) {
    this.title.setTitle('Sistemas Operativos');
    this.osForm = this.fb.group({
      id: [],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      architecture: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.tableOptions();
    this.osService.get().subscribe({
      next: (result: OperatingSystem[]) => {
        this.osList = result;
        this.dtTrigger.next(0);
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });

    const roleId = this._tokenService.getRoleId();
    this._roleService.getById(roleId).subscribe((result: Role) => {
      const p = result.permissions.split(',');
      this.canAdd = p[9] === '1';
      this.canEdit = p[10] === '1';
      this.canDelete = p[11] === '1';
    });

    this.addModal = new window.bootstrap.Modal(document.getElementById('addOSModal'));
    this.editModal = new window.bootstrap.Modal(document.getElementById('editOSModal'));
    this.deleteModal = new window.bootstrap.Modal(document.getElementById('deleteOSModal'));
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
          exportOptions: {columns: [0, 1, 2]},
        },
        {
          extend: 'print',
          exportOptions: {columns: [0, 1, 2]},
        },
        {
          extend: 'excel',
          exportOptions: {columns: [0, 1, 2]},
        },
        {
          extend: 'csv',
          exportOptions: {columns: [0, 1, 2]},
        },
      ],
    }
  }

  openAddOSModal(): void {
    this.osForm = this.fb.group({
      id: [],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      architecture: ['', Validators.required]
    });
    this.addModal.show();
  }

  openEditOSModal(id?: number): void {
    if (id) {
      this.getOperatingSystem(id);
      this.editModal.show();
    }
  }

  openDeleteOSModal(id?: number): void {
    if (id) {
      this.idToDelete = id;
      this.deleteModal.show();
    }
  }

  getOperatingSystems(): void {
    // this.tableOptions();
    this.osService.get().subscribe({
      next: (result: OperatingSystem[]) => {
        this.osList = result;
        this.rerenderer();
      },
      error: (error) => {
        this.toastr.error(error);
      }
    });
  }

  getOperatingSystem(id: number): void {
    this.osService.getByID(id).subscribe({
      next: (result: OperatingSystem) => {
        this.oneOS = result;
        this.osForm.patchValue({
          id: result.id,
          name: result.name,
          architecture: result.architecture
        });
      },
      error: (error) => {
        this.toastr.error(error);
      }
    });
  }


  createOperatingSystem(): void {
    this.osService.create(this.osForm.value).subscribe({
      next: () => {
        this.osForm.reset();
        this.getOperatingSystems();
        this.addModal.hide();
        this.toastr.success('Sistema Operativo agregado');
      },
      error: (error) => {
        if (error.status == 409) {
          this.toastr.error('Ya existe un sistema operativo con ese nombre');
        } else {
          this.toastr.error(error.message);
        }
      }
    });
  }

  updateOperatingSystem(): void {
    this.osService.update(this.osForm.value).subscribe({
      next: () => {
        this.osForm.reset();
        this.getOperatingSystems();
        this.editModal.hide();
        this.toastr.success('Sistema Operativo modificado');
      },
      error: (error) => {
        if (error.status == 409) {
          this.toastr.error('Ya existe un sistema operativo con ese nombre');
        } else {
          this.toastr.error(error.message);
        }
      }
    });
  }

  deleteOperatingSystem(): void {
    this.osService.delete(this.idToDelete).subscribe({
      next: () => {
        const deleted = this.osList.find(x => x.id === this.idToDelete);
        if (deleted) {
          this.getOperatingSystems();
          // this.osList.splice(this.osList.indexOf(deleted), 1);
          this.toastr.success('Sistema Operativo eliminado');
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
