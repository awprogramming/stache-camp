import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { CampsService } from '../services/camps.service';
import { ActivatedRoute } from '@angular/router/src/router_state';

@Injectable()
export class ModuleGuard implements CanActivate{
    
    redirectUrl;
    modules;
    
    constructor(
        private campsService: CampsService,
        private router: Router
    ) { }
    canActivate(
        router: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ){
        if(this.campsService.hasModule(router.data['module'])){
            return true;
        }
        else{
            this.redirectUrl = state.url;
            this.router.navigate(['/login']);
            return false;
        }
    }
}