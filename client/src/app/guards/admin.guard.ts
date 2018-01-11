import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router/src/router_state';

@Injectable()
export class AdminGuard implements CanActivate{
    
    redirectUrl;
    
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }
    canActivate(
        router: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ){
        if(this.authService.admin()){
            return true;
        }
        else{
            this.redirectUrl = state.url;
            this.router.navigate(['/login']);
            return false;
        }
    }
}