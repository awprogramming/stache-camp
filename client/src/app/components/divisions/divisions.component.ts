import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-divisions',
  templateUrl: './divisions.component.html',
  styleUrls: ['./divisions.component.css']
})
export class DivisionsComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  form: FormGroup;
  previousUrl;
  newCamp = false;
  divisions;

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
      name: ['', Validators.required]
    });
  }

  onRegistrationSubmit() {
    this.processing = true;
    const division = {
      name: this.form.get('name').value
    }
  
    this.campsService.registerDivision(division).subscribe(data => {
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
            this.getAllDivisions();
          }
        }, 2000);
      }
    });
  }
  getAllDivisions(){
    this.campsService.getAllDivisions().subscribe(data => {
      this.divisions = data.divisions;
    })
  }

  remove(division){
    this.campsService.removeDivision(division).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.getAllDivisions();
      }
    });
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
    this.getAllDivisions();
  }

}

