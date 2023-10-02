import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OperatingSystem } from '../models/operating-system';

@Injectable({
  providedIn: 'root'
})
export class OperatingSystemService {
  operatingSystemUrl = environment.apiURL + 'operating-system';

  constructor(private http: HttpClient) { }

  get(): Observable<OperatingSystem[]> {
    return this.http.get<OperatingSystem[]>(this.operatingSystemUrl);
  }

  getByID(id: number): Observable<OperatingSystem> {
    return this.http.get<OperatingSystem>(`${this.operatingSystemUrl}/${id}`);
  }

  create(operatingSystem: OperatingSystem): Observable<any> {
    return this.http.post<any>(this.operatingSystemUrl, operatingSystem);
  }

  update(operatingSystem: OperatingSystem): Observable<any> {
    return this.http.put<any>(`${this.operatingSystemUrl}/${operatingSystem.id}`, operatingSystem);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.operatingSystemUrl}/${id}`);
  }
}
