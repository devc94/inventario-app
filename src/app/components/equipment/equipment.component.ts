import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import {Equipment} from "../../models/equipment";
import {OperatingSystem} from "../../models/operating-system";
import {Department} from "../../models/department";
import {Job} from "../../models/job";
import {BranchOffice} from "../../models/branch-office";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EquipmentService} from "../../services/equipment.service";
import {OperatingSystemService} from "../../services/operating-system.service";
import {DepartmentService} from "../../services/department.service";
import {JobService} from "../../services/job.service";
import {BranchOfficeService} from "../../services/branch-office.service";
import {TokenService} from "../../services/token.service";
import {RoleService} from "../../services/role.service";
import {ToastrService} from "ngx-toastr";
import {Role} from "../../models/role";
import {NewEquipmentDto} from "../../models/new-equipment.dto";
import {createMask} from "@ngneat/input-mask";

declare var window: any;

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: true})
  // @ts-ignore
  public dtElement: DataTableDirective;

  equipmentList: Equipment[] = [];
  osList: OperatingSystem[] = [];
  departmentList: Department[] = [];
  jobsList: Job[] = [];
  boList: BranchOffice[] = [];
  oneEquipment = <Equipment>{};
  idToDelete: number = 0;

  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  showModal: any;
  addModal: any;
  editModal: any;
  deleteModal: any;

  canAdd: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;

  selectedOS: number = 0;
  selectedDepartment: number = 0;
  selectedJob: number = 0;
  selectedBO: number = 0;

  ipAddressMask = createMask({alias: 'ip'});

  ipAddress = new FormControl('', Validators.required);
  public equipmentForm: FormGroup;

  constructor(
    private _equipmentService: EquipmentService,
    private _osService: OperatingSystemService,
    private _departmentService: DepartmentService,
    private _jobService: JobService,
    private _boService: BranchOfficeService,
    private _roleService: RoleService,
    private _tokenService: TokenService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.equipmentForm = this.fb.group({
      id: [],
      pcType: new FormControl('Escritorio', [Validators.required, Validators.maxLength(50)]),
      equipmentName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      brand: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      model: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      serialNumber: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      ipAddress: this.ipAddress,
      connection: new FormControl('Cable', [Validators.required, Validators.maxLength(5)]),
      connectionType: new FormControl('Estática', [Validators.required, Validators.maxLength(8)]),
      os: new FormControl('', Validators.required),
      osLicense: new FormControl('SI', [Validators.required, Validators.maxLength(2)]),
      processor: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      ram: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      microsoftOffice: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      microsoftOfficeLicense: new FormControl('SI', [Validators.required, Validators.maxLength(2)]),
      antivirus: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      anydesk: new FormControl('SI', [Validators.required, Validators.maxLength(2)]),
      storageUnit: new FormControl('HDD', [Validators.required, Validators.maxLength(3)]),
      storageCapacity: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      assignedTo: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      department: new FormControl('', Validators.required),
      job: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      branchOffice: new FormControl('', Validators.required),
      notes: new FormControl('', Validators.maxLength(255)),
    });
  }

  ngOnInit(): void {
    this.tableOptions();
    this._equipmentService.get().subscribe({
      next: (result: Equipment[]) => {
        this.equipmentList = result;
        this.dtTrigger.next(0);
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
    this._osService.get().subscribe({
      next: (result: OperatingSystem[]) => {
        this.osList = result;
        if (this.osList.length > 0) this.selectedOS = this.osList[0].id!;
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
    this._departmentService.get().subscribe({
      next: (result: Department[]) => {
        this.departmentList = result;
        if (this.departmentList.length > 0) this.selectedDepartment = this.departmentList[0].id!;
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
    this._jobService.get().subscribe({
      next: (result: Job[]) => {
        this.jobsList = result;
        if (this.jobsList.length > 0) this.selectedJob = this.jobsList[0].id!;
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
    this._boService.get().subscribe({
      next: (result: BranchOffice[]) => {
        this.boList = result;
        if (this.boList.length > 0) this.selectedBO = this.boList[0].id!;
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });

    const roleId = this._tokenService.getRoleId();
    this._roleService.getById(roleId).subscribe((result: Role) => {
      const p = result.permissions.split(',');
      this.canAdd = p[12] === '1';
      this.canEdit = p[13] === '1';
      this.canDelete = p[14] === '1';
    });

    this.showModal = new window.bootstrap.Modal(document.getElementById('showEquipmentModal'));
    this.deleteModal = new window.bootstrap.Modal(document.getElementById('deleteEquipmentModal'));
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
          exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]},
        },
        {
          extend: 'print',
          exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]},
        },
        {
          extend: 'excel',
          exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]},
        },
        {
          extend: 'csv',
          exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]},
        },
      ],
    }
  }

  openShowEquipmentModal(id?: number): void {
    if (id) {
      this.getEquipment(id);
      this.showModal.show();
    }
  }

  // openAddEquipmentModal(): void {
  //   this.equipmentForm = this.fb.group({
  //     id: [],
  //     pcType: new FormControl('Escritorio', [Validators.required, Validators.maxLength(50)]),
  //     equipmentName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
  //     brand: new FormControl('', [Validators.required, Validators.maxLength(50)]),
  //     model: new FormControl('', [Validators.required, Validators.maxLength(50)]),
  //     serialNumber: new FormControl('', [Validators.required, Validators.maxLength(50)]),
  //     ipAddress: this.ipAddress,
  //     connection: new FormControl('Cable', [Validators.required, Validators.maxLength(5)]),
  //     connectionType: new FormControl('Estática', [Validators.required, Validators.maxLength(8)]),
  //     os: new FormControl(this.selectedOS, Validators.required),
  //     osLicense: new FormControl('SI', [Validators.required, Validators.maxLength(2)]),
  //     processor: new FormControl('', [Validators.required, Validators.maxLength(50)]),
  //     ram: new FormControl('', [Validators.required, Validators.maxLength(10)]),
  //     microsoftOffice: new FormControl('', [Validators.required, Validators.maxLength(50)]),
  //     microsoftOfficeLicense: new FormControl('SI', [Validators.required, Validators.maxLength(2)]),
  //     antivirus: new FormControl('', [Validators.required, Validators.maxLength(50)]),
  //     anydesk: new FormControl('SI', [Validators.required, Validators.maxLength(2)]),
  //     storageUnit: new FormControl('HDD', [Validators.required, Validators.maxLength(3)]),
  //     storageCapacity: new FormControl('', [Validators.required, Validators.maxLength(5)]),
  //     assignedTo: new FormControl('', [Validators.required, Validators.maxLength(100)]),
  //     department: new FormControl(this.selectedDepartment, Validators.required),
  //     job: new FormControl(this.selectedJob, Validators.required),
  //     email: new FormControl('', [Validators.required, Validators.email]),
  //     branchOffice: new FormControl(this.selectedBO, Validators.required),
  //     notes: new FormControl('', Validators.maxLength(255)),
  //   });
  //   this.ipAddress.reset();
  //   this.addModal.show();
  // }

  // openEditEquipmentModal(id?: number): void {
  //   if (id) {
  //     this.getEquipment(id);
  //     this.editModal.show();
  //   }
  // }

  openDeleteEquipmentModal(id?: number): void {
    if (id) {
      this.idToDelete = id;
      this.deleteModal.show();
    }
  }

  // getEquipmentList(): void {
  //   this._equipmentService.get().subscribe({
  //     next: (result: Equipment[]) => {
  //       this.equipmentList = result;
  //       this.rerenderer();
  //     },
  //     error: (error) => {
  //       this.toastr.error(error.message);
  //     }
  //   });
  // }

  getEquipment(id: number): void {
    this._equipmentService.getByID(id).subscribe({
      next: (result: Equipment) => {
        this.oneEquipment = result;
        this.equipmentForm.patchValue({
          id: result.id,
          pcType: result.pcType,
          equipmentName: result.equipmentName,
          brand: result.brand,
          model: result.model,
          serialNumber: result.serialNumber,
          ipAddress: result.ipAddress,
          connection: result.connection,
          connectionType: result.connectionType,
          os: result.os.id,
          osLicense: result.osLicense,
          processor: result.processor,
          ram: result.ram,
          microsoftOffice: result.microsoftOffice,
          microsoftOfficeLicense: result.microsoftOfficeLicense,
          antivirus: result.antivirus,
          anydesk: result.anydesk,
          storageUnit: result.storageUnit,
          storageCapacity: result.storageCapacity,
          assignedTo: result.assignedTo,
          department: result.department.id,
          job: result.job.id,
          email: result.email,
          branchOffice: result.branchOffice.id,
          notes: result.notes,
        });
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
  }

  // createEquipment(): void {
  //   const pcType = this.equipmentForm.get('pcType')?.value;
  //   const equipmentName = this.equipmentForm.get('equipmentName')?.value;
  //   const brand = this.equipmentForm.get('brand')?.value;
  //   const model = this.equipmentForm.get('model')?.value;
  //   const serialNumber = this.equipmentForm.get('serialNumber')?.value;
  //   const ipAddress = this.equipmentForm.get('ipAddress')?.value;
  //   const connection = this.equipmentForm.get('connection')?.value;
  //   const connectionType = this.equipmentForm.get('connectionType')?.value;
  //   const os = this.equipmentForm.get('os')?.value;
  //   const osLicense = this.equipmentForm.get('osLicense')?.value;
  //   const processor = this.equipmentForm.get('processor')?.value;
  //   const ram = this.equipmentForm.get('ram')?.value;
  //   const microsoftOffice = this.equipmentForm.get('microsoftOffice')?.value;
  //   const microsoftOfficeLicense = this.equipmentForm.get('microsoftOfficeLicense')?.value;
  //   const antivirus = this.equipmentForm.get('antivirus')?.value;
  //   const anydesk = this.equipmentForm.get('anydesk')?.value;
  //   const storageUnit = this.equipmentForm.get('storageUnit')?.value;
  //   const storageCapacity = this.equipmentForm.get('storageCapacity')?.value;
  //   const assignedTo = this.equipmentForm.get('assignedTo')?.value;
  //   const department = this.equipmentForm.get('department')?.value;
  //   const job = this.equipmentForm.get('job')?.value;
  //   const email = this.equipmentForm.get('email')?.value;
  //   const branchOffice = this.equipmentForm.get('branchOffice')?.value;
  //   const notes = this.equipmentForm.get('notes')?.value;
  //   const createdAt = new Date();
  //   const e = new NewEquipmentDto(
  //     pcType,
  //     equipmentName,
  //     brand,
  //     model,
  //     serialNumber,
  //     ipAddress,
  //     connection,
  //     connectionType,
  //     os,
  //     osLicense,
  //     processor,
  //     ram,
  //     microsoftOffice,
  //     microsoftOfficeLicense,
  //     antivirus,
  //     anydesk,
  //     storageUnit,
  //     storageCapacity,
  //     assignedTo,
  //     department,
  //     job,
  //     email,
  //     branchOffice,
  //     notes,
  //     createdAt,
  //   );
  //   this._equipmentService.create(e).subscribe({
  //     next: () => {
  //       this.equipmentForm.reset();
  //       this.getEquipmentList();
  //       this.addModal.hide();
  //       this.toastr.success('Equipo aregado');
  //     },
  //     error: (error) => {
  //       if (error.status == 409) {
  //         this.toastr.error('Ya existe un equipo con ese nombre');
  //       } else {
  //         this.toastr.error(error.message);
  //       }
  //     }
  //   });
  // }

  // updateEquipment(): void {
  //   this._equipmentService.update(this.equipmentForm.value).subscribe({
  //     next: () => {
  //       this.equipmentForm.reset();
  //       this.getEquipmentList();
  //       this.editModal.hide();
  //       this.toastr.success('Equipo modificado');
  //     },
  //     error: (error) => {
  //       if (error.status == 409) {
  //         this.toastr.error('Ya existe un equipo con ese nombre');
  //       } else {
  //         this.toastr.error(error.message);
  //       }
  //     }
  //   });
  // }

  deleteEquipment(): void {
    this._equipmentService.delete(this.idToDelete).subscribe({
      next: () => {
        const deleted = this.equipmentList.find(x => x.id === this.idToDelete);
        if (deleted) {
          this.equipmentList.splice(this.equipmentList.indexOf(deleted), 1);
          this.toastr.success('Equipo eliminado');
        }
        this.deleteModal.hide();
      },
      error: (error) => {
        this.toastr.error(error.message);
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
