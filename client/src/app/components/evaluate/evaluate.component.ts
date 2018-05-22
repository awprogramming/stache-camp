import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { EvaluationsService } from '../../services/evaluations.service';
import { CampsService } from '../../services/camps.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.css']
})
export class EvaluateComponent implements OnInit {
  id;
  counselorId;
  evaluation;
  options;
  percentage;
  level;
  saved = false;
  view;
  approver;
  private sub: any;
  type;

  constructor(
    private route: ActivatedRoute,
    private evaluationsService: EvaluationsService,
    private campsService: CampsService,
    private authService: AuthService,
    private router: Router,
  ) {}

  loadEvaluation(){
    this.evaluationsService.getEvaluation(this.counselorId,this.id,this.type).subscribe(data => {
      
      this.evaluation = data.evaluation;
      this.calculate_percentage();
      this.viewing();
      
    });
  }

  getOptions(){
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options
      this.loadEvaluation();
    });
  }

  slider_change(e,answer){
    answer.numerical = Number.parseInt(e.target.value);
    this.saved = false;
    this.calculate_percentage();
  }

  textarea_change(e,answer){
    answer.text = e.target.value;
    this.saved = false;
  }

  additional_change(e){
    this.evaluation.evaluation.additional_notes = e.target.value;
    this.saved = false;
  }

  calculate_percentage(){
    var total = 0;
    
    for(let answer of this.evaluation.evaluation.answers){
      total+=answer.numerical
    }
    this.percentage = Math.round(total/(this.evaluation.evaluation.answers.length*this.options.evaluationOpts.high)*100);
    this.calculate_level();
  }

  calculate_level(){
    if(this.percentage >= this.options.evaluationOpts.gold){
      this.level = "Gold";
    }
    else if(this.percentage >= this.options.evaluationOpts.silver){
      this.level = "Silver";
    }
    else if(this.percentage >= this.options.evaluationOpts.green){
      this.level = "Green";
    }
    else{
      this.level = "Red";
    }
  }

  save(){
    this.evaluation.evaluation.started = true;
    this.evaluation.evaluation.submitted = false;
    this.evaluation.evaluation.approved = false;
    this.evaluationsService.saveEval(this.evaluation).subscribe(data=>{
      this.saved = true;
    });
  }

  submit(){
    this.evaluation.evaluation.submitted = true;
    this.evaluation.evaluation.approved = false;
    this.evaluationsService.saveEval(this.evaluation).subscribe(data=>{
      this.router.navigate(['/evaluations']);
    });
  }

  approve(){
    this.evaluation.evaluation.approved = true;
    this.evaluationsService.saveEval(this.evaluation).subscribe(data=>{
      this.router.navigate(['/evaluations']);
    });
  }

  viewing(){
    this.view = this.options.evaluationOpts.currentEval!=this.evaluation.evaluation.number || this.authService.admin();
  }

  userIsApprover(){
    this.evaluationsService.isApprover().subscribe(data => {
      this.approver = data.approver;
    });
  }
  ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.id = params.get('evaluationId');
        this.counselorId = params.get('counselorId');
        this.type = params.get('type');
        this.userIsApprover();
        this.getOptions();
      });
  }

}

