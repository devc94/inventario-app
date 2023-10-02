import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Maintenance} from "../models/maintenance";
import {MaintenanceDto} from "../models/maintenance.dto";
import {StatusDto} from "../models/status.dto";
import {UpdateMaintenanceDto} from "../models/update-maintenance.dto";
import {MaintenanceReportDto} from "../models/maintenance-report.dto";

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  maintenanceUrl = environment.apiURL + 'maintenance';

  constructor(private http: HttpClient) {
  }

  get(): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(this.maintenanceUrl);
  }

  getReport(dto: MaintenanceReportDto): Observable<any> {
    return this.http.post<any>(`${this.maintenanceUrl}/report`, dto);
  }

  getDashboard(): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(`${this.maintenanceUrl}/dashboard`);
  }

  getById(id: number): Observable<Maintenance> {
    return this.http.get<Maintenance>(`${this.maintenanceUrl}/${id}`);
  }

  create(maintenance: MaintenanceDto): Observable<any> {
    return this.http.post<any>(this.maintenanceUrl, maintenance);
  }

  update(maintenance: UpdateMaintenanceDto): Observable<any> {
    return this.http.put<any>(`${this.maintenanceUrl}/${maintenance.id}`, maintenance);
  }

  changeStatus(id: number, status: StatusDto): Observable<any> {
    return this.http.put<any>(`${this.maintenanceUrl}/${id}/status`, status);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.maintenanceUrl}/${id}`);
  }
}
