import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-head-staff',
  templateUrl: './head-staff.component.html',
  styleUrls: ['./head-staff.component.css']
})
export class HeadStaffComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  form: FormGroup;
  previousUrl;

  constructor(
    private formBuilder: FormBuilder,
    private campsService: CampsService,
    private router: Router,
    private authGuard: AuthGuard
  ) {
    this.createForm(); 
  }

  createForm() {
    this.form = this.formBuilder.group({
      username:['', Validators.required],
      email: ['', Validators.required], 
      password: ['',Validators.required]
    });
  }

  
  onRegistrationSubmit() {
    this.processing = true; 
    const headStaff = {
      username: this.form.get('username').value, 
      email: this.form.get('email').value, 
      password: this.form.get('password').value
    }

    this.campsService.registerHeadStaff(headStaff).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; 
        this.message = data.message; 
        this.processing = false; 
      } else {
        this.messageClass = 'alert alert-success'; 
        this.message = data.message; 
      }
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