import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from "angular-datatables";
import {Role} from "../../models/role";
import {Subject} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RoleService} from "../../services/role.service";
import {ToastrService} from "ngx-toastr";
import {TokenService} from "../../services/token.service";
import {Title} from "@angular/platform-browser";

declare var window: any;

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: true})
  // @ts-ignore
  public dtElement: DataTableDirective;

  // @ts-ignore
  @ViewChild('depCheckBox') dpCB;
  // @ts-ignore
  @ViewChild('addDep') addDep;
  // @ts-ignore
  @ViewChild('editDep') editDep;
  // @ts-ignore
  @ViewChild('deleteDep') deleteDep;


  // @ts-ignore
  @ViewChild('boCheckBox') boCB;
  // @ts-ignore
  @ViewChild('addBO') addBO;
  // @ts-ignore
  @ViewChild('editBO') editBO;
  // @ts-ignore
  @ViewChild('deleteBO') deleteBO;


  // @ts-ignore
  @ViewChild('jobCheckBox') jobCB;
  // @ts-ignore
  @ViewChild('addJob') addJob;
  // @ts-ignore
  @ViewChild('editJob') editJob;
  // @ts-ignore
  @ViewChild('deleteJob') deleteJob;


  // @ts-ignore
  @ViewChild('osCheckBox') osCB;
  // @ts-ignore
  @ViewChild('addOS') addOS;
  // @ts-ignore
  @ViewChild('editOS') editOS;
  // @ts-ignore
  @ViewChild('deleteOS') deleteOS;

  // @ts-ignore
  @ViewChild('eqCheckBox') eqCB;
  // @ts-ignore
  @ViewChild('addEq') addEq;
  // @ts-ignore
  @ViewChild('editEq') editEq;
  // @ts-ignore
  @ViewChild('deleteEq') deleteEq;


  // @ts-ignore
  @ViewChild('roleCheckBox') roleCB;
  // @ts-ignore
  @ViewChild('addRol') addRol;
  // @ts-ignore
  @ViewChild('editRol') editRol;
  // @ts-ignore
  @ViewChild('deleteRol') deleteRol;


  // @ts-ignore
  @ViewChild('userCheckBox') userCB;
  // @ts-ignore
  @ViewChild('addUser') addUser;
  // @ts-ignore
  @ViewChild('editUser') editUser;
  // @ts-ignore
  @ViewChild('deleteUser') deleteUser;


  // @ts-ignore
  @ViewChild('mtCheckBox') mtCB;
  // @ts-ignore
  @ViewChild('addMt') addMt;
  // @ts-ignore
  @ViewChild('editMt') editMt;
  // @ts-ignore
  @ViewChild('deleteMt') deleteMt;


  // Edit
// @ts-ignore
  @ViewChild('depCheckBoxEdit') dpCBEdit;
  // @ts-ignore
  @ViewChild('addDepEdit') addDepEdit;
  // @ts-ignore
  @ViewChild('editDepEdit') editDepEdit;
  // @ts-ignore
  @ViewChild('deleteDepEdit') deleteDepEdit;


  // @ts-ignore
  @ViewChild('boCheckBoxEdit') boCBEdit;
  // @ts-ignore
  @ViewChild('addBOEdit') addBOEdit;
  // @ts-ignore
  @ViewChild('editBOEdit') editBOEdit;
  // @ts-ignore
  @ViewChild('deleteBOEdit') deleteBOEdit;


  // @ts-ignore
  @ViewChild('jobCheckBoxEdit') jobCBEdit;
  // @ts-ignore
  @ViewChild('addJobEdit') addJobEdit;
  // @ts-ignore
  @ViewChild('editJobEdit') editJobEdit;
  // @ts-ignore
  @ViewChild('deleteJobEdit') deleteJobEdit;


  // @ts-ignore
  @ViewChild('osCheckBoxEdit') osCBEdit;
  // @ts-ignore
  @ViewChild('addOSEdit') addOSEdit;
  // @ts-ignore
  @ViewChild('editOSEdit') editOSEdit;
  // @ts-ignore
  @ViewChild('deleteOSEdit') deleteOSEdit;

  // @ts-ignore
  @ViewChild('eqCheckBoxEdit') eqCBEdit;
  // @ts-ignore
  @ViewChild('addEqEdit') addEqEdit;
  // @ts-ignore
  @ViewChild('editEqEdit') editEqEdit;
  // @ts-ignore
  @ViewChild('deleteEqEdit') deleteEqEdit;


  // @ts-ignore
  @ViewChild('roleCheckBoxEdit') roleCBEdit;
  // @ts-ignore
  @ViewChild('addRolEdit') addRolEdit;
  // @ts-ignore
  @ViewChild('editRolEdit') editRolEdit;
  // @ts-ignore
  @ViewChild('deleteRolEdit') deleteRolEdit;


  // @ts-ignore
  @ViewChild('userCheckBoxEdit') userCBEdit;
  // @ts-ignore
  @ViewChild('addUserEdit') addUserEdit;
  // @ts-ignore
  @ViewChild('editUserEdit') editUserEdit;
  // @ts-ignore
  @ViewChild('deleteUserEdit') deleteUserEdit;


  // @ts-ignore
  @ViewChild('mtCheckBoxEdit') mtCBEdit;
  // @ts-ignore
  @ViewChild('addMtEdit') addMtEdit;
  // @ts-ignore
  @ViewChild('editMtEdit') editMtEdit;
  // @ts-ignore
  @ViewChild('deleteMtEdit') deleteMtEdit;

  isEditing: boolean = false;
  rolesList: Role[] = [];
  oneRole = <Role>{};
  idToDelete: number = 0;

  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  addModal: any;
  editModal: any;
  deleteModal: any;

  canAdd: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;


  public rolesForm: FormGroup;
  public rolesFormEdit: FormGroup;

  constructor(
    private _rolesService: RoleService,
    private _tokenService: TokenService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private title: Title,
  ) {
    this.title.setTitle('Tipos de Usuario');
    this.rolesForm = this.fb.group({
      id: [],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      depCheckBox: [false],
      addDepartment: [false],
      editDepartment: [false],
      deleteDepartment: [false],
      boCheckBox: [false],
      addBO: [false],
      editBO: [false],
      deleteBO: [false],
      jobCheckBox: [false],
      addJob: [false],
      editJob: [false],
      deleteJob: [false],
      soCheckBox: [false],
      addSO: [false],
      editSO: [false],
      deleteSO: [false],
      equipmentCheckBox: [false],
      addEquipment: [false],
      editEquipment: [false],
      deleteEquipment: [false],
      roleCheckBox: [false],
      addRole: [false],
      editRole: [false],
      deleteRole: [false],
      userCheckBox: [false],
      addUser: [false],
      editUser: [false],
      deleteUser: [false],
      maintenanceCheckBox: [false],
      addMaintenance: [false],
      editMaintenance: [false],
      deleteMaintenance: [false]
    });
    this.rolesFormEdit = this.fb.group({
      id: [],
      nameE: ['', [Validators.required, Validators.maxLength(50)]],
      depCheckBox: [false],
      addDepartmentE: [false],
      editDepartmentE: [false],
      deleteDepartmentE: [false],
      boCheckBox: [false],
      addBO: [false],
      editBO: [false],
      deleteBO: [false],
      jobCheckBox: [false],
      addJob: [false],
      editJob: [false],
      deleteJob: [false],
      soCheckBox: [false],
      addSO: [false],
      editSO: [false],
      deleteSO: [false],
      equipmentCheckBox: [false],
      addEquipment: [false],
      editEquipment: [false],
      deleteEquipment: [false],
      roleCheckBox: [false],
      addRole: [false],
      editRole: [false],
      deleteRole: [false],
      userCheckBox: [false],
      addUser: [false],
      editUser: [false],
      deleteUser: [false],
      maintenanceCheckBox: [false],
      addMaintenance: [false],
      editMaintenance: [false],
      deleteMaintenance: [false]
    });
  }

  depStatus(): void {
    const val = this.dpCB.nativeElement.checked;
    this.addDep.nativeElement.checked = val;
    this.editDep.nativeElement.checked = val;
    this.deleteDep.nativeElement.checked = val;
  }

  depAStatus(): void {
    this.dpCB.nativeElement.checked = (this.addDep.nativeElement.checked && this.editDep.nativeElement.checked && this.deleteDep.nativeElement.checked)
  }

  boStatus(): void {
    const val = this.boCB.nativeElement.checked;
    this.addBO.nativeElement.checked = val;
    this.editBO.nativeElement.checked = val;
    this.deleteBO.nativeElement.checked = val;
  }

  boAStatus(): void {
    this.boCB.nativeElement.checked = (this.addBO.nativeElement.checked && this.editBO.nativeElement.checked && this.deleteBO.nativeElement.checked)
  }

  jobStatus(): void {
    const val = this.jobCB.nativeElement.checked;
    this.addJob.nativeElement.checked = val;
    this.editJob.nativeElement.checked = val;
    this.deleteJob.nativeElement.checked = val;
  }

  jobAStatus(): void {
    this.jobCB.nativeElement.checked = (this.addJob.nativeElement.checked && this.editJob.nativeElement.checked && this.deleteJob.nativeElement.checked)
  }

  osStatus(): void {
    const val = this.osCB.nativeElement.checked;
    this.addOS.nativeElement.checked = val;
    this.editOS.nativeElement.checked = val;
    this.deleteOS.nativeElement.checked = val;
  }

  osAStatus(): void {
    this.osCB.nativeElement.checked = (this.addOS.nativeElement.checked && this.editOS.nativeElement.checked && this.deleteOS.nativeElement.checked)
  }

  eqStatus(): void {
    const val = this.eqCB.nativeElement.checked;
    this.addEq.nativeElement.checked = val;
    this.editEq.nativeElement.checked = val;
    this.deleteEq.nativeElement.checked = val;
  }

  eqAStatus(): void {
    this.eqCB.nativeElement.checked = (this.addEq.nativeElement.checked && this.editEq.nativeElement.checked && this.deleteEq.nativeElement.checked)
  }

  roleStatus(): void {
    const val = this.roleCB.nativeElement.checked;
    this.addRol.nativeElement.checked = val;
    this.editRol.nativeElement.checked = val;
    this.deleteRol.nativeElement.checked = val;
  }

  roleAStatus(): void {
    this.roleCB.nativeElement.checked = (this.addRol.nativeElement.checked && this.editRol.nativeElement.checked && this.deleteRol.nativeElement.checked)
  }

  userStatus(): void {
    const val = this.userCB.nativeElement.checked;
    this.addUser.nativeElement.checked = val;
    this.editUser.nativeElement.checked = val;
    this.deleteUser.nativeElement.checked = val;
  }

  userAStatus(): void {
    this.userCB.nativeElement.checked = (this.addUser.nativeElement.checked && this.editUser.nativeElement.checked && this.deleteUser.nativeElement.checked)
  }

  mtStatus(): void {
    const val = this.mtCB.nativeElement.checked;
    this.addMt.nativeElement.checked = val;
    this.editMt.nativeElement.checked = val;
    this.deleteMt.nativeElement.checked = val;
  }

  mtAStatus(): void {
    this.mtCB.nativeElement.checked = (this.addMt.nativeElement.checked && this.editMt.nativeElement.checked && this.deleteMt.nativeElement.checked)
  }

  depStatusE(): void {
    const val = this.dpCBEdit.nativeElement.checked;
    this.addDepEdit.nativeElement.checked = val;
    this.editDepEdit.nativeElement.checked = val;
    this.deleteDepEdit.nativeElement.checked = val;
  }

  depAStatusE(): void {
    this.dpCBEdit.nativeElement.checked = (this.addDepEdit.nativeElement.checked && this.editDepEdit.nativeElement.checked && this.deleteDepEdit.nativeElement.checked)
  }

  boStatusE(): void {
    const val = this.boCBEdit.nativeElement.checked;
    this.addBOEdit.nativeElement.checked = val;
    this.editBOEdit.nativeElement.checked = val;
    this.deleteBOEdit.nativeElement.checked = val;
  }

  boAStatusE(): void {
    this.boCBEdit.nativeElement.checked = (this.addBOEdit.nativeElement.checked && this.editBOEdit.nativeElement.checked && this.deleteBOEdit.nativeElement.checked)
  }

  jobStatusE(): void {
    const val = this.jobCBEdit.nativeElement.checked;
    this.addJobEdit.nativeElement.checked = val;
    this.editJobEdit.nativeElement.checked = val;
    this.deleteJobEdit.nativeElement.checked = val;
  }

  jobAStatusE(): void {
    this.jobCBEdit.nativeElement.checked = (this.addJobEdit.nativeElement.checked && this.editJobEdit.nativeElement.checked && this.deleteJobEdit.nativeElement.checked)
  }

  osStatusE(): void {
    const val = this.osCBEdit.nativeElement.checked;
    this.addOSEdit.nativeElement.checked = val;
    this.editOSEdit.nativeElement.checked = val;
    this.deleteOSEdit.nativeElement.checked = val;
  }

  osAStatusE(): void {
    this.osCBEdit.nativeElement.checked = (this.addOSEdit.nativeElement.checked && this.editOSEdit.nativeElement.checked && this.deleteOSEdit.nativeElement.checked)
  }

  eqStatusE(): void {
    const val = this.eqCBEdit.nativeElement.checked;
    this.addEqEdit.nativeElement.checked = val;
    this.editEqEdit.nativeElement.checked = val;
    this.deleteEqEdit.nativeElement.checked = val;
  }

  eqAStatusE(): void {
    this.eqCBEdit.nativeElement.checked = (this.addEqEdit.nativeElement.checked && this.editEqEdit.nativeElement.checked && this.deleteEqEdit.nativeElement.checked)
  }

  roleStatusE(): void {
    const val = this.roleCBEdit.nativeElement.checked;
    this.addRolEdit.nativeElement.checked = val;
    this.editRolEdit.nativeElement.checked = val;
    this.deleteRolEdit.nativeElement.checked = val;
  }

  roleAStatusE(): void {
    this.roleCBEdit.nativeElement.checked = (this.addRolEdit.nativeElement.checked && this.editRolEdit.nativeElement.checked && this.deleteRolEdit.nativeElement.checked)
  }

  userStatusE(): void {
    const val = this.userCBEdit.nativeElement.checked;
    this.addUserEdit.nativeElement.checked = val;
    this.editUserEdit.nativeElement.checked = val;
    this.deleteUserEdit.nativeElement.checked = val;
  }

  userAStatusE(): void {
    this.userCBEdit.nativeElement.checked = (this.addUserEdit.nativeElement.checked && this.editUserEdit.nativeElement.checked && this.deleteUserEdit.nativeElement.checked)
  }

  mtStatusE(): void {
    const val = this.mtCBEdit.nativeElement.checked;
    this.addMtEdit.nativeElement.checked = val;
    this.editMtEdit.nativeElement.checked = val;
    this.deleteMtEdit.nativeElement.checked = val;
  }

  mtAStatusE(): void {
    this.mtCBEdit.nativeElement.checked = (this.addMtEdit.nativeElement.checked && this.editMtEdit.nativeElement.checked && this.deleteMtEdit.nativeElement.checked)
  }

  ngOnInit(): void {
    this.tableOptions();
    this._rolesService.get().subscribe({
      next: (result: Role[]) => {
        this.rolesList = result;
        this.dtTrigger.next(0);
      }
    });

    const roleId = this._tokenService.getRoleId();
    this._rolesService.getById(roleId).subscribe((result: Role) => {
      const p = result.permissions.split(',');
      this.canAdd = p[15] === '1';
      this.canEdit = p[16] === '1';
      this.canDelete = p[17] === '1';
    });

    this.addModal = new window.bootstrap.Modal(document.getElementById('addRoleModal'));
    this.editModal = new window.bootstrap.Modal(document.getElementById('editRoleModal'));
    this.deleteModal = new window.bootstrap.Modal(document.getElementById('deleteRoleModal'));
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

  openAddRoleModal(): void {
    this.rolesForm.reset();
    this.addModal.show();
  }

  openEditRoleModal(id?: number): void {
    if (id) {
      this.isEditing = true;
      this.getRole(id);
      this.editModal.show();
    }
  }

  openDeleteRoleModal(id?: number): void {
    if (id) {
      this.idToDelete = id;
      this.deleteModal.show();
    }
  }

  getRoles(): void {
    // this.tableOptions();
    this._rolesService.get().subscribe({
      next: (result: Role[]) => {
        this.rolesList = result;
        this.rerenderer();
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
  }

  closeModal(): void {
    this.isEditing = false;
  }

  getRole(id: number): void {
    this._rolesService.getById(id).subscribe({
      next: (result: Role) => {
        this.oneRole = result;
        const permissions = this.oneRole.permissions.split(',');
        this.rolesFormEdit.patchValue({
          id: result.id,
          nameE: result.name,
          addDepartmentE: (permissions[0]) === '1',
          editDepartmentE: (permissions[1] === '1'),
          deleteDepartmentE: (permissions[2] === '1'),
          addBO: (permissions[3] === '1'),
          editBO: (permissions[4] === '1'),
          deleteBO: (permissions[5] === '1'),
          addJob: (permissions[6] === '1'),
          editJob: (permissions[7] === '1'),
          deleteJob: (permissions[8] === '1'),
          addSO: (permissions[9] === '1'),
          editSO: (permissions[10] === '1'),
          deleteSO: (permissions[11] === '1'),
          addEquipment: (permissions[12] === '1'),
          editEquipment: (permissions[13] === '1'),
          deleteEquipment: (permissions[14] === '1'),
          addRole: (permissions[15] === '1'),
          editRole: (permissions[16] === '1'),
          deleteRole: (permissions[17] === '1'),
          addUser: (permissions[18] === '1'),
          editUser: (permissions[19] === '1'),
          deleteUser: (permissions[20] === '1'),
          addMaintenance: (permissions[21] === '1'),
          editMaintenance: (permissions[22] === '1'),
          deleteMaintenance: (permissions[23] === '1')
        });
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
  }

  getNewRole(): Role {
    const d = this.rolesForm.value;
    const name = d.name;
    const permissions =
      (d.addDepartment ? 1 : 0) + ',' +
      (d.editDepartment ? 1 : 0) + ',' +
      (d.deleteDepartment ? 1 : 0) + ',' +
      (d.addBO ? 1 : 0) + ',' +
      (d.editBO ? 1 : 0) + ',' +
      (d.deleteBO ? 1 : 0) + ',' +
      (d.addJob ? 1 : 0) + ',' +
      (d.editJob ? 1 : 0) + ',' +
      (d.deleteJob ? 1 : 0) + ',' +
      (d.addSO ? 1 : 0) + ',' +
      (d.editSO ? 1 : 0) + ',' +
      (d.deleteSO ? 1 : 0) + ',' +
      (d.addEquipment ? 1 : 0) + ',' +
      (d.editEquipment ? 1 : 0) + ',' +
      (d.deleteEquipment ? 1 : 0) + ',' +
      (d.addRole ? 1 : 0) + ',' +
      (d.editRole ? 1 : 0) + ',' +
      (d.deleteRole ? 1 : 0) + ',' +
      (d.addUser ? 1 : 0) + ',' +
      (d.editUser ? 1 : 0) + ',' +
      (d.deleteUser ? 1 : 0) + ',' +
      (d.addMaintenance ? 1 : 0) + ',' +
      (d.editMaintenance ? 1 : 0) + ',' +
      (d.deleteMaintenance ? 1 : 0)

    return new Role(name, permissions);
  }
  getUpdatedRole(): Role {
    const d = this.rolesFormEdit.value;
    const name = d.nameE;
    const permissions =
      (d.addDepartmentE ? 1 : 0) + ',' +
      (d.editDepartmentE ? 1 : 0) + ',' +
      (d.deleteDepartmentE ? 1 : 0) + ',' +
      (d.addBO ? 1 : 0) + ',' +
      (d.editBO ? 1 : 0) + ',' +
      (d.deleteBO ? 1 : 0) + ',' +
      (d.addJob ? 1 : 0) + ',' +
      (d.editJob ? 1 : 0) + ',' +
      (d.deleteJob ? 1 : 0) + ',' +
      (d.addSO ? 1 : 0) + ',' +
      (d.editSO ? 1 : 0) + ',' +
      (d.deleteSO ? 1 : 0) + ',' +
      (d.addEquipment ? 1 : 0) + ',' +
      (d.editEquipment ? 1 : 0) + ',' +
      (d.deleteEquipment ? 1 : 0) + ',' +
      (d.addRole ? 1 : 0) + ',' +
      (d.editRole ? 1 : 0) + ',' +
      (d.deleteRole ? 1 : 0) + ',' +
      (d.addUser ? 1 : 0) + ',' +
      (d.editUser ? 1 : 0) + ',' +
      (d.deleteUser ? 1 : 0) + ',' +
      (d.addMaintenance ? 1 : 0) + ',' +
      (d.editMaintenance ? 1 : 0) + ',' +
      (d.deleteMaintenance ? 1 : 0)

    return new Role(name, permissions);
  }

  createRole(): void {
    const newRole = this.getNewRole();
    this._rolesService.create(newRole).subscribe({
      next: () => {
        this.rolesForm.reset();
        this.getRoles();
        this.addModal.hide();
        this.toastr.success('Tipo de Usuario agregado');
      },
      error: (error) => {
        if (error.status == 409) {
          this.toastr.error('Ya existe un tipo de usuario con ese nombre');
        } else {
          this.toastr.error(error.message);
        }
      }
    });
  }

  updateRole(): void {
    const role = this.getUpdatedRole();
    const id = this.rolesFormEdit.get('id')?.value;
    role.id = id;
    
    
    this._rolesService.update(role).subscribe({
      next: () => {
        this.isEditing = false;
        this.rolesForm.reset();
        this.getRoles();
        this.editModal.hide();
        this.toastr.success('Tipo de Usuario modificado');
      },
      error: (error) => {
        if (error.status == 409) {
          this.toastr.error('Ya existe un tipo de usuario con ese nombre');
        } else {
          this.toastr.error(error.message);
        }
      }
    });
  }

  deleteRole(): void {
    this._rolesService.delete(this.idToDelete).subscribe({
      next: () => {
        const deleted = this.rolesList.find(x => x.id === this.idToDelete);
        if (deleted) {
          this.getRoles();
          // this.rolesList.splice(this.rolesList.indexOf(deleted), 1);
          this.toastr.success('Tipo de Usuario eliminado');
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
