import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Maintenance} from "../../models/maintenance";
import {Subject} from "rxjs";
import {MaintenanceService} from "../../services/maintenance.service";
import {ToastrService} from "ngx-toastr";
import {Title} from "@angular/platform-browser";
import {DataTableDirective} from "angular-datatables";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: false})
    // @ts-ignore
  dtElement: DataTableDirective;
  maintenanceList: Maintenance[];

  status: string[] = ['Pendiente de Revisión', 'En Revisión', 'Revisión Completada'];

  dtOptions: any;
  // @ts-ignore
  dtTrigger: Subject = new Subject();

  constructor(private _maintenanceService: MaintenanceService, private _toastr: ToastrService, private title: Title) {
    this.maintenanceList = [];
  }

  ngOnInit(): void {
    this.title.setTitle('Inventario');
    this.tableOptions();
    this.getData();
  }

  getData(): void {
    this._maintenanceService.getDashboard().subscribe({
      next: (result: Maintenance[]) => {
        this.maintenanceList = result;
        this.dtTrigger.next(0);
      },
      error: (error) => {
        this._toastr.error(error.message);
      }
    });
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  tableOptions(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true,
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
}


