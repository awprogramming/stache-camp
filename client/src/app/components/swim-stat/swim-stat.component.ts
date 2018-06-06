import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CampsService } from '../../services/camps.service';
import { AuthService } from '../../services/auth.service';
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
  loading;
  camperGroup;

  constructor(
    private route: ActivatedRoute,
    private campsService: CampsService,
    private authService: AuthService,
    private swimService: SwimService,
    private router: Router,
  ) {}

  loadStat(){
    this.loading = true;
    this.campsService.getCamper(this.id).subscribe(data => {
      this.camper = data.camper;
      this.loading = false;
      this.getCamperGroup();
    });
  }

  getCamperGroup(){
    this.swimService.getCamperGroup(this.camper._id).subscribe(data => {
      this.camperGroup = data.group;
    });
  }

  goToReport(level){
    if(level==-1){
     level = {
       rcLevel:-1
     };
    }
    if(this.camperGroup){
    var camp = JSON.parse(localStorage.getItem('user')).camp_id;
    this.router.navigate(['/swim-report/'+camp+"/"+this.camper._id+'/'+this.camperGroup._id+'/'+level.rcLevel]);
    }
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
    this.loading = true;
    this.swimService.levelComplete(this.id).subscribe(data=>{
      this.loadStat();
    });
  }

  preAddLevel(level){
    this.toAddLevel = level;
  }

  levelSet(){
    this.loading = true;
    this.swimService.setLevel(this.id,this.toAddLevel).subscribe(data=>{
      this.loadStat();
    });
  }

  changeBracelet(e){
    this.loading = true;
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

