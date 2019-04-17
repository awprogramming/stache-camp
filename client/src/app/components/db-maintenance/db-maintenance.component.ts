import { Component, OnInit } from '@angular/core';
import { CampsService } from '../../services/camps.service';
import { DbMaintenanceService } from '../../services/db-maintenance.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-db-maintenance',
  templateUrl: './db-maintenance.component.html',
  styleUrls: ['./db-maintenance.component.css']
})
export class DbMaintenanceComponent implements OnInit {
  messageClass;
  message;
  previousUrl;
  campers;
  divisions;
  session;
  options;
  allCampers;
  loading;

  constructor(
    private campsService: CampsService,
    public authService: AuthService,
    public dbMaintenanceService: DbMaintenanceService,
    private router: Router,
    private authGuard: AuthGuard
  ) { }

  transferCampers(){
    this.dbMaintenanceService.transferCampers().subscribe(data => {
        console.log(data);
    });
  }

  transferDivisions(){
    this.dbMaintenanceService.transferDivisions().subscribe(data => {
        console.log(data);
    });
  }

  transferSpecialties(){
    this.dbMaintenanceService.transferSpecialties().subscribe(data => {
        console.log(data);
    });
  }

  transferCounselors(){
    this.dbMaintenanceService.transferCounselors().subscribe(data => {
        console.log(data);
    });
  }

  transferUsers(){
    this.dbMaintenanceService.transferUsers().subscribe(data => {
        console.log(data);
    });
  }
 
  transferSessions(){
    this.dbMaintenanceService.transferSessions().subscribe(data => {
        console.log(data);
    });
  }

  transferQuestions(){
    this.dbMaintenanceService.transferQuestions().subscribe(data => {
        console.log(data);
    });
  }

  efficientAnswers(){
    this.dbMaintenanceService.efficientAnswers().subscribe(data => {
        console.log(data);
    });
  }

  sessToId(){
    this.dbMaintenanceService.sessToId().subscribe(data => {
        console.log(data);
    });
  }

  rosSessToId(){
    this.dbMaintenanceService.rosSessToId().subscribe(data => {
        console.log(data);
    });
  }

  transferRosters(){
    this.dbMaintenanceService.transferRosters().subscribe(data => {
        console.log(data);
    });
  }
  transferSwimGroups(){
    this.dbMaintenanceService.transferSwimGroups().subscribe(data => {
        console.log(data);
    });
  }
  transferSwimLevels(){
    this.dbMaintenanceService.transferSwimLevels().subscribe(data => {
        console.log(data);
    });
  }

  convertCompleted(){
    this.dbMaintenanceService.convertCompleted().subscribe(data => {
        console.log(data);
    });
  }

  flSwap(){
    this.dbMaintenanceService.flSwap().subscribe(data => {
        console.log(data);
    });
  }

  unsetStuff(){
    this.dbMaintenanceService.unsetStuff().subscribe(data => {
        console.log(data);
    });
  } 

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
  }

}

