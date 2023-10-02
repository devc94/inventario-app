export class OperatingSystem {
  id?: number;
  name: string;
  architecture: string;

  constructor(name: string, architecture: string) {
    this.name = name;
    this.architecture = architecture;
  }
}
