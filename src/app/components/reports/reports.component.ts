import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ReportsService} from "../../services/reports.service";
import {DepartmentService} from "../../services/department.service";
import {Department} from "../../models/department";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor(
    private title: Title,
  ) {
  }

  ngOnInit(): void {
    this.title.setTitle('Reportes');
  }
}
