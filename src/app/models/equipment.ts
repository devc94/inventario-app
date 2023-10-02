import {OperatingSystem} from "./operating-system";
import {Department} from "./department";
import {Job} from "./job";
import {BranchOffice} from "./branch-office";

export class Equipment {
  id?: number;
  pcType: string;
  equipmentName: string;
  brand: string;
  model: string;
  serialNumber: string;
  ipAddress: string;
  connection: string;
  connectionType: string;
  os: OperatingSystem;
  osLicense: string;
  processor: string;
  ram: string;
  microsoftOffice: string;
  microsoftOfficeLicense: string;
  antivirus: string;
  anydesk: string;
  storageUnit: string;
  storageCapacity: string;
  assignedTo: string;
  department: Department;
  job: Job;
  email: string;
  branchOffice: BranchOffice;
  notes: string;
  createdAt: Date;

  constructor(
    pcType: string,
    equipmentName: string,
    brand: string,
    model: string,
    serialNumber: string,
    ipAddress: string,
    connection: string,
    connectionType: string,
    os: OperatingSystem,
    osLicense: string,
    processor: string,
    ram: string,
    microsoftOffice: string,
    microsoftOfficeLicense: string,
    antivirus: string,
    anydesk: string,
    storageUnit: string,
    storageCapacity: string,
    assignedTo: string,
    department: Department,
    job: Job,
    email: string,
    branchOffice: BranchOffice,
    notes: string,
    createdAt: Date,
  ) {
    this.pcType = pcType;
    this.equipmentName = equipmentName;
    this.brand = brand;
    this.model = model;
    this.serialNumber = serialNumber;
    this.ipAddress = ipAddress;
    this.connection = connection;
    this.connectionType = connectionType;
    this.os = os;
    this.osLicense = osLicense;
    this.processor = processor;
    this.ram = ram;
    this.microsoftOffice = microsoftOffice;
    this.microsoftOfficeLicense = microsoftOfficeLicense;
    this.antivirus = antivirus;
    this.anydesk = anydesk;
    this.storageUnit = storageUnit;
    this.storageCapacity = storageCapacity;
    this.assignedTo = assignedTo;
    this.department = department;
    this.job = job;
    this.email = email;
    this.branchOffice = branchOffice;
    this.notes = notes;
    this.createdAt = createdAt;
  }
}
