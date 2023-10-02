import {Injectable} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {catchError, concatMap, Observable, throwError} from 'rxjs';
import {TokenService} from "../services/token.service";
import {AuthService} from "../services/auth.service";
import {TokenDto} from "../models/token.dto";

const AUTHORIZATION = 'Authorization';
const BEARER = 'Bearer ';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(private _tokenService: TokenService, private _authService: AuthService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this._tokenService.isLogged()) {
      return next.handle(request);
    }
    let intReq = request;
    const token = this._tokenService.getToken();
    intReq = this.addToken(request, token);
    // return next.handle(intReq);
    return next.handle(intReq).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        const dto: TokenDto = new TokenDto(token);
        return this._authService.refresh(dto).pipe(concatMap((data: any) => {
          console.log('refreshing...');
          this._tokenService.setToken(data.token);
          intReq = this.addToken(request, data.token);
          return next.handle(intReq);
        }));
      } else {
        // this._tokenService.logout();
        return throwError(() => err);
      }
    }));
  }

  private addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({headers: request.headers.set(AUTHORIZATION, BEARER + token)});
  }
}

export const interceptorProvider = [{provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true}];
