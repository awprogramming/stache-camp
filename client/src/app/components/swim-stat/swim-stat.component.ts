import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CampsService } from '../../services/camps.service';
import { SwimService } from '../../services/swim.service';

@Component({
  selector: 'app-swim-stat',
  templateUrl: './swim-stat.component.html',
  styleUrls: ['./swim-stat.component.css']
})
export class SwimStatComponent implements OnInit {
  id;
  camper;
  toAddLevel;

  constructor(
    private route: ActivatedRoute,
    private campsService: CampsService,
    private swimService: SwimService,
    private router: Router,
  ) {}

  loadStat(){
    this.campsService.getCamper(this.id).subscribe(data => {
      this.camper = data.camper;
    });
  }

  checkSkill(e,animal_id,skill_id){
    this.swimService.checkSkill(this.id,animal_id,skill_id,e.target.checked).subscribe(data=>{
    });
  }

  checkExitSkill(e,skill_id){
    this.swimService.checkExitSkill(this.id,skill_id,e.target.checked).subscribe(data=>{
    });
  }

  levelComplete(){
    this.swimService.levelComplete(this.id).subscribe(data=>{
      this.loadStat();
    });
  }

  preAddLevel(level){
    this.toAddLevel = level;
  }

  levelSet(){
    this.swimService.setLevel(this.id,this.toAddLevel).subscribe(data=>{
      this.loadStat();
    });
  }

  changeBracelet(e){
    this.swimService.setBracelet(this.id,e.target.value).subscribe(data=>{
      this.loadStat();
    });
  }

  ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.id = params.get('camperId');
        this.loadStat();
      });
  }

}

