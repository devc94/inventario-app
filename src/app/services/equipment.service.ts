import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Equipment} from "../models/equipment";
import {NewEquipmentDto} from "../models/new-equipment.dto";
import {UpdateEquipmentDto} from "../models/update-equipment.dto";
import {EquipmentReportDto} from "../models/equipment-report.dto";

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  equipmentUrl = environment.apiURL + 'equipment';

  constructor(private http: HttpClient) {
  }

  get(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(this.equipmentUrl);
  }

  getReport(dto: EquipmentReportDto): Observable<any> {
    return this.http.post<any>(`${this.equipmentUrl}/report`, dto);
  }

  getAllForMaintenance(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`http://localhost:8080/equipment/maintenace`);
  }

  getByID(id: number): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.equipmentUrl}/${id}`);
  }

  create(department: NewEquipmentDto): Observable<any> {
    return this.http.post<any>(this.equipmentUrl, department);
  }

  update(department: UpdateEquipmentDto): Observable<any> {
    return this.http.put<any>(`${this.equipmentUrl}/${department.id}`, department);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.equipmentUrl}/${id}`);
  }
}
