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

  constructor(
    private route: ActivatedRoute,
    private campsService: CampsService,
    private swimService: SwimService,
    private router: Router,
  ) {}

  loadStat(){
    this.campsService.getCamper(this.id).subscribe(data => {
      this.camper = data.camper;
      console.log(this.camper);
    });
  }

  checkSkill(e,animal_id,skill_id){
    this.swimService.checkSkill(this.id,animal_id,skill_id,e.target.checked).subscribe(data=>{
      console.log("done");
    });
  }

  levelComplete(){
    this.swimService.levelComplete(this.id).subscribe(data=>{
      console.log("done");
    });
  }
  
  ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.id = params.get('camperId');
        this.loadStat();
      });
  }

}

