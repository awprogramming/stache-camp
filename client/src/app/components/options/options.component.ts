import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';
import { EvaluationsService } from '../../services/evaluations.service';
import { SwimService } from '../../services/swim.service';

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
  newhTypeForm;
  perSessionForm;
  newType = false;
  newhType = false;
  loading;

  constructor(
    private formBuilder: FormBuilder,
    public campsService: CampsService,
    public authService: AuthService,
    private evaluationsService: EvaluationsService,
    private swimService: SwimService,
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
    this.newhTypeForm = this.formBuilder.group({
      htype: ['', Validators.required],
    });
    this.perSessionForm = this.formBuilder.group({
      per_session: ['', Validators.required],
    });
  }
  

  onFormSubmit() {
    this.loading = true;
    const session = {
      name: this.form.get('session_name').value
    }
   this.campsService.changeSession(session).subscribe(data => {
      this.getOptions();
    });

  }

  increasePeriod(){
    this.loading = true;
    const newPeriod = {
      period: this.options.evaluationOpts.currentEval+1
    }
    this.changePeriod(newPeriod);
  }

  decreasePeriod(){
    this.loading = true;
    const newPeriod = {
      period: this.options.evaluationOpts.currentEval-1
    }
    this.changePeriod(newPeriod);
  }
  
  changePeriod(newPeriod){
    this.evaluationsService.changePeriod(newPeriod).subscribe(data => {
      this.getOptions();
    });
  }

  onNewTypeSubmit() {
    this.loading = true;
    const type = {
      type: this.newTypeForm.get('type').value
    }
   this.campsService.addType(type).subscribe(data => {
      this.getOptions();
    });
  }

  onNewhTypeSubmit() {
    this.loading = true;
    const htype = {
      type: this.newhTypeForm.get('htype').value
    }
   this.campsService.addhType(htype).subscribe(data => {
      this.getOptions();
    });
  }

  onPerSessionSubmit(){
    this.loading = true;
    const perSession = {
      perSession: this.perSessionForm.get('per_session').value
    }
    this.evaluationsService.changePerSession(perSession).subscribe(data => {
      this.getOptions();
    });
  }

  showAdd(){
    this.newType = true;
  }

  cancelAdd(){
    this.newType = false;
  }

  showhAdd(){
    this.newhType = true;
  }

  cancelhAdd(){
    this.newhType = false;
  }

  removeType(type){
    this.loading = true;
    this.campsService.removeType(type).subscribe(data => {
        this.getOptions();

    });
  }

  removehType(type){
    this.loading = true;
    this.campsService.removehType(type).subscribe(data => {
        this.getOptions();
    });
  }

  changeAGMax(e){
    this.loading = true;
    if(e.target.value >= 1){
      this.swimService.changeAGMax(e.target.value).subscribe(data => {
        this.getOptions();
      });
    }
  }

  changeGold(e){
    this.loading = true;
    if(e.target.value >= 1){
      this.evaluationsService.changeGold(e.target.value).subscribe(data => {
        this.getOptions();
      });
    }
  }

  changeSilver(e){
    this.loading = true;
    if(e.target.value >= 1){
      this.evaluationsService.changeSilver(e.target.value).subscribe(data => {
        this.getOptions();
      });
    }
  }

  changeGreen(e){
    this.loading = true;
    if(e.target.value >= 1){
      this.evaluationsService.changeGreen(e.target.value).subscribe(data => {
        this.getOptions();
      });
    }
  }

  getHWS(){
    return Object.keys(this.options.howWeSay);
  }

  getHWSValue(term){
    return this.options.howWeSay[term];
  }

  changeHWS(e,term){
    this.campsService.changeHWS(term,e.target.value).subscribe(data => {
      console.log(term,e.target.value);
      this.getOptions();
    });
  }

  getOptions(){
    this.loading = true;
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options
      this.loading = false;
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

