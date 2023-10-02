import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './components/layout/layout.component';
import {DepartmentComponent} from './components/department/department.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {BranchOfficeComponent} from './components/branch-office/branch-office.component';
import {JobComponent} from './components/job/job.component';
import {OperatingSystemComponent} from './components/operating-system/operating-system.component';
import {LoginComponent} from "./components/login/login.component";
import {LoginGuard} from "./guards/login.guard";
import {AppGuard} from "./guards/app.guard";
import {RoleComponent} from "./components/role/role.component";
import {UserComponent} from "./components/user/user.component";
import {EquipmentComponent} from "./components/equipment/equipment.component";
import {MaintenanceComponent} from "./components/maintenance/maintenance.component";
import {ReportsComponent} from "./components/reports/reports.component";
import {MaintenanceReportComponent} from "./components/reports/maintenance-report/maintenance-report.component";
import {InventoryReportComponent} from "./components/reports/inventory-report/inventory-report.component";
import {AddEquipmentComponent} from "./components/equipment/add-equipment/add-equipment.component";
import {EditEquipmentComponent} from "./components/equipment/edit-equipment/edit-equipment.component";

const routes: Routes = [
  {
    path: '', component: LayoutComponent, canActivate: [AppGuard], children: [
      {path: '', component: DashboardComponent},
      {path: 'departamentos', component: DepartmentComponent},
      {path: 'sucursales', component: BranchOfficeComponent},
      {path: 'puestos', component: JobComponent},
      {path: 'sistemas-operativos', component: OperatingSystemComponent},
      {path: 'tipos-de-usuario', component: RoleComponent},
      {path: 'usuarios', component: UserComponent},
      {path: 'inventario', component: EquipmentComponent},
      {path: 'inventario/agregar-equipo', component: AddEquipmentComponent},
      {path: 'inventario/editar-equipo/:id', component: EditEquipmentComponent},
      {path: 'visitas', component: MaintenanceComponent},
      {path: 'reportes', component: ReportsComponent},
      {path: 'reportes/inventario', component: InventoryReportComponent},
      {path: 'reportes/visitas', component: MaintenanceReportComponent},
    ]
  },
  {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
