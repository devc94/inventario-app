export class UpdateUserDto {
  id: number;
  name: string;
  username: string;
  email: string;
  role: number;

  constructor(id: number, name: string, username: string, email: string, role: number) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.email = email;
    this.role = role;
  }
}
