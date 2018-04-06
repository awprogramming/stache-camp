import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { SportsService } from '../../services/sports.service';
import { CampsService } from '../../services/camps.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  id;
  game;
  roster;
  campers;
  coaches;
  refs;
  exclude = [];

  constructor(
    private route: ActivatedRoute,
    private sportsService: SportsService,
    private campsService: CampsService,
    private authService: AuthService,
    private router: Router,
  ) {}

  loadGame(){
    this.sportsService.getGame(this.id).subscribe(data => {
      this.game = data.game;
      this.campers = data.campers;
      this.coaches = data.coaches;
      this.refs = data.refs;
      this.exclude = [];
      for(let counselor of this.coaches)
        this.exclude.push(counselor);
      for(let counselor of this.refs)
        this.exclude.push(counselor);
    });
    
  }

  rosterSelected(e){
    this.roster = e;
  }

  addRoster(){
    this.sportsService.addRosterToGame(this.id,this.roster._id).subscribe(data => {
      this.loadGame();
    });
  }

  removeRoster(){
    this.sportsService.removeRosterFromGame(this.id).subscribe(data => {
      this.loadGame();
    });
  }

  getMonthName(month){
    var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return monthNames[month];
  }

  getDayName(day){
    var dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return dayNames[day];
  }

  displayDateTime(date){
    var d = new Date(date)
    var time = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    var day = this.getDayName(d.getDay());
    var month = this.getMonthName(d.getMonth());
    return time + " on " + day+ ", " + month + " " + d.getDate();

  }

  addCoachToGame(e){
    this.sportsService.addCoachToGame(this.id,e._id).subscribe(data => {
      this.loadGame();
    });
  }

  removeCoachFromGame(e){
    this.sportsService.removeCoachFromGame(this.id,e._id).subscribe(data => {
      this.loadGame();
    });
  }

  addRefToGame(e){
    this.sportsService.addRefToGame(this.id,e._id).subscribe(data => {
      this.loadGame();
    });
  }

  removeRefFromGame(e){
    this.sportsService.removeRefFromGame(this.id,e._id).subscribe(data => {
      this.loadGame();
    });
  }

  ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.id = params.get('id');
        this.loadGame();
      });
  }

}
