export class UpdateMaintenanceDto {
  id: number;
  equipment: number;
  startDate: Date;
  user: number;
  notes: string;

  constructor(id: number, equipment: number, startDate: Date, user: number, notes: string) {
    this.id = id;
    this.equipment = equipment;
    this.startDate = startDate;
    this.user = user;
    this.notes = notes;
  }
}
