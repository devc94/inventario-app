export class MaintenanceDto {
  id?: number;
  equipment: number;
  startDate: Date;
  endDate?: Date;
  user: number;
  notes: string;
  status: string;

  constructor(equipment: number, startDate: Date, user: number, notes: string, status: string) {
    this.equipment = equipment;
    this.startDate = startDate;
    this.user = user;
    this.notes = notes;
    this.status = status;
  }
}
