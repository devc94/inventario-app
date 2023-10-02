import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {Maintenance} from "../../../models/maintenance";
import {HttpClient} from "@angular/common/http";
import {MaintenanceService} from "../../../services/maintenance.service";
import moment from "moment/moment";
import {MaintenanceReportDto} from "../../../models/maintenance-report.dto";
import {Subject} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {ReportsService} from "../../../services/reports.service";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-maintenance-report',
  templateUrl: './maintenance-report.component.html',
  styleUrls: ['./maintenance-report.component.scss']
})
export class MaintenanceReportComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective, {static: false})
    // @ts-ignore
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  // @ts-ignore
  dtTrigger: Subject = new Subject();
  maintenanceList: Maintenance[];
  date1: Date;
  date2: Date;
  status: string[] = ['Pendiente de Revisión', 'En Revisión', 'Revisión Completada'];
  searchOption: number = 1;

  options: any = {
    format: 'DD/MM/YYYY',
    useCurrent: true,
  };

  constructor(
    private title: Title,
    private http: HttpClient,
    private _maintenanceService: MaintenanceService,
    private _reportsService: ReportsService,
    private toastr: ToastrService,
  ) {
    this.maintenanceList = [];
    this.date1 = new Date();
    this.date2 = new Date();
  }

  ngOnInit(): void {
    this.title.setTitle('Reporte de Visitas');
    this.tableOptions();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(0);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  tableOptions(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [
        [10, 25, 50, 100, -1],
        [10, 25, 50, 100, 'All'],
      ],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json',
      },
      searching: false,
      destroy: true,
    };
  }

  update(): void {
    console.log(this.searchOption);
  }

  getReport(): void {
    let dto = new MaintenanceReportDto();
    if (this.searchOption == 1) {
      dto.startDate1 = new Date(this.date1);
      dto.startDate2 = new Date(this.date2);
    } else if (this.searchOption == 2) {
      dto.endDate1 = new Date(this.date1);
      dto.endDate2 = new Date(this.date2);
    }

    this._maintenanceService.getReport(dto).subscribe({
      next: (data: Maintenance[]) => {
        this.maintenanceList = data;
        this.rerender();
      },
      error: () => {
        this.toastr.error('Ocurrió un error');
      }
    });
  }

  clearData(): void {
    this.maintenanceList = [];
    this.reDraw();
  }

  printReport(save: boolean): void {
    const header = [
      "#",
      "Tipo de PC",
      "Nombre del Equipo",
      "Número de Serie",
      "Fecha",
      "Fecha Fin",
      "Agregado por",
      "Observaciones",
      "Estado",
    ];
    const body = this.maintenanceList.map((m, index) => {
      return [
        index + 1,
        m.equipment.pcType,
        m.equipment.equipmentName,
        m.equipment.serialNumber,
        m.startDate,
        m.endDate,
        m.user.name,
        m.notes,
        m.status,
      ];
    });
    this._reportsService.print(header, body, 'Reporte de Visitas', 'a4', save);
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(0);
    });
  }

  reDraw(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.clear().draw();
      dtInstance.destroy();
      this.dtTrigger.next(0);
    });
  }

}
