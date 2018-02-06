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
  previousUrl;
  newCamp = false;
  counselors;
  divisions;

  constructor(
    private formBuilder: FormBuilder,
    private campsService: CampsService,
    private authService: AuthService,
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
  }

  onRegistrationSubmit() {
    this.processing = true;
    const counselor = {
      first: this.form.get('first').value,
      last: this.form.get('last').value,
      gender: this.form.get('gender').value
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

  showAdd() {
    this.newCamp = true;
  }

  cancelAdd() {
    this.newCamp = false;
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

