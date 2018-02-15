import { Injectable }           from '@angular/core';
import { 
    CanActivate, Router, 
    ActivatedRouteSnapshot,
    RouterStateSnapshot
}                               from '@angular/router';
import { AuthService }          from '../services/auth.service';

@Injectable()
export class NotAuthGuard implements CanActivate{
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }
    canActivate(){
        if(this.authService.loggedIn()){
            console.log("hello world");
            this.router.navigate(['/dashboard']);
            return false;
        }
        else{
            return true;
        }
    }
}