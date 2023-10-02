import {Equipment} from "./equipment";
import {User} from "./user";

export class Maintenance {
  id?: number;
  equipment: Equipment;
  startDate: Date;
  endDate: Date;
  user: User;
  notes: string;
  status: string;

  constructor(equipment: Equipment, startDate: Date, endDate: Date, user: User, notes: string, status: string) {
    this.equipment = equipment;
    this.startDate = startDate;
    this.endDate = endDate;
    this.user = user;
    this.notes = notes;
    this.status = status;
  }
}
