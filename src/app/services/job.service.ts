import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/job';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  jobUrl = environment.apiURL + 'job';

  constructor(private http: HttpClient) { }

  get(): Observable<Job[]> {
    return this.http.get<Job[]>(this.jobUrl);
  }

  getByID(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.jobUrl}/${id}`);
  }

  create(job: Job): Observable<any> {
    return this.http.post<any>(this.jobUrl, job);
  }

  update(job: Job): Observable<any> {
    return this.http.put<any>(`${this.jobUrl}/${job.id}`, job);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.jobUrl}/${id}`);
  }
}
