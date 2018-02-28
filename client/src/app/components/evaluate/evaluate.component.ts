import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { EvaluationsService } from '../../services/evaluations.service';
import { CampsService } from '../../services/camps.service';

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
  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private evaluationsService: EvaluationsService,
    private campsService: CampsService,
    private router: Router,
  ) {}

  loadEvaluation(){
    this.evaluationsService.getEvaluation(this.counselorId,this.id).subscribe(data => {
      this.evaluation = data.evaluation;
      this.calculate_percentage();
    });
  }

  getOptions(){
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options
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

  ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.id = params.get('evaluationId');
        this.counselorId = params.get('counselorId');
        this.getOptions();
        this.loadEvaluation();
        
      });
  }

}

