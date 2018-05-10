import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';
import { SwimService } from '../../services/swim.service';

@Component({
  selector: 'app-counselors',
  templateUrl: './counselors.component.html',
  styleUrls: ['./counselors.component.css']
})
export class CounselorsComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  form: FormGroup;
  bulkAddForm: FormGroup;
  previousUrl;
  newCamp = false;
  bulkAdd = false;
  counselors;
  uploaded_counselors;
  divisions;
  dropdownDivisions;
  sessions;
  hired;
  toAddType;
  options;
  lgReg;

  constructor(
    private formBuilder: FormBuilder,
    private campsService: CampsService,
    public authService: AuthService,
    public swimService: SwimService,
    private router: Router,
    private route:ActivatedRoute,
    private authGuard: AuthGuard
  ) { 
    this.lgReg = route.snapshot.data['lgReg'];
    this.createForm();
    
  }

  createForm() {
    this.form = this.formBuilder.group({
      first: ['', Validators.required],
      last:['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      gender: ['', Validators.required],
      type: ['',Validators.required]
    });
    this.bulkAddForm = this.formBuilder.group({
      counselor_file:['']
    });
  }

  onRegistrationSubmit() {
    if(this.lgReg){
      const counselor = {
        first: this.form.get('first').value,
        last: this.form.get('last').value,
        gender: this.form.get('gender').value,
        email: this.form.get('email').value,
        password: this.form.get('password').value
      }
    
      this.swimService.registerLifeguard(counselor).subscribe(data => {
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
              this.getAllCounselors();
            }
          }, 2000);
        }
        this.getAllCounselors();
      });
    }
    else{
      const counselor = {
        first: this.form.get('first').value,
        last: this.form.get('last').value,
        gender: this.form.get('gender').value,
        type: this.toAddType
      }
    
      this.campsService.registerCounselor(counselor).subscribe(data => {
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
              this.getAllCounselors();
            }
          }, 2000);
        }
      });
    }
  }

  fileUploaded(event: any) {
    const file = event.srcElement.files[0];
    var myReader:FileReader = new FileReader();
    var counselors = [];
    var types = this.options.counselor_types;
    var session = this.options.session;
    myReader.onloadend = function(e){
      // you can perform an action with readed data here
      var lines = myReader.result.split('\r');
      var skip = true;
      for(let line of lines){
        if(skip)
          skip = false;
        else{
          var vals = line.split(',');
          const counselor = {
            first: vals[0],
            last: vals[1],
            gender: vals[2],
            type:  vals[3],
            sessions: [session]
          }
          for(let type of types){
            if(type.type == vals[3]){
              counselor.type = type
              break;
            }
          }
          counselors.push(counselor);
        }
      }
    }
    myReader.readAsText(file);
    this.uploaded_counselors = counselors;
}

  onBulkUploadSubmit(){
    this.campsService.bulkRegisterCounselor(this.uploaded_counselors).subscribe(data => {
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
          this.getAllCounselors();
        }
      }
    });
  }

  getAllCounselors(){
    this.campsService.getAllCounselors().subscribe(data => {
      if(this.authService.isUser()){
        this.divisions = Object.keys(data.counselors);
        this.counselors = data.counselors;
      }
      if(this.authService.admin()){
        this.sessions = data.output.sessions;
        console.log(data.output);
        if(data.output.sessions[0]._id.session_id!=data.output.cur_session._id){
          const session = {
            "_id": {
              "session_id":data.output.cur_session._id,
              "session_name":data.output.cur_session.name
            },
            "counselors":[]
          }
          this.sessions.unshift(session);
        }
        else{
        this.hired = data.output.sessions[0].counselors;

        for(var i = 1; i < this.sessions.length; i++){
          for(let counselor of this.sessions[i].counselors){
            for(let h of this.hired)
              if(h._id == counselor._id)
                counselor.hired = true;
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

  remove(counselor){
    this.campsService.removeCounselor(counselor).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.getAllCounselors();
      }
    });
  }

  addDivision(counselor){
    this.campsService.addDivisionToCounselor(counselor).subscribe(data => {
      this.getAllCounselors();
    });
  }

  preAdd(e,counselor){
    counselor.toAdd = e;
  }

  addSpecialty(counselor){
    this.campsService.addSpecialtyToCounselor(counselor).subscribe(data => {
      this.getAllCounselors();
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

  rehire(c){
    const counselor = {
      "counselor": c,
      "session":{
        "_id":this.sessions[0]._id.session_id,
        "name":this.sessions[0]._id.session_name
      }
    }
    this.campsService.rehire(counselor).subscribe(data => {
      this.getAllCounselors();
    });
  }
  populateDivisions(){
    this.campsService.getAllDivisions().subscribe(data=>{
      this.dropdownDivisions = data;
      // if(this._gender=="female")
      //   this.divisions = data.divisions[0].divisions;
      // else if(this._gender=="male")
      //   this.divisions = data.divisions[1].divisions;
      
      // this.selectedChanged.emit(this.divisions[0]);
    });
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
    this.getAllCounselors();
    this.getOptions();
  }

}

