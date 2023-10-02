import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {TokenService} from "../services/token.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate {
  constructor(private _tokenService: TokenService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this._tokenService.isLogged()) {
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    }
    if (this._tokenService.isTokenExpired()) {
      this._tokenService.logout();
      this.router.navigate(['/login']).then();
    }
    return true;
  }
}
