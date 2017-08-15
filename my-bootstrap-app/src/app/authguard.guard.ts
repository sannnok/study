import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';

@Injectable()
export class AuthguardGuard implements CanActivate {

  constructor(private user: UserService){}




  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

  	// if (localStorage.getItem('currentUser')){
  	// 	return true;
  	// }else{
  	// 	return false;
  	// }

	if ( this.user.tokenNotExpired()){
		return this.user.getUserLoggedIn();
	}else{
		return this.user.getUserLoggedIn();
	}

    //return this.user.getUserLoggedIn();

  }


}
