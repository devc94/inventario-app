import {Injectable} from '@angular/core';
import {Payload} from "../models/payload";
import {RoleService} from "./role.service";

@Injectable({
  providedIn: 'root'
})
export class TokenService {


  constructor(private _roleService: RoleService) {
  }

  isLogged(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string {
    return localStorage.getItem('token')!;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    const exp = (JSON.parse(window.atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= exp;
  }

  getName(): string | null {
    if (!this.isLogged()) {
      return null;
    }
    const token = this.getToken();
    const payload = token.split('.')[1];
    const values = window.atob(payload);
    const valuesJson = JSON.parse(values);
    return valuesJson.name;
  }

  getUser(): Payload | null {
    if (!this.isLogged()) return null;
    const token = this.getToken();
    const payload = token.split('.')[1];
    const values = window.atob(payload);
    const json = JSON.parse(values);
    return new Payload(json.id, json.name, json.username, json.email, json.role);
  }

  getRoleId(): number {
    let permissions: string[] = [];
    const user = this.getUser();
    const roleId = user?.role;
    return roleId!;
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
