import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  options;
  messageClass;
  message;
  previousUrl;
  form;
  newTypeForm;
  newType = false;

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
      session_name: ['', Validators.required],
    });
    this.newTypeForm = this.formBuilder.group({
      type: ['', Validators.required],
    });
  }

  onFormSubmit() {
    const session = {
      name: this.form.get('session_name').value
    }
   this.campsService.changeSession(session).subscribe(data => {
      this.getOptions();
    });

  }

  onNewTypeSubmit() {
    const type = {
      type: this.newTypeForm.get('type').value
    }
   this.campsService.addType(type).subscribe(data => {
      this.getOptions();
    });

  }

  showAdd(){
    this.newType = true;
  }

  cancelAdd(){
    this.newType = false;
  }

  removeType(type){
    this.campsService.removeType(type).subscribe(data => {
        this.getOptions();

    });
  }

  getOptions(){
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options
      console.log(this.options);
    });
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.getOptions();
  }

}

