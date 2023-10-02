import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  departmentUrl = environment.apiURL + 'department';

  constructor(private http: HttpClient) { }

  get(): Observable<Department[]> {
    return this.http.get<Department[]>(this.departmentUrl);
  }

  getByID(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.departmentUrl}/${id}`);
  }

  create(department: Department): Observable<any> {
    return this.http.post<any>(this.departmentUrl, department);
  }

  update(department: Department): Observable<any> {
    return this.http.put<any>(`${this.departmentUrl}/${department.id}`, department);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.departmentUrl}/${id}`);
  }
}
