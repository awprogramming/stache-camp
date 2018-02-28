import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';
import { EvaluationsService } from '../../services/evaluations.service';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.css']
})
export class EvaluationsComponent implements OnInit {
  messageClass;
  message;
  previousUrl;
  counselors;
  options;
  divisions;
  perSession;

  constructor(
    private campsService: CampsService,
    private evaluationsService: EvaluationsService,
    public authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) {}
  

  getAllCounselors(){
    // this.campsService.getAllCounselors().subscribe(data => {
    //   if(this.authService.isUser()){
    //     this.divisions = Object.keys(data.counselors);
    //     this.counselors = data.counselors;
    //   }
    // });
  }

  getAllCurrent(){
    this.evaluationsService.getCurrentEvals().subscribe(data => {
      this.divisions = [];
      this.counselors = [];
      for(let counselor of data.output){
          if(JSON.parse(localStorage.getItem('user')).type.type == "Leader" && counselor._id.counselor.division){
            if(counselor._id.counselor.division){
              for(let leader of counselor._id.counselor.division.leaders){
                if(leader._id == JSON.parse(localStorage.getItem('user'))._id){
                    if(this.divisions.indexOf(counselor._id.counselor.division.name)==-1)  
                      this.divisions.push(counselor._id.counselor.division.name);
                    const c = {
                      evals:counselor.evaluations,
                      _id:counselor._id.counselor._id,
                      first: counselor._id.counselor.first,
                      last: counselor._id.counselor.last,
                    }
                    if(this.counselors[counselor._id.counselor.division.name])
                      
                      this.counselors[counselor._id.counselor.division.name].push(c);
                    else
                      this.counselors[counselor._id.counselor.division.name] = [c]
                    break;
                  }
              }
            }
          }
          else{
            if(counselor._id.counselor.specialty){
              for(let leader of counselor._id.counselor.specialty.head_specialists){
                if(leader._id == JSON.parse(localStorage.getItem('user'))._id){
                    if(this.divisions.indexOf(counselor._id.counselor.specialty.name)==-1)  
                      this.divisions.push(counselor._id.counselor.specialty.name);
                    const c = {
                      evals:counselor.evaluations,
                      _id:counselor._id.counselor._id,
                      first: counselor._id.counselor.first,
                      last: counselor._id.counselor.last,
                    }
                    if(this.counselors[counselor._id.counselor.specialty.name])
                      this.counselors[counselor._id.counselor.specialty.name].push(c);
                    else
                      this.counselors[counselor._id.counselor.specialty.name] = [c]
                    break;
                  }
              }
            }
          }
      }
      console.log(this.counselors);
    });
  }

  getOptions(){
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options;
      this.perSession = Array.from(Array(data.options.evaluationOpts.perSession).keys());
    });
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.getAllCurrent();
    this.getOptions();
  }

}

