import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-campers',
  templateUrl: './campers.component.html',
  styleUrls: ['./campers.component.css']
})
export class CampersComponent implements OnInit {
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

  constructor(
    private formBuilder: FormBuilder,
    private campsService: CampsService,
    public authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) { 
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      first: ['', Validators.required],
      last:['', Validators.required],
      gender: ['', Validators.required]
    });
    this.bulkAddForm = this.formBuilder.group({
      camper_file:['']
    });
  }

  onRegistrationSubmit() {
    this.processing = true;
    const camper = {
      first: this.form.get('first').value,
      last: this.form.get('last').value,
      gender: this.form.get('gender').value,
    }
  
    this.campsService.registerCamper(camper).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          if(this.previousUrl)
            this.router.navigate([this.previousUrl]);
          else{
            this.newCamp = false;
            this.getAllCampers();
          }
        }, 2000);
      }
    });
  }

  fileUploaded(event: any) {
    const file = event.srcElement.files[0];
    var myReader:FileReader = new FileReader();
    var campers = [];
    var types = this.options.camper_types;
    var session = this.options.session;
    var cs = this.campsService;
    var c = this;
    myReader.onloadend = function(e){
      // you can perform an action with readed data here
      var lines = myReader.result.split('\r');
      var skip = true;
      for(let line of lines){
        if(skip)
          skip = false;
        else{
          var vals = line.split(',');
          var data;
          if(cs.hasModule("swim")){
            
            data = {
              divisionName:vals[0],
              camper:{
                  first: vals[2],
                  last: vals[1],
                  gender: vals[3],
                  grade: c.gradeConversion(vals[4]),
                  p1Name: vals[5],
                  p1Email: vals[6],
                  p2Name: vals[7],
                  p2Email: vals[8],
                  cSwimOpts: {
                    bracelet: vals[11]
                  },
              },
              cSwimOpts: {
                rcLevel: vals[9],
                swimAnimal: vals[10],
              },
            }
          }
          else{
            data = {
              first: vals[0],
              last: vals[1],
              gender: vals[2],
            }
          }
          campers.push(data);
        }
      }
    }
    myReader.readAsText(file);
    this.uploaded_campers = campers;
}

gradeConversion(grade){
  var grades = ["k","1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"];
  return grades.indexOf(grade);
}

  onBulkUploadSubmit(){
    this.campsService.bulkRegisterCampers(this.uploaded_campers).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        if(this.previousUrl)
          this.router.navigate([this.previousUrl]);
        else{
          this.newCamp = false;
          this.getAllCampers();
        }
      }
    });
  }

  getAllCampers(){
    this.campsService.getAllCampers().subscribe(data => {
      if(this.authService.isUser()){
        this.divisions = Object.keys(data.campers);
        this.campers = data.campers;
      }
      if(this.authService.admin()){
        this.sessions = data.output.sessions;
        if(data.output && data.output.sessions.length > 0){
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
      }
    });
  }

  getOptions(){
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options
    });
  }

  remove(camper){
    this.campsService.removeCamper(camper).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.getAllCampers();
      }
    });
  }

  addDivision(camper){
    this.campsService.addDivisionToCamper(camper).subscribe(data => {
      this.getAllCampers();
    });
  }

  preAdd(e,counselor){
    counselor.toAdd = e;
  }

  addSpecialty(counselor){
    this.campsService.addSpecialtyToCounselor(counselor).subscribe(data => {
      this.getAllCampers();
    });
  }

  preAddSpecialty(e,specialty){
    specialty.toAddSpecialty = e;
  }

  preAddType(e,type){
    this.toAddType = e;
  }

  showAdd() {
    this.newCamp = true;
  }

  cancelAdd() {
    this.newCamp = false;
  }

  showBulkAdd(){
    this.bulkAdd = true;
  }
  
  cancelBulkAdd(){
    this.bulkAdd = false;
  }

  reenroll(c){
    const camper = {
      "camper": c,
      "session":{
        "_id":this.sessions[0]._id.session_id,
        "name":this.sessions[0]._id.session_name
      }
    }
    this.campsService.reenroll(camper).subscribe(data => {
      this.getAllCampers();
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

