import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';
import { MedsService } from '../../services/meds.service';

@Component({
  selector: 'app-meds',
  templateUrl: './meds.component.html',
  styleUrls: ['./meds.component.css']
})
export class MedsComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  form: FormGroup;
  bulkAddForm: FormGroup;
  previousUrl;
  newCamp = false;
  bulkAdd = false;
  campers;
  uploaded_campers;
  divisions;
  sessions;
  enrolled;
  toAddType;
  options;
  loading;

  constructor(
    private campsService: CampsService,
    public authService: AuthService,
    public medsService: MedsService,
    private router: Router,
    private authGuard: AuthGuard
  ) { }

  getAllCampers(){
    this.loading = true;
    this.campsService.getAllCampers().subscribe(data => {
      if(this.authService.isUser()){
        this.divisions = Object.keys(data.campers);
        this.campers = data.campers;
      }
      if(this.authService.admin()){
        this.sessions = data.output.sessions;
        if(data.output.sessions[0]._id.session_id!=data.output.cur_session._id){
          const session = {
            "_id": {
              "session_id":data.output.cur_session._id,
              "session_name":data.output.cur_session.name
            },
            "campers":[]
          }
          this.sessions.unshift(session);
        }
        else{
        this.enrolled = data.output.sessions[0].campers;

        for(var i = 1; i < this.sessions.length; i++){
          for(let camper of this.sessions[i].campers){
            for(let h of this.enrolled)
              if(h._id == camper._id)
                camper.enrolled = true;
          }
        }
      }
      }
      this.loading = false;
    });
  }

  epiChange(e,camper){
    var data = {
      camper:camper,
      epi:e.target.checked
    }
    this.medsService.changeEpi(data).subscribe();
  }

  inhChange(e,camper){
    var data = {
      camper:camper,
      inh:e.target.checked
    }
    this.medsService.changeInh(data).subscribe();
  }

  addMed(camper){
    this.loading = true;
    if(camper.toAdd){
      this.medsService.addMed(camper).subscribe(()=>{
        this.getAllCampers();
      });
    }
  }

  removeMed(med,camper){
    this.loading = true;
    var data = {
      med:med,
      camper:camper
    }
    this.medsService.removeMed(data).subscribe(()=>{
      this.getAllCampers();
    });
  }

  preAdd(e,camper){
    camper.toAdd = e.target.value;
  }

  getOptions(){
    this.loading = true;
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options
      this.loading = false;
    });
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

