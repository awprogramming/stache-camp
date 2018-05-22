import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EvaluationsService } from '../../services/evaluations.service';
import { CampsService } from '../../services/camps.service';

import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  form: FormGroup;
  previousUrl;
  newQuestion = false;
  types;
  toAddType;
  toAddhType;
  hsTypes;
  loading;

  constructor(
    private formBuilder: FormBuilder,
    private evaluationsService: EvaluationsService,
    private campsService: CampsService,
    private router: Router,
    private authGuard: AuthGuard
  ) { 
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      content: ['', Validators.required],
      type: ['',Validators.required],
      htype: ['',Validators.required]
    });
  }

  onRegistrationSubmit() {
    this.loading = true;
    this.processing = true;
    const question = {
      content: this.form.get('content').value,
      type: this.toAddType,
      byWho: this.toAddhType
    }
  
    this.evaluationsService.registerQuestion(question).subscribe(data => {
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
            this.newQuestion = false;
            this.getAllQuestions();
          }
      }
    });
  }

  getAllQuestions(){
    this.loading = true;
    this.evaluationsService.getAllQuestions().subscribe(data => {
      this.types = data.types;
      this.loading = false;
    })
  }

  preAddType(e,type){
    this.toAddType = e;
  }

  preAddhType(e,type){
    this.toAddhType = e;
  }

  remove(question){
    this.loading = true;
    this.evaluationsService.removeQuestion(question).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.getAllQuestions();
      }
    });
  }

  
  getTypes(){
    this.loading = true;
    this.campsService.getOptions().subscribe(data=>{
      this.hsTypes = data.options.headStaff_types;
      this.getAllQuestions();
    });
  }



  showAdd() {
    this.newQuestion = true;
  }

  cancelAdd() {
    this.newQuestion = false;
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.getTypes();
  }

}


