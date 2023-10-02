import {Role} from "./role";

export class User {
  id?: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role: Role;

  constructor(name: string, username: string, email: string, password: string, role: Role) {
    this.name = name;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
