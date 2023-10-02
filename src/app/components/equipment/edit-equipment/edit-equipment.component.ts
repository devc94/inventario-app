import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {OperatingSystem} from "../../../models/operating-system";
import {Department} from "../../../models/department";
import {Job} from "../../../models/job";
import {BranchOffice} from "../../../models/branch-office";
import {createMask} from "@ngneat/input-mask";
import {EquipmentService} from "../../../services/equipment.service";
import {OperatingSystemService} from "../../../services/operating-system.service";
import {DepartmentService} from "../../../services/department.service";
import {JobService} from "../../../services/job.service";
import {BranchOfficeService} from "../../../services/branch-office.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Params} from "@angular/router";
import {Equipment} from "../../../models/equipment";

@Component({
  selector: 'app-edit-equipment',
  templateUrl: './edit-equipment.component.html',
  styleUrls: ['./edit-equipment.component.scss']
})
export class EditEquipmentComponent implements OnInit {
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
    private route: ActivatedRoute,
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
    this._departmentService.get().subscribe((result: Department[]) => {
      this.departmentList = result;
    });
    this._boService.get().subscribe({
      next: (result: BranchOffice[]) => {
        this.boList = result;
      },
      error: (error) => {
        this.toastr.error(error);
      }
    });
    this._jobService.get().subscribe({
      next: (result: Job[]) => {
        this.jobsList = result;
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
    this.route.params.subscribe((param: Params) => {
      const id = this.route.snapshot.paramMap.get('id');
      if (typeof id === "string") {
        const eid = parseInt(id);
        this._equipmentService.getByID(eid).subscribe({
          next: (result: Equipment) => {
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
      } else {
        this.toastr.error('Ocurrió un error');
      }
    });
  }

  updateEquipment(): void {
    this._equipmentService.update(this.equipmentForm.value).subscribe({
      next: () => {
        this.toastr.success('Equipo modificado');
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
