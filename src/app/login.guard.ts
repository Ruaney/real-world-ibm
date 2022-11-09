import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  haveToken = sessionStorage.getItem('token') ? true : false;
  constructor(private router:Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //geralmente usam route e state pra ver as routas child?
      return this.isAuthenticated() ;
    }
    
    isAuthenticated() {
      if (this.haveToken ) {
        return true;
      } else {
        this.router.navigateByUrl('/login');
        return false
      }
    }
}