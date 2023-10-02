import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  year: number;
  version: string;

  constructor() {
    this.year = new Date().getFullYear();
    this.version = environment.version;
  }

  ngOnInit(): void {
  }

}
