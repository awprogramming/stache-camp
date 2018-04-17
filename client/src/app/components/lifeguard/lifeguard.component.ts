import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lifeguard',
  templateUrl: './lifeguard.component.html',
  styleUrls: ['./lifeguard.component.css']
})
export class LifeguardComponent implements OnInit {
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
  sessions;
  hired;
  toAddType;
  options;

  constructor(
    private formBuilder: FormBuilder,
    private campsService: CampsService,
    public authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) { }

  getAllCounselors(){
    this.campsService.getAllLifeguards().subscribe(data => {
    });
  }

  getOptions(){
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options
    });
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.getAllCounselors();
    this.getOptions();
  }

}

