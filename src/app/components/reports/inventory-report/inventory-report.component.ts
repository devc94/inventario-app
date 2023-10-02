import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import {Equipment} from "../../../models/equipment";
import {HttpClient} from "@angular/common/http";
import {EquipmentService} from "../../../services/equipment.service";
import {ReportsService} from "../../../services/reports.service";
import {ToastrService} from "ngx-toastr";
import {EquipmentReportDto} from "../../../models/equipment-report.dto";

@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.scss']
})
export class InventoryReportComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, {static: false})
    // @ts-ignore
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  // @ts-ignore
  dtTrigger: Subject = new Subject();
  equipmentList: Equipment[];
  date1: Date;
  date2: Date;

  options: any = {
    format: 'DD/MM/YYYY',
    useCurrent: true,
  };

  constructor(
    private title: Title,
    private http: HttpClient,
    private _equipmentService: EquipmentService,
    private _reportsService: ReportsService,
    private toastr: ToastrService,
  ) {
    this.equipmentList = [];
    this.date1 = new Date();
    this.date2 = new Date();
  }

  ngOnInit(): void {
    this.title.setTitle('Reporte de Inventario');
    this.tableOptions();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(0);
  }

  tableOptions(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [
        [10, 25, 50, 100, -1],
        [10, 25, 50, 100, 'All']
      ],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json',
      },
      searching: false,
      destroy: true,
    };
  }

  getReport(): void {
    let dto = new EquipmentReportDto();
    dto.createdAt1 = new Date(this.date1);
    dto.createdAt2 = new Date(this.date2);

    this._equipmentService.getReport(dto).subscribe({
      next: (data: Equipment[]) => {
        this.equipmentList = data;
        this.rerender();
      },
      error: () => {
        this.toastr.error('Ocurrió un error');
      }
    });
  }

  clearData(): void {
    this.equipmentList = [];
    this.reDraw();
  }

  printReport(save: boolean): void {
    const header = [
      "#",
      "Tipo de PC",
      "Nombre del Equipo",
      "Marca",
      "Modelo",
      "Número de Serie",
      "Dirección IP",
      "Conexión",
      "Tipo de Conexión",
      "SO",
      "Licencia SO",
      "Procesador",
      "RAM",
      "Microsoft Office",
      "Licencia Office",
      "Antivirus",
      "Anydesk",
      "Unidad de Almacenamiento",
      "Capacidad de Almacenamiento",
      "Asignada a",
      "Departamento",
      "Puesto",
      "Correo",
      "Sucursal",
      "Observaciones",
    ];
    const body = this.equipmentList.map((e, index) => {
      return [
        index + 1,
        e.pcType,
        e.equipmentName,
        e.brand,
        e.model,
        e.serialNumber,
        e.ipAddress,
        e.connection,
        e.connectionType,
        e.os.name,
        e.osLicense,
        e.processor,
        e.ram,
        e.microsoftOffice,
        e.microsoftOfficeLicense,
        e.antivirus,
        e.anydesk,
        e.storageUnit,
        e.storageCapacity,
        e.assignedTo,
        e.department.name,
        e.job.name,
        e.email,
        e.branchOffice.name,
        e.notes,
      ];
    });
    this._reportsService.print(header, body, 'Reporte de Inventario', 'a0', save);
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
