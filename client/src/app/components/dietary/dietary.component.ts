import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';
import { MedsService } from '../../services/meds.service';

@Component({
  selector: 'app-dietary',
  templateUrl: './dietary.component.html',
  styleUrls: ['./dietary.component.css']
})

export class DietaryComponent  implements OnInit {
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
  allSessions;
  enrolled;
  toAddType;
  options;
  dropdownDivisions;
  divisionShowing = {
    name:"Show All"
  };
  genderShowing = "all";

  constructor(
    private campsService: CampsService,
    public authService: AuthService,
    public medsService: MedsService,
    private router: Router,
    private authGuard: AuthGuard
  ) { }

  getAllCampers(){
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
      this.allSessions = Object.assign([],this.sessions);
      }
    });
  }

  addAllergy(camper){
    if(camper.toAddAllergy){
      this.medsService.addAllergy(camper).subscribe(()=>{
        this.getAllCampers();
      });
    }
  }

  removeAllergy(allergy,camper){
    var data = {
      allergy:allergy,
      camper:camper
    }
    this.medsService.removeAllergy(data).subscribe(()=>{
      this.getAllCampers();
    });
  }

  addOtherDietary(camper){
    if(camper.toAddOther){
      this.medsService.addOtherDietary(camper).subscribe(()=>{
        this.getAllCampers();
      });
    }
  }

  removeOtherDietary(otherDietary,camper){
    var data = {
      otherDietary:otherDietary,
      camper:camper
    }
    this.medsService.removeOtherDietary(data).subscribe(()=>{
      this.getAllCampers();
    });
  }

  preAddAllergy(e,camper){
    camper.toAddAllergy = e.target.value;
  }

  preAddOther(e,camper){
    camper.toAddOther = e.target.value;
  }

  getOptions(){
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options
    });
  }

  populateDivisions(){
    this.campsService.getAllDivisions().subscribe(data=>{
      this.dropdownDivisions = data;
      if(this.authService.admin()){
        this.dropdownDivisions.divisions[0].divisions.unshift({
          name:"Show All"
        });
        this.dropdownDivisions.divisions[1].divisions.unshift({
          name:"Show All"
        });
      }
      // if(this._gender=="female")
      //   this.divisions = data.divisions[0].divisions;
      // else if(this._gender=="male")
      //   this.divisions = data.divisions[1].divisions;
      
      // this.selectedChanged.emit(this.divisions[0]);
    });
  }

  filterDivision(e){
    this.divisionShowing = e;
    this.filter();

  }
  filterGender(e){
    this.genderShowing = e;
    this.filter()
  }

  filter(){
      this.sessions = this.allSessions;
      var allGenders = this.genderShowing == "all";
      var allDivisions = this.divisionShowing.name == "Show All"
      var tempSessions = [];
      console.log(this.sessions);
      for(let session of this.sessions){
        var tempSession = Object.assign({},session);;
        var tempCampers = [];
        for(let campers of session.campers){
          console.log((campers.gender.toLowerCase() == this.genderShowing || allGenders) && (campers.division.name == this.divisionShowing.name || allDivisions));
          if((campers.gender.toLowerCase() == this.genderShowing || allGenders) && (campers.division.name == this.divisionShowing.name || allDivisions)){
            tempCampers.push(campers);
          }
        }
        tempSession.campers = tempCampers
        tempSessions.push(tempSession);
      }
      this.sessions = tempSessions;
      console.log(this.sessions);
  }

  divGenders(gender){
    if(gender.toLowerCase()=="female"){
      return this.dropdownDivisions.divisions[0].divisions;
    }
    else if(gender.toLowerCase()=="male")
      return this.dropdownDivisions.divisions[1].divisions;
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.populateDivisions();
    this.getAllCampers();
    this.getOptions();
  }

}

