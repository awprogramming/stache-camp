import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModuleService } from '../../services/module.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  form: FormGroup;
  previousUrl;
  newModule = false;
  modules;

  constructor(
    private formBuilder: FormBuilder,
    private moduleService: ModuleService,
    private router: Router,
    private authGuard: AuthGuard
  ) { 
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      formal: ['', Validators.required],
      short_name:['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onRegistrationSubmit() {
    this.processing = true;
    const mod = {
      formal: this.form.get('formal').value,
      short_name: this.form.get('short_name').value,
      description: this.form.get('description').value,
    }
  
    this.moduleService.registerModule(mod).subscribe(data => {
    
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
            this.newModule = false;
            this.getAllModules();
          }
        }, 2000);
      }
    });
  }

  remove(mod){
    this.moduleService.removeModule(mod).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.getAllModules();
      }
    });
  }

  showAdd() {
    this.newModule = true;
  }

  cancelAdd() {
    this.newModule = false;
  }

  getAllModules(){
    this.moduleService.getAllModules().subscribe(data => {
      this.modules = data.modules;
    })
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.getAllModules();
  }

}
