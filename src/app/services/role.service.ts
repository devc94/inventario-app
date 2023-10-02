import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Role} from "../models/role";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  roleUrl = environment.apiURL + 'role';

  constructor(private http: HttpClient) {
  }

  get(): Observable<Role[]> {
    return this.http.get<Role[]>(this.roleUrl);
  }

  getById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.roleUrl}/${id}`);
  }

  create(role: Role): Observable<any> {
    return this.http.post<any>(this.roleUrl, role);
  }

  update(role: Role): Observable<any> {
    return this.http.put<any>(`${this.roleUrl}/${role.id}`, role);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.roleUrl}/${id}`);
  }
}
