import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-swim-stats',
  templateUrl: './swim-stats.component.html',
  styleUrls: ['./swim-stats.component.css']
})
export class SwimStatsComponent implements OnInit {

  messageClass;
  message;
  previousUrl;
  campers;
  divisions;
  session;
  options;

  constructor(
    private campsService: CampsService,
    public authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) { }

  
  getAllCampers(){
    this.campsService.get_all_division_campers().subscribe(data => {
      if(this.authService.isUser()){
        this.divisions = Object.keys(data.campers);
        this.campers = data.campers;
      }
      if(this.authService.admin()){
        this.session = data.output;
        for(let division of this.session.divisions){
          console.log(division);
        }
      }
    });
  }

  getOptions(){
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options
    });
  }

  goToStats(camper){
    this.router.navigate(['/swim-stat/'+camper._id]);
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.getAllCampers();
    this.getOptions();
  }

}

