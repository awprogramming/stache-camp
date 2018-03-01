import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { EvaluationsService } from '../../services/evaluations.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-approvers',
  templateUrl: './approvers.component.html',
  styleUrls: ['./approvers.component.css']
})
export class ApproversComponent implements OnInit {
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
    private evaluationsService: EvaluationsService,
    private router: Router,
    private authGuard: AuthGuard
  ) { }

 
  getAllDivisions(){
    this.campsService.getAllDivisions().subscribe(data => {
      this.divisions = data.divisions;
      console.log(this.divisions);
    })
  }

  preAddHead(e,division){
    division.toAdd = e;
  }

  addHead(division){
    this.evaluationsService.addApproverToDivision(division).subscribe(data => {
      this.getAllDivisions();
    });
  }

  removeHead(division_id,leader_id){
    this.evaluationsService.removeApproverFromDivision(division_id,leader_id).subscribe(data =>{
      this.getAllDivisions();
    })
  }

  showAddButton(e,division){
    division.showAddButton = e;
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


