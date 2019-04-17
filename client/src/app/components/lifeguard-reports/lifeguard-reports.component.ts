import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { SwimService } from '../../services/swim.service';
import { CampsService } from '../../services/camps.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lifeguard-reports',
  templateUrl: './lifeguard-reports.component.html',
  styleUrls: ['./lifeguard-reports.component.css']
})
export class LifeguardReportsComponent implements OnInit {
  

  loading;
  lifeguardId;
  campers = [];


  constructor(
    private route: ActivatedRoute,
    private swimService: SwimService,
    private campsService: CampsService,
    private authService: AuthService,
    private router: Router,
  ) {}

  

  loadReports(lifeguard){
    this.loading = true;
    this.swimService.lifeguardReports(lifeguard._id).subscribe(data => {
      this.loading = false;
      console.log(data);
      this.campers = data.campers;
    });
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
  
  goToReport(camper){
    console.log(camper);
    this.router.navigate(['/swim-report/'+camper.camper_id+"/"+camper._id+"/-1"]);
  }

  ngOnInit() {}

}


