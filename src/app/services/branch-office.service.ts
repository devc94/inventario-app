import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BranchOffice } from '../models/branch-office';

@Injectable({
  providedIn: 'root'
})
export class BranchOfficeService {
  branchOfficeUrl = environment.apiURL + 'branch-office';

  constructor(private http: HttpClient) { }

  get(): Observable<BranchOffice[]> {
    return this.http.get<BranchOffice[]>(this.branchOfficeUrl);
  }

  getByID(id: number): Observable<BranchOffice> {
    return this.http.get<BranchOffice>(`${this.branchOfficeUrl}/${id}`);
  }

  create(branchOffice: BranchOffice): Observable<any> {
    return this.http.post<any>(this.branchOfficeUrl, branchOffice);
  }

  update(branchOffice: BranchOffice): Observable<any> {
    return this.http.put<any>(`${this.branchOfficeUrl}/${branchOffice.id}`, branchOffice);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.branchOfficeUrl}/${id}`);
  }
}
