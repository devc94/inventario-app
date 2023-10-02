import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from "angular-datatables";
import {Maintenance} from "../../models/maintenance";
import {Equipment} from "../../models/equipment";
import {Subject} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MaintenanceService} from "../../services/maintenance.service";
import {EquipmentService} from "../../services/equipment.service";
import {RoleService} from "../../services/role.service";
import {TokenService} from "../../services/token.service";
import {ToastrService} from "ngx-toastr";
import {Role} from "../../models/role";
import moment from "moment";
import {MaintenanceDto} from "../../models/maintenance.dto";
import {DatePipe} from "@angular/common";
import {StatusDto} from "../../models/status.dto";
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {Title} from "@angular/platform-browser";
import {UpdateMaintenanceDto} from "../../models/update-maintenance.dto";

declare var window: any;

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: true})
  // @ts-ignore
  public dtElement: DataTableDirective;

  maintenanceList: Maintenance[] = [];
  equipmentList: Equipment[] = [];
  equipment: Equipment[] = [];
  usersList: User[] = [];
  oneMaintenance = <Maintenance>{};
  idToDelete: number = 0;
  status: string[] = ['Pendiente de Revisión', 'En Revisión', 'Revisión Completada'];

  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  addModal: any;
  editModal: any;
  deleteModal: any;

  canAdd: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;

  startDateDisabled: boolean = false;

  public selectedValue: number = 0;
  public selectedUser: number = 0;

  public maintenanceForm: FormGroup;

  options: any = {
    format: 'DD/MM/YYYY',
    minDate: moment(),
    useCurrent: true,
  };

  date: string = '';

  endDate: boolean = false;

  constructor(
    private _maintenanceService: MaintenanceService,
    private _equipmentService: EquipmentService,
    private _userService: UserService,
    private _roleService: RoleService,
    private _tokenService: TokenService,
    private _toastr: ToastrService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private title: Title,
  ) {
    this.title.setTitle('Visitas');
    this.maintenanceForm = this.fb.group({
      id: [''],
      equipment: ['', Validators.required],
      date: new FormControl({value: moment(), disabled: false}, Validators.required),
      user: new FormControl({value: '', disabled: true}, Validators.required),
      notes: ['', Validators.maxLength(255)],
    });
  }

  ngOnInit(): void {
    this.tableOptions();
    this.date = this.datePipe.transform(new Date(), 'dd MMM yyyy')!;
    this._maintenanceService.get().subscribe({
      next: (result: Maintenance[]) => {
        this.maintenanceList = result;
        this.dtTrigger.next(0);
      },
      error: (error) => {
        this._toastr.error(error.message);
      }
    });
    this._equipmentService.get().subscribe({
      next: (result: Equipment[]) => {
        this.equipment = result;
      },
      error: (error) => {
        this._toastr.error(error.message);
      }
    });
    this._equipmentService.getAllForMaintenance().subscribe({
      next: (result: Equipment[]) => {
        this.equipmentList = result;
        if (this.equipmentList.length > 0) this.selectedValue = this.equipmentList[0].id!;
      },
      error: (error) => {
        this._toastr.error(error.message);
      }
    });
    this._userService.get().subscribe({
      next: (result: User[]) => {
        this.usersList = result;
        if (this.usersList.length > 0) this.selectedUser = this.usersList[0].id!
      },
      error: (error) => {
        this._toastr.error(error.message);
      }
    });

    const roleId = this._tokenService.getRoleId();
    this._roleService.getById(roleId).subscribe((result: Role) => {
      const p = result.permissions.split(',');
      this.canAdd = p[21] === '1';
      this.canEdit = p[22] === '1';
      this.canDelete = p[23] === '1';
    });

    this.addModal = new window.bootstrap.Modal(document.getElementById('addMaintenanceModal'));
    this.editModal = new window.bootstrap.Modal(document.getElementById('editMaintenanceModal'));
    this.deleteModal = new window.bootstrap.Modal(document.getElementById('deleteMaintenanceModal'));
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
          exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]},
        },
        {
          extend: 'print',
          exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]},
        },
        {
          extend: 'excel',
          exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]},
        },
        {
          extend: 'csv',
          exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]},
        },
      ],
    }
  }

  openAddMaintenanceModal() {
    this.maintenanceForm.reset();
    this.maintenanceForm.get('date')?.enable();
    this._equipmentService.getAllForMaintenance().subscribe({
      next: (result: Equipment[]) => {
        this.equipmentList = result;
        if (this.equipmentList.length > 0) this.selectedValue = this.equipmentList[0].id!;
        if (this.equipmentList.length == 0) {
          this._toastr.info('No hay equipos disponibles para agregar');
        } else {
          // this.date = '2022/12/07';
          // this.options = {
          //   date: this.date,
          // }
          this.maintenanceForm.patchValue({
            equipment: this.selectedValue,
            date: moment(),
            user: this.selectedUser,
          });
          this.addModal.show();
        }
      },
      error: (error) => {
        this._toastr.error(error.message);
      }
    });
  }

  openEditMaintenanceModal(id?: number): void {
    if (id) {
      this.getMaintenance(id);
      this.editModal.show();
    }
  }

  openDeleteMaintenanceModal(id?: number): void {
    if (id) {
      this.idToDelete = id;
      this.deleteModal.show();
    }
  }

  getMaintenanceList(): void {
    // this.tableOptions();
    this._maintenanceService.get().subscribe({
      next: (result: Maintenance[]) => {
        this.maintenanceList = result;
        this.rerenderer();
      },
      error: (error) => {
        this._toastr.error(error.message);
      }
    });
  }

  getMaintenance(id: number): void {
    this._maintenanceService.getById(id).subscribe({
      next: (result: Maintenance) => {
        this.oneMaintenance = result;
        if (result.status != this.status[0]) this.maintenanceForm.get('date')?.disable();
        const d = result.startDate.toString().split('-');
        this.date = `${d[0]}/${d[1]}/${d[2]}`;
        this.options = {
          date: this.date,
        }
        this.maintenanceForm.patchValue({
          id: result.id,
          equipment: result.equipment.id,
          user: result.user.id,
          notes: result.notes,
        });
      },
      error: (error) => {
        this._toastr.error(error.message);
      }
    });
  }


  createMaintenance(): void {
    const equipment = +this.maintenanceForm.get('equipment')?.value;
    const date = this.maintenanceForm.get('date')?.value;
    const startDate = new Date(date.format());
    const user = +this.maintenanceForm.get('user')?.value;
    const notes = this.maintenanceForm.get('notes')?.value;
    const status = 'Pendiente de Revisión';
    const m = new MaintenanceDto(equipment, startDate, user, notes, status);
    this._maintenanceService.create(m).subscribe({
      next: () => {
        this.getMaintenanceList();
        this.addModal.hide();
        this._toastr.success('Visita agregada');
      },
      error: (error) => {
        this._toastr.error(error.message);
      }
    });
  }

  updateMaintenance(): void {
    const id = +this.maintenanceForm.get('id')?.value;
    const equipment = +this.maintenanceForm.get('equipment')?.value;
    const date = this.maintenanceForm.get('date')?.value;
    const startDate = new Date(date.format());
    const user = +this.maintenanceForm.get('user')?.value;
    const notes = this.maintenanceForm.get('notes')?.value;
    const m = new UpdateMaintenanceDto(id, equipment, startDate, user, notes);
    this._maintenanceService.update(m).subscribe({
      next: () => {
        // this.maintenanceForm.reset();
        this.getMaintenanceList();
        this.editModal.hide();
        this._toastr.success('Visita modificada');
      },
      error: (error) => {
        this._toastr.error(error.message);
      }
    });
  }

  changeStatus(id: number, status: string): void {
    const dto = new StatusDto(status);
    this._maintenanceService.changeStatus(id, dto).subscribe({
      next: () => {
        this._toastr.success(`Estado cambiado a ${dto.status}`);
        this.getMaintenanceList();
      },
      error: (error) => {
        this._toastr.error(error.message);
      }
    });
  }

  deleteMaintenance(): void {
    this._maintenanceService.delete(this.idToDelete).subscribe({
      next: () => {
        const deleted = this.maintenanceList.find(x => x.id === this.idToDelete)
        if (deleted) {
          this.getMaintenanceList();
          this._toastr.success('Eliminada correctamente');
        }
        this.deleteModal.hide();
      },
      error: () => {
        this._toastr.error('No se puede eliminar');
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
