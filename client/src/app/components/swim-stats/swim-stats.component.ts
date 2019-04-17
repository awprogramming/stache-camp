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
  allCampers;
  loading;

  constructor(
    private campsService: CampsService,
    public authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) { }

  
  getAllCampers(){
    this.loading = true;
    this.campsService.get_all_division_campers().subscribe(data => {
      if(this.authService.isUser()){
        this.divisions = Object.keys(data.campers);
      }
      if(this.authService.admin()){
        console.log(data);
        this.allCampers = data;
        this.session = this.allCampers;
      }
      this.loading = false;
    });
  }

  getOptions(){
    this.loading = true;
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options;
      this.loading = false;
    });
  }

  displayDateHelper(d){
    if(d){
      d = new Date(d);
      return d.getMonth()+1 + "/" + d.getDate() + "/" + d.getFullYear();
    }
    else
      return "Report not yet sent.";
  }

  goToStats(camper){
    this.router.navigate(['/swim-stat/'+camper._id]);
  }

  filter(e){
    this.loading = true;
    if(e != "all"){
      this.session = {};
      this.session.divisions = [];
      for(let division of this.allCampers.divisions){
        var div = {
          d_id:{
            name:division.d_id.name
          },
          campers:[]
        }
        var campers = [];
        for(let camper of division.campers){
          if(camper.cSwimOpts.currentLevel && camper.cSwimOpts.currentLevel.rcLevel == e.rcLevel){
            campers.push(camper);
          }
        }
        div.campers = campers;
        this.session.divisions.push(div);
      }

    }
    else{
      this.session = this.allCampers
    }
    this.loading = false;
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

