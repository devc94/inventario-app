import {Component, OnInit} from '@angular/core';
import {TokenService} from "../../services/token.service";
import {Payload} from "../../models/payload";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  user: Payload;
  isLogged: boolean = false;

  name: string;

  constructor(private _tokenService: TokenService) {
    this.name = '';
    this.user = new Payload(0, '', '', '', 0);
  }

  ngOnInit(): void {
    this.user = this._tokenService.getUser()!;
    this._tokenService.isLogged() ? this.isLogged = true : this.isLogged = false;
    this.name = this._tokenService.getName()!;
  }

}
