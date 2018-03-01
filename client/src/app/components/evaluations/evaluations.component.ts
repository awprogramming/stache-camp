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
  approver;

  constructor(
    private campsService: CampsService,
    private evaluationsService: EvaluationsService,
    public authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) {}

  getAllCurrent(){
    this.evaluationsService.getCurrentEvals().subscribe(data => {
      this.divisions = [];
      this.counselors = [];
      console.log(data.output);
      for(let counselor of data.output){
          if(this.approver){
            if(counselor._id.counselor.division && counselor._id.counselor.division.approvers){
              for(let leader of counselor._id.counselor.division.approvers){
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
          else if(JSON.parse(localStorage.getItem('user')).type.type == "Leader" && counselor._id.counselor.division){
            if(counselor._id.counselor.division){
              for(let leader of counselor._id.counselor.division.leaders){
                  
                if(leader._id == JSON.parse(localStorage.getItem('user'))._id){
                    console.log('hello world');
                    if(this.divisions.indexOf(counselor._id.counselor.division.name)==-1)  
                      this.divisions.push(counselor._id.counselor.division.name);
                    const c = {
                      evals:counselor.evaluations,
                      _id:counselor._id.counselor._id,
                      first: counselor._id.counselor.first,
                      last: counselor._id.counselor.last,
                    }
                    console.log(counselor._id.counselor.division.name)
                    if(this.counselors[counselor._id.counselor.division.name])
                      this.counselors[counselor._id.counselor.division.name].push(c);
                    else
                      this.counselors[counselor._id.counselor.division.name] = [c]
                    break;
                  }
              }
            }
            console.log(this.counselors);
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

      for(var type in this.counselors){
        for(let counselor of this.counselors[type]){
          for(let evaluation of counselor.evals){
            const sub_evals = []
            for(let answer of evaluation.answers){
              if(sub_evals[answer.question.byWho.type])
                sub_evals[answer.question.byWho.type].push(answer);
              else
              sub_evals[answer.question.byWho.type] = [answer];
            }
            evaluation.sub_evals = []
            for(let key of Object.keys(sub_evals).sort()){
              evaluation.sub_evals[key] = sub_evals[key];
            }
          }
        }
      }
    });
  }

  getOptions(){
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options;
      this.perSession = Array.from(Array(data.options.evaluationOpts.perSession).keys());
    });
  }

  userIsApprover(){
    this.evaluationsService.isApprover().subscribe(data => {
      console.log(data);
      this.approver = data.approver;
    });
  }

  getClass(evaluation){
    if(evaluation.approved)
      return "green";
    else if(evaluation.submitted)
      return "yellow";
    else if(evaluation.started)
      return "red";
    else
      return "";
  }

  splitSubs(evaluation){
    const sub_evals = []
    for(let answer of evaluation.answers){
      if(sub_evals[answer.question.byWho.type])
        sub_evals[answer.question.byWho.type].push(answer);
      else
      sub_evals[answer.question.byWho.type] = [answer];
    }
    evaluation.sub_evals = sub_evals;
  }

  getSubKeys(evaluation){
    return Object.keys(evaluation.sub_evals);
    
  }

  getScore(answers){
   var total = 0;
    for(let answer of answers){
      total+=answer.numerical
    }
    return Math.round(total/(answers.length*this.options.evaluationOpts.high)*100);
  }

  getLevel(score){
      if(score >= this.options.evaluationOpts.gold){
        return "Gold";
      }
      else if(score >= this.options.evaluationOpts.silver){
        return "Silver";
      }
      else if(score >= this.options.evaluationOpts.green){
        return "Green";
      }
      else{
        return "Red";
      }
  }


  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.userIsApprover();
    this.getAllCurrent();
    this.getOptions();
    
  }

}

