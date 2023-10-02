import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserLoginDto} from "../models/user-login.dto";
import {Observable} from "rxjs";
import {TokenDto} from "../models/token.dto";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUrl = environment.apiURL + 'auth';

  constructor(private http: HttpClient) {
  }

  login(dto: UserLoginDto): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, dto);
  }

  refresh(dto: TokenDto): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/refresh`, dto);
  }
}
