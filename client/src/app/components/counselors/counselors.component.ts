import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
      gender: ['', Validators.required],
      type: ['',Validators.required]
    });
    this.bulkAddForm = this.formBuilder.group({
      counselor_file:['']
    });
  }

  onRegistrationSubmit() {
    this.processing = true;
    const counselor = {
      first: this.form.get('first').value,
      last: this.form.get('last').value,
      gender: this.form.get('gender').value,
      type: this.form.get('type').value
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

  fileUploaded(event: any) {
    const file = event.srcElement.files[0];
    var myReader:FileReader = new FileReader();
    var counselors = [];
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
            type: vals[3]
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
      }
        this.counselors = data.counselors;
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

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.getAllCounselors();
  }

}

