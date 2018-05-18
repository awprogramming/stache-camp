import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-specialties',
  templateUrl: './specialties.component.html',
  styleUrls: ['./specialties.component.css']
})
export class SpecialtiesComponent implements OnInit {
  
  messageClass;
  message;
  processing = false;
  form: FormGroup;
  previousUrl;
  newCamp = false;
  specialties;
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
      name: ['', Validators.required]
    });
  }

  onRegistrationSubmit() {
    this.processing = true;
    const specialty = {
      name: this.form.get('name').value
    }
  
    this.campsService.registerSpecialty(specialty).subscribe(data => {
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
            this.getAllSpecialties();
          }
      }
    });
  }
  getAllSpecialties(){
    this.campsService.getAllSpecialties().subscribe(data => {
      this.specialties = data.specialties;
    })
  }

  remove(specialty){
    this.campsService.removeSpecialty(specialty).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.getAllSpecialties();
      }
    });
  }

  preAddHead(e,specialty){
    specialty.toAdd = e;
  }

  addHead(specialty){
    this.campsService.addHeadToSpecialty(specialty).subscribe(data => {
      this.getAllSpecialties();
    });
  }

  removeHead(specialty_id,leader_id){
    this.campsService.removeHeadFromSpecialty(specialty_id,leader_id).subscribe(data =>{
      this.getAllSpecialties();
    })
  }

  showAddButton(e,specialty){
    specialty.showAddButton = e;
  }

  showAdd() {
    this.newCamp = true;
  }

  cancelAdd() {
    this.newCamp = false;
  }

  getHeads(){
    this.campsService.getAllHeads().subscribe(data=>{
      this.heads = data.heads;
      this.getAllSpecialties();
    });
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

