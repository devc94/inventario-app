export class UpdateEquipmentDto {
  id: number;
  pcType: string;
  equipmentName: string;
  brand: string;
  model: string;
  serialNumber: string;
  ipAddress: string;
  connection: string;
  connectionType: string;
  os: number;
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
  department: number;
  job: number;
  email: string;
  branchOffice: number;
  notes: string;

  constructor(
    id: number,
    pcType: string,
    equipmentName: string,
    brand: string,
    model: string,
    serialNumber: string,
    ipAddress: string,
    connection: string,
    connectionType: string,
    os: number,
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
    department: number,
    job: number,
    email: string,
    branchOffice: number,
    notes: string,
  ) {
    this.id = id;
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
  }
}
