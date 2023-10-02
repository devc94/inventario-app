export class NewUserDto {
  name: string;
  username: string;
  email: string;
  password: string;
  role: number;

  constructor(name: string, username: string, email: string, password: string, role: number) {
    this.name = name;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
