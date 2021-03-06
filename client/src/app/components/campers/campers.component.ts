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
  parentForm:FormGroup;
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
  toMassReenroll = [];
  loading;
  divisionShowing = {
    name:"Show All"
  };
  genderShowing = "all";

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
      pID:['', Validators.required],
      first: ['', Validators.required],
      last:['', Validators.required],
      gender: ['', Validators.required]
    });

    this.parentForm = this.formBuilder.group({
      pID:['', Validators.required],
      first: ['', Validators.required],
      last:['', Validators.required],
      p1Name: '',
      p1Email: '',
      p2Name: '',
      p2Email: '',
      gender: ['', Validators.required]
    });


    this.bulkAddForm = this.formBuilder.group({
      camper_file:['']
    });
  }

  onRegistrationSubmit() {
    this.loading = true;
    this.processing = true;
    var camper;
    if(!this.campsService.hasModule("swim")){
      camper = {
        _id: this.form.get('pID').value,
        first: this.form.get('first').value,
        last: this.form.get('last').value,
        gender: this.form.get('gender').value,
      }
    }
    else{
      camper = {
        _id: this.parentForm.get('pID').value,
        first: this.parentForm.get('first').value,
        last: this.parentForm.get('last').value,
        p1Name: this.parentForm.get('p1Name').value,
        p1Email: this.parentForm.get('p1Email').value,
        p2Name: this.parentForm.get('p2Name').value,
        p2Email: this.parentForm.get('p2Email').value,
        gender: this.parentForm.get('gender').value,
      }
      console.log(camper)
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
        console.log(line);
        if(skip)
          skip = false;
        else{
          var vals = line.split(',');
          if(vals.length > 1){
            var data;
            if(cs.hasModule("swim")){
              var _id = vals[0].split('\n')[1];
              var bracelet;
              if(vals[11])
                bracelet = vals[11].toLowerCase();
              else
                bracelet = "none";
              if(bracelet != "orange" && bracelet != "green")
                bracelet = "none";
              data = {
                divisionName:vals[5].trim(),
                camper:{
                    _id: _id,
                    first: vals[1],
                    last: vals[2],
                    gender: vals[4].toLowerCase(),
                    grade: vals[3],
                    p1Name: vals[6],
                    p1Email: vals[7],
                    p2Name: vals[8],
                    p2Email: vals[9],
                    cSwimOpts: {
                      bracelet: bracelet
                    },
                },
                cSwimOpts: {
                  rcLevel: vals[10]
                },
              }
              campers.push(data);
            }
            else{
              var _id = vals[0].split('\n')[1];
              data = {
                divisionName:vals[4],
                camper:{
                  _id: _id,
                  first: vals[1],
                  last: vals[2],
                  gender: vals[3].toLowerCase(),
                } 
              }
              campers.push(data);
            }
          }
        }
      }
    }
    myReader.readAsText(file);
    console.log(campers);
    this.uploaded_campers = campers;
}

gradeConversion(grade){
  var grades = ["k","1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"];
  return grades.indexOf(grade);
}

  onBulkUploadSubmit(){
    this.loading = true;
    var divisions = Math.ceil(this.uploaded_campers.length/20);
    for(var i = 0; i < divisions; i++){
      if(i+1==divisions){
        console.log(this.uploaded_campers.slice(i*20))
        this.bulkHelper(this.uploaded_campers.slice(i*20));
      }
      else{
        console.log(this.uploaded_campers.slice(i*20,i*20+20));
        this.bulkHelper(this.uploaded_campers.slice(i*20,(i*20)+20));
      }
        
    }
    
    
  }

  // populateDivisions(){
  //   this.campsService.getAllDivisions().subscribe(data=>{
  //     this.dropdownDivisions = data;
  //     // if(this._gender=="female")
  //     //   this.divisions = data.divisions[0].divisions;
  //     // else if(this._gender=="male")
  //     //   this.divisions = data.divisions[1].divisions;
      
  //     // this.selectedChanged.emit(this.divisions[0]);
  //   });
  // }

  // divGenders(gender){
  //   if(gender.toLowerCase()=="female"){
  //     return this.dropdownDivisions.divisions[0].divisions;
      
  //   }
  //   else if(gender.toLowerCase()=="male")
  //     return this.dropdownDivisions.divisions[1].divisions;
  // }

  bulkHelper(subset){
    this.campsService.bulkRegisterCampers(subset).subscribe(data => {

      if (!data.success) {
        console.log(data);
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
    this.loading = true;
    this.campsService.getAllCampers().subscribe(data => {
      if(this.authService.isUser()){
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
      this.allSessions = Object.assign([],this.sessions);
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

  remove(camper){
    if(confirm("Are you sure you wish to delete this camper?")){
    this.loading = true;
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
  }

  addDivision(camper){
    this.loading = true;
    this.campsService.addDivisionToCamper(camper).subscribe(data => {
      this.getAllCampers();
    });
  }

  preAdd(e,counselor){
    counselor.toAdd = e;
  }

  addSpecialty(counselor){
    this.loading = true;
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

  preMassReenroll(e,counselor){
    if(e.target.checked){
      this.toMassReenroll[counselor._id] = counselor;
    }
    else{
      delete this.toMassReenroll[counselor._id];
    }
    
  }

  massReenroll(){
    this.loading = true;
    for(let counselor of Object.keys(this.toMassReenroll)){
      this.reenroll(this.toMassReenroll[counselor],true);
    }
    this.toMassReenroll = [];
  }

  reenroll(c,mass){
    this.loading = true;
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
  populateDivisions(){
    this.loading = true;
    this.campsService.getAllDivisions().subscribe(data=>{
      this.dropdownDivisions = []
      for(let gender of data.divisions)
        this.dropdownDivisions[gender._id.gender] = gender.divisions;
      if(this.authService.admin()){
        this.dropdownDivisions["female"].unshift({
          name:"Show All"
        });
        this.dropdownDivisions["male"].unshift({
          name:"Show All"
        });
      }
      this.loading = false;
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
          if(campers.division&&(campers.gender.toLowerCase() == this.genderShowing || allGenders) && (campers.division.name == this.divisionShowing.name || allDivisions)){
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
      return this.dropdownDivisions["female"];
    }
    else if(gender.toLowerCase()=="male")
      return this.dropdownDivisions["male"];
  }

  goToCamper(id){
    this.router.navigate(['/camper/'+id]);
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

