export class ChangePasswordDto {
  id: number;
  newPassword: string;

  constructor(id: number, newPassword: string) {
    this.id = id;
    this.newPassword = newPassword;
  }
}
