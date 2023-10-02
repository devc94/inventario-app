import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EquipmentService} from "../../../services/equipment.service";
import {OperatingSystemService} from "../../../services/operating-system.service";
import {DepartmentService} from "../../../services/department.service";
import {JobService} from "../../../services/job.service";
import {BranchOfficeService} from "../../../services/branch-office.service";
import {ToastrService} from "ngx-toastr";
import {OperatingSystem} from "../../../models/operating-system";
import {Department} from "../../../models/department";
import {Job} from "../../../models/job";
import {BranchOffice} from "../../../models/branch-office";
import {createMask} from "@ngneat/input-mask";
import {NewEquipmentDto} from "../../../models/new-equipment.dto";

@Component({
  selector: 'app-add-equipment',
  templateUrl: './add-equipment.component.html',
  styleUrls: ['./add-equipment.component.scss']
})
export class AddEquipmentComponent implements OnInit {
  equipmentForm: FormGroup;

  osList: OperatingSystem[] = [];
  departmentList: Department[] = [];
  jobsList: Job[] = [];
  boList: BranchOffice[] = [];

  ipAddressMask = createMask({alias: 'ip'});
  ipAddress = new FormControl('', Validators.required);

  constructor(
    private _equipmentService: EquipmentService,
    private _osService: OperatingSystemService,
    private _departmentService: DepartmentService,
    private _jobService: JobService,
    private _boService: BranchOfficeService,
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
    this._osService.get().subscribe({
      next: (result: OperatingSystem[]) => {
        this.osList = result;
      },
      error: () => {
        this.toastr.error('Ocurrió un error al cargar los sistemas operativos');
      }
    });

    this._departmentService.get().subscribe({
      next: (result: Department[]) => {
        this.departmentList = result;
      },
      error: () => {
        this.toastr.error('Ocurrió un error al cargar los departamentos');
      }
    });

    this._jobService.get().subscribe({
      next: (result: Job[]) => {
        this.jobsList = result;
      },
      error: () => {
        this.toastr.error('Ocurrió un error al cargar los puestos');
      }
    });

    this._boService.get().subscribe({
      next: (result: BranchOffice[]) => {
        this.boList = result;
      },
      error: () => {
        this.toastr.error('Ocurrió un error al cargar las sucursales');
      }
    });
  }

  createEquipment(): void {
    const pcType = this.equipmentForm.get('pcType')?.value;
    const equipmentName = this.equipmentForm.get('equipmentName')?.value;
    const brand = this.equipmentForm.get('brand')?.value;
    const model = this.equipmentForm.get('model')?.value;
    const serialNumber = this.equipmentForm.get('serialNumber')?.value;
    const ipAddress = this.equipmentForm.get('ipAddress')?.value;
    const connection = this.equipmentForm.get('connection')?.value;
    const connectionType = this.equipmentForm.get('connectionType')?.value;
    const os = this.equipmentForm.get('os')?.value;
    const osLicense = this.equipmentForm.get('osLicense')?.value;
    const processor = this.equipmentForm.get('processor')?.value;
    const ram = this.equipmentForm.get('ram')?.value;
    const microsoftOffice = this.equipmentForm.get('microsoftOffice')?.value;
    const microsoftOfficeLicense = this.equipmentForm.get('microsoftOfficeLicense')?.value;
    const antivirus = this.equipmentForm.get('antivirus')?.value;
    const anydesk = this.equipmentForm.get('anydesk')?.value;
    const storageUnit = this.equipmentForm.get('storageUnit')?.value;
    const storageCapacity = this.equipmentForm.get('storageCapacity')?.value;
    const assignedTo = this.equipmentForm.get('assignedTo')?.value;
    const department = this.equipmentForm.get('department')?.value;
    const job = this.equipmentForm.get('job')?.value;
    const email = this.equipmentForm.get('email')?.value;
    const branchOffice = this.equipmentForm.get('branchOffice')?.value;
    const notes = this.equipmentForm.get('notes')?.value;
    const createdAt = new Date();
    const e = new NewEquipmentDto(
      pcType,
      equipmentName,
      brand,
      model,
      serialNumber,
      ipAddress,
      connection,
      connectionType,
      os,
      osLicense,
      processor,
      ram,
      microsoftOffice,
      microsoftOfficeLicense,
      antivirus,
      anydesk,
      storageUnit,
      storageCapacity,
      assignedTo,
      department,
      job,
      email,
      branchOffice,
      notes,
      createdAt,
    );
    this._equipmentService.create(e).subscribe({
      next: () => {
        this.equipmentForm.reset();
        this.ipAddress.reset();
        this.toastr.success('Equipo agregado');
      },
      error: (error) => {
        if (error.status == 409) {
          this.toastr.error('Ya existe un equipo con ese nombre');
        } else {
          this.toastr.error(error.message);
        }
      }
    });
  }

}
