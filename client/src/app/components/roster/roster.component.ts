import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { SportsService } from '../../services/sports.service';
import { CampsService } from '../../services/camps.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.css']
})
export class RosterComponent implements OnInit {
  id;
  sd_id;
  viewing;
  roster;
  options;
  internal;
  exclude = [];

  constructor(
    private route: ActivatedRoute,
    private sportsService: SportsService,
    private campsService: CampsService,
    private authService: AuthService,
    private router: Router,
  ) {}

  loadRoster(){
    if(this.internal == "true"){
      this.sportsService.getInternalRoster(this.sd_id,this.id).subscribe(data => {   
        this.roster = data.roster;
        this.exclude = this.roster.campers;   
      });
    }
    else{
      this.sportsService.getRoster(this.sd_id,this.id).subscribe(data => {   
        this.roster = data.roster;
        this.exclude = this.roster.campers;   
      });
    }
  }

  addToRoster(e){
    this.exclude.push(e);
    const ids = {
      c_id:e._id,
      r_id:this.id,
      sd_id:this.sd_id
    };
    if(this.internal=="true"){
      this.sportsService.addCamperToInternalRoster(ids).subscribe(data => {   
        this.loadRoster();
      });
    }
    else{
      this.sportsService.addCamperToRoster(ids).subscribe(data => {   
        this.loadRoster();
      });
    }
  }

  removeFromRoster(c_id){
    for(var i = 0; i < this.exclude.length; i++){
      if(this.exclude[i]._id == c_id){
        this.exclude.splice(i,1);
        break;
      }
    }
    const ids = {
      c_id:c_id,
      r_id:this.id,
      sd_id:this.sd_id
    }
    if(this.internal=="true"){
      this.sportsService.removeCamperFromInternalRoster(ids).subscribe(data => {   
        this.loadRoster();
      });
    }
    else{
      this.sportsService.removeCamperFromRoster(ids).subscribe(data => {   
        this.loadRoster();
      });
    }
  }

  getType(){
    return JSON.parse(localStorage.getItem('user')).type.type;
  }

  isViewing(){
    this.viewing = (this.getType() != "Head Specialist") && (this.internal != "true");
  }

  ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.id = params.get('rosterId');
        this.sd_id = params.get('sdId');
        this.internal = params.get('internal');
        this.isViewing();
        this.loadRoster();
      });
  }

}

