import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Job} from '../../models/job';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {JobService} from '../../services/job.service';
import {ToastrService} from 'ngx-toastr';
import {Role} from "../../models/role";
import {TokenService} from "../../services/token.service";
import {RoleService} from "../../services/role.service";
import {Title} from "@angular/platform-browser";

declare var window: any;

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: true})
  // @ts-ignore
  public dtElement: DataTableDirective;

  jobList: Job[] = [];
  oneJob = <Job>{};
  idToDelete: number = 0;

  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  addModal: any;
  editModal: any;
  deleteModal: any;

  canAdd: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;

  public jobForm: FormGroup;

  constructor(
    private jobService: JobService,
    private _tokenService: TokenService,
    private _roleService: RoleService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private title: Title,
  ) {
    this.title.setTitle('Puestos');
    this.jobForm = this.fb.group({
      id: [],
      name: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.tableOptions();
    this.jobService.get().subscribe({
      next: (result: Job[]) => {
        this.jobList = result;
        this.dtTrigger.next(0);
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });

    const roleId = this._tokenService.getRoleId();
    this._roleService.getById(roleId).subscribe((result: Role) => {
      const p = result.permissions.split(',');
      this.canAdd = p[6] === '1';
      this.canEdit = p[7] === '1';
      this.canDelete = p[8] === '1';
    });


    this.addModal = new window.bootstrap.Modal(document.getElementById('addJobModal'));
    this.editModal = new window.bootstrap.Modal(document.getElementById('editJobModal'));
    this.deleteModal = new window.bootstrap.Modal(document.getElementById('deleteJobModal'));
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

  openAddJobModal(): void {
    this.jobForm.reset();
    this.addModal.show();
  }

  openEditJobModal(id?: number): void {
    if (id) {
      this.getJob(id);
      this.editModal.show();
    }
  }

  openDeleteJobModal(id?: number): void {
    if (id) {
      this.idToDelete = id;
      this.deleteModal.show();
    }
  }

  getJobs(): void {
    // this.tableOptions();
    this.jobService.get().subscribe({
      next: (result: Job[]) => {
        this.jobList = result;
        this.rerenderer();
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
  }

  getJob(id: number): void {
    this.jobService.getByID(id).subscribe({
      next: (result: Job) => {
        this.oneJob = result;
        this.jobForm.patchValue({
          id: result.id,
          name: result.name
        });
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
  }

  createJob(): void {
    this.jobService.create(this.jobForm.value).subscribe({
      next: () => {
        this.jobForm.reset();
        this.getJobs();
        this.addModal.hide();
        this.toastr.success('Puesto agregado');
      },
      error: (error) => {
        if (error.status == 409) {
          this.toastr.error('Ya existe un puesto con ese nombre');
        } else {
          this.toastr.error(error.message);
        }
      }
    });
  }

  updateJob(): void {
    this.jobService.update(this.jobForm.value).subscribe({
      next: () => {
        this.jobForm.reset();
        this.getJobs();
        this.editModal.hide();
        this.toastr.success('Puesto modificado');
      },
      error: (error) => {
        if (error.status == 409) {
          this.toastr.error('Ya existe un puesto con ese nombre');
        } else {
          this.toastr.error(error.message);
        }
      }
    });
  }

  deleteJob(): void {
    this.jobService.delete(this.idToDelete).subscribe({
      next: () => {
        const deleted = this.jobList.find(x => x.id === this.idToDelete);
        if (deleted) {
          this.getJobs();
          // this.jobList.splice(this.jobList.indexOf(deleted), 1);
          this.toastr.success('Puesto eliminado');
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
