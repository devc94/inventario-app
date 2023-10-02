import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {BranchOffice} from '../../models/branch-office';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BranchOfficeService} from '../../services/branch-office.service';
import {ToastrService} from 'ngx-toastr';
import {Role} from "../../models/role";
import {TokenService} from "../../services/token.service";
import {RoleService} from "../../services/role.service";
import {Title} from "@angular/platform-browser";

declare var window: any;

@Component({
  selector: 'app-branch-office',
  templateUrl: './branch-office.component.html',
  styleUrls: ['./branch-office.component.scss']
})
export class BranchOfficeComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: true})
  // @ts-ignore
  public dtElement: DataTableDirective;

  boList: BranchOffice[] = [];
  oneBO = <BranchOffice>{};
  idToDelete: number = 0;

  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  addModal: any;
  editModal: any;
  deleteModal: any;

  canAdd: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;

  public boForm: FormGroup;

  constructor(
    private _boService: BranchOfficeService,
    private _tokenService: TokenService,
    private _roleService: RoleService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private title: Title,
  ) {
    this.title.setTitle('Sucursales');
    this.boForm = this.fb.group({
      id: [],
      name: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.tableOptions();
    this._boService.get().subscribe({
      next: (result: BranchOffice[]) => {
        this.boList = result;
        this.dtTrigger.next(0);
      },
      error: (error) => {
        this.toastr.error(error);
      }
    });

    const roleId = this._tokenService.getRoleId();
    this._roleService.getById(roleId).subscribe((result: Role) => {
      const p = result.permissions.split(',');
      this.canAdd = p[3] === '1';
      this.canEdit = p[4] === '1';
      this.canDelete = p[5] === '1';
    });
    this.addModal = new window.bootstrap.Modal(document.getElementById('addBOModal'));
    this.editModal = new window.bootstrap.Modal(document.getElementById('editBOModal'));
    this.deleteModal = new window.bootstrap.Modal(document.getElementById('deleteBOModal'));
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

  openAddBOModal(): void {
    this.boForm.reset();
    this.addModal.show();
  }

  openEditBOModal(id?: number): void {
    if (id) {
      this.getBranchOffice(id);
      this.editModal.show();
    }
  }

  openDeleteBOModal(id?: number): void {
    if (id) {
      this.idToDelete = id;
      this.deleteModal.show();
    }
  }

  getBranchOffices(): void {
    this._boService.get().subscribe({
      next: (result: BranchOffice[]) => {
        this.boList = result;
        this.rerenderer();
      },
      error: (error) => {
        this.toastr.error(error);
      }
    });
  }

  getBranchOffice(id: number): void {
    this._boService.getByID(id).subscribe({
      next: (result: BranchOffice) => {
        this.oneBO = result;
        this.boForm.patchValue({
          id: result.id,
          name: result.name
        });
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
  }

  createBranchOffice(): void {
    this._boService.create(this.boForm.value).subscribe({
      next: () => {
        this.boForm.reset();
        this.getBranchOffices();
        this.addModal.hide();
        this.toastr.success('Sucursal agregada');
      },
      error: (error) => {
        if (error.status == 409) {
          this.toastr.error('Ya existe una sucursal con ese nombre');
        } else {
          this.toastr.error(error.message);
        }
      }
    });
  }

  updateBranchOffice(): void {
    this._boService.update(this.boForm.value).subscribe({
      next: () => {
        this.boForm.reset();
        this.getBranchOffices();
        this.editModal.hide();
        this.toastr.success('Sucursal modificada');
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
  }

  deleteBranchOffice(): void {
    this._boService.delete(this.idToDelete).subscribe({
      next: () => {
        const deleted = this.boList.find(x => x.id === this.idToDelete);
        if (deleted) {
          this.getBranchOffices();
          // this.boList.splice(this.boList.indexOf(deleted), 1);
          // this.rerenderer();
          this.toastr.success('Sucursal eliminada');
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
