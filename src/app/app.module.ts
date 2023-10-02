import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DepartmentComponent} from './components/department/department.component';
import {LayoutComponent} from './components/layout/layout.component';
import {HeaderComponent} from './components/header/header.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {WrapperComponent} from './components/wrapper/wrapper.component';
import {FooterComponent} from './components/footer/footer.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {DataTablesModule} from 'angular-datatables';
import {BranchOfficeComponent} from './components/branch-office/branch-office.component';
import {JobComponent} from './components/job/job.component';
import {OperatingSystemComponent} from './components/operating-system/operating-system.component';
import {LoginComponent} from './components/login/login.component';
import {interceptorProvider} from "./interceptors/app.interceptor";
import {RoleComponent} from './components/role/role.component';
import {UserComponent} from './components/user/user.component';
import {EquipmentComponent} from './components/equipment/equipment.component';
import {MaintenanceComponent} from './components/maintenance/maintenance.component';
import {NgTempusdominusBootstrapModule} from "ngx-tempusdominus-bootstrap";
import {DatePipe} from "@angular/common";
import {ReportsComponent} from './components/reports/reports.component';
import {MaintenanceReportComponent} from './components/reports/maintenance-report/maintenance-report.component';
import {InventoryReportComponent} from './components/reports/inventory-report/inventory-report.component';
import {InputMaskModule} from '@ngneat/input-mask';
import { AddEquipmentComponent } from './components/equipment/add-equipment/add-equipment.component';
import { EditEquipmentComponent } from './components/equipment/edit-equipment/edit-equipment.component';

@NgModule({
  declarations: [
    AppComponent,
    DepartmentComponent,
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    WrapperComponent,
    FooterComponent,
    DashboardComponent,
    BranchOfficeComponent,
    JobComponent,
    OperatingSystemComponent,
    LoginComponent,
    RoleComponent,
    UserComponent,
    EquipmentComponent,
    MaintenanceComponent,
    ReportsComponent,
    MaintenanceReportComponent,
    InventoryReportComponent,
    AddEquipmentComponent,
    EditEquipmentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      maxOpened: 5,
      preventDuplicates: true,
    }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgTempusdominusBootstrapModule,
    InputMaskModule,
    InputMaskModule.forRoot({inputSelector: 'input', isAsync: true})
  ],
  providers: [interceptorProvider, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
