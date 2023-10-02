import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/user";
import {NewUserDto} from "../models/new-user.dto";
import {UpdateUserDto} from "../models/update-user.dto";
import {ChangePasswordDto} from "../models/change-password.dto";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userUrl = environment.apiURL + 'user';

  constructor(private http: HttpClient) {
  }

  get(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${id}`);
  }

  changePassword(changePasswordDto: ChangePasswordDto): Observable<any> {
    return this.http.post<any>(`${this.userUrl}/change_password/${changePasswordDto.id}`, changePasswordDto);
  }

  create(user: NewUserDto): Observable<any> {
    return this.http.post<any>(this.userUrl, user);
  }

  update(user: UpdateUserDto): Observable<any> {
    return this.http.put<any>(`${this.userUrl}/${user.id}`, user);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.userUrl}/${id}`);
  }
}
