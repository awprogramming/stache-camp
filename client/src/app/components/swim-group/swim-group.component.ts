import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { SwimService } from '../../services/swim.service';
import { CampsService } from '../../services/camps.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-swim-group',
  templateUrl: './swim-group.component.html',
  styleUrls: ['./swim-group.component.css']
})
export class SwimGroupComponent implements OnInit {
  id;
  counselorId;
  swimGroup;
  options;
  exclude = [];
  generating = false;
  reportCamper;
  date;
  toAddLifeguard;
  loading;
  newName;

  constructor(
    private route: ActivatedRoute,
    private swimService: SwimService,
    private campsService: CampsService,
    private authService: AuthService,
    private router: Router,
  ) {}

  

  loadSwimGroup(){
    this.loading = true;
    this.swimService.getSwimGroup(this.id).subscribe(data => {
      console.log(data);
      this.swimGroup = data.group;
      this.exclude = [];
      this.fillExclude();
    });
  }

  fillExclude(){
    this.swimService.inGroups().subscribe(data => {
      this.exclude = data.campers;
      this.loading = false;
    });
  }

  addToGroup(camper){
    this.loading = true;
    this.swimService.addToSwimGroup(this.id,camper._id).subscribe(data => {
      this.loadSwimGroup();
    });
  }
  addMultipleToGroup(ids){
    this.loading = true;
    this.swimService.addMultipleToSwimGroup(this.id,ids).subscribe(data => {
      this.loadSwimGroup();
    });
  }

  removeFromGroup(camper){
    this.loading = true;
    this.swimService.removeFromSwimGroup(this.id,camper._id).subscribe(data => {
      this.loadSwimGroup();
    });
  }

  goToStats(camper){
    this.router.navigate(['/swim-stat/'+camper._id]);
  }

  generateReports(){
    this.generating = true;
    for(let camper of this.swimGroup.campers){
      this.reportCamper = camper;
      break;
    }
  }
  getOptions(){
    this.loading = true;
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options
      this.loadSwimGroup();
    });
  }
  
  completedSkills(level){
    var skills = [];
    var count = 1;
    for(let animal of level.animals){
      for(let skill of animal.skills){
        skill.num = count;
        count++;
        if(skill.completed)
          skills.push(skill);
      }
    }
    for(let skill of level.exitSkills){
      skill.num = count;
      count++;
      if(skill.completed)
        skills.push(skill);
    }
    return skills;
  }

  generateSkillClass(level,skill){
    return "skill-"+level+"-"+skill.num;
  }
  
  displayDate(){
    var d = new Date();
    return this.displayDateHelper(d);
  }

  displayDateHelper(d){
    if(d){
      d = new Date(d);
      return d.getMonth()+1 + "/" + d.getDate() + "/" + d.getFullYear();
    }
    else
      return "Report not yet sent.";
  }

  preAssignLifeguard(lifeguard){
    this.toAddLifeguard = String(lifeguard._id);
  }

  assignLifeguard(){
    this.loading = true;
    this.swimService.assignLifeguard(this.id,this.toAddLifeguard).subscribe(data => {
      this.loadSwimGroup();
    });
  }

  removeLifeguard(){
    this.loading = true;
    this.swimService.removeLifeguard(this.id).subscribe(data => {
      this.loadSwimGroup();
    });
  }

  goToReport(camper){
    this.router.navigate(['/swim-report/'+camper._id+"/"+this.swimGroup._id+"/-1"]);
  }

  sendReports(){
    this.loading = true;
    this.swimService.sendReports(this.id).subscribe(data => {
      this.loadSwimGroup();
    });
  }

  sendReportChange(e,camper){
    var data = {
      camper:camper,
      sendReport:e.target.checked
    }
    this.swimService.changeSendReport(data).subscribe(data =>{
      this.loadSwimGroup();
    });
  }

  preChangeName(newName){
    this.newName = newName;
  }

  changeName(){
    this.swimService.changeGroupName(this.id,this.newName).subscribe(data => {
      this.loadSwimGroup();
    });
  }

  selectAll(e){
    var allInputs = document.getElementsByTagName("input");
    for (var i = 0, max = allInputs.length; i < max; i++){
        if (allInputs[i].type === 'checkbox')
            allInputs[i].checked = e.target.checked;
    }
  }

  ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.id = params.get('groupId');
        this.getOptions();
      });
  }

}

