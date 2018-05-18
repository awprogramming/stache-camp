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
  heads;

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
      name: ['', Validators.required],
      // grade: ['', Validators.required],
    });
  }

  onRegistrationSubmit() {
    this.processing = true;
    const division = {
      name: this.form.get('name').value,
      // grade: this.form.get('grade').value
    }
  
    this.campsService.registerDivision(division).subscribe(data => {
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
            this.form.reset();
            this.getAllDivisions();
          }
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

  preAddHead(e,division){
    division.toAdd = e;
  }

  addHead(division){
    this.campsService.addHeadToDivision(division).subscribe(data => {
      this.getAllDivisions();
    });
  }

  removeHead(division_id,leader_id){
    this.campsService.removeHeadFromDivision(division_id,leader_id).subscribe(data =>{
      this.getAllDivisions();
    })
  }

  getHeads(){
    this.campsService.getAllHeads().subscribe(data=>{
      this.heads = data.heads;
      this.getAllDivisions();
    });
  }

  showAddButton(e,division){
    division.showAddButton = e;
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
    this.getHeads();
    
  }

}

