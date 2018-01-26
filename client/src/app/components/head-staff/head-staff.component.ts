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
  heads;
  newHead;

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
        this.getAllHeads();
        this.newHead = false;
      }
    });
  }

  getAllHeads(){
    this.campsService.getAllHeads().subscribe(data => {
      this.heads = data.heads;
      console.log(this.heads);
    })
  }

  remove(head){
    this.campsService.removeHead(head).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.getAllHeads();
      }
    });
  }

  showAdd(){
    this.newHead = true;
  }

  addDivision(head){
    this.campsService.addDivisionToHead(head).subscribe(data => {
      this.getAllHeads();
    });
  }

  /* Add Division to head staff member */

  preAdd(e,head){
    head.toAdd = e;
  }

  /******/

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.getAllHeads();
  }

}