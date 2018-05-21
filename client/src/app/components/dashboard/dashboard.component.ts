import { Component, OnInit } from '@angular/core';
import { EvaluationsService } from '../../services/evaluations.service';
import { CampsService } from '../../services/camps.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private evaluationsService: EvaluationsService,
    private campsService: CampsService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    if(this.authService.superUser())
      this.router.navigate(['/camps']); 
    else if(this.authService.admin())
      this.router.navigate(['/options']);
    else{
      if(this.campsService.hasModule('eval')){
        this.router.navigate(['/evaluations']);
      }
      else if(this.campsService.hasModule('swim')){
        this.router.navigate(['/swim-groups']);
      }
      else{
        this.router.navigate(['/options']);
      }
    }

  }

}
