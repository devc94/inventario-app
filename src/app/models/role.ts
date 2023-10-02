export class Role {
  id?: number;
  name: string;
  permissions: string;

  constructor(name: string, permissions: string) {
    this.name = name;
    this.permissions = permissions;
  }
}
