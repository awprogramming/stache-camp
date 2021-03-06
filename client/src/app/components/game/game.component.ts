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
  loading;
  division;
  dropdownDivisions;
  schedDivisions;
  preSchedDivision;

  constructor(
    private route: ActivatedRoute,
    private sportsService: SportsService,
    private campsService: CampsService,
    private authService: AuthService,
    private router: Router,
  ) {}

  loadGame(){
    this.loading = true;
    this.sportsService.getGame(this.id).subscribe(data => {
      console.log(data);
      this.game = data.game;
      this.campers = []//data.campers;
      this.coaches = []//data.coaches;
      this.refs = []//data.refs;
      this.exclude = [];
      for(let counselor of this.game.coaches)
        this.exclude.push(counselor);
      for(let counselor of this.game.refs)
        this.exclude.push(counselor);

      this.loading = false;
    });
    
  }

  rosterSelected(e){
    this.roster = e;
  }

  addRoster(){
    this.loading = true;
    this.sportsService.addRosterToGame(this.id,this.roster._id).subscribe(data => {
      this.loadGame();
    });
  }

  removeRoster(){
    this.loading = true;
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
    this.loading = true;
    this.sportsService.addCoachToGame(this.id,e._id).subscribe(data => {
      this.loadGame();
    });
  }

  removeCoachFromGame(e){
    this.loading = true;
    this.sportsService.removeCoachFromGame(this.id,e._id).subscribe(data => {
      this.loadGame();
    });
  }

  addRefToGame(e){
    this.loading = true;
    this.sportsService.addRefToGame(this.id,e._id).subscribe(data => {
      this.loadGame();
    });
  }

  removeRefFromGame(e){
    this.loading = true;
    this.sportsService.removeRefFromGame(this.id,e._id).subscribe(data => {
      this.loadGame();
    });
  }

  populateDivisions(){
    this.loading = true;
    this.campsService.getAllDivisions().subscribe(data=>{
      this.dropdownDivisions = []
      for(let gender of data.divisions)
        this.dropdownDivisions[gender._id.gender] = gender.divisions;
      this.schedDivisions = this.divGenders("male");
      this.loading = false;
    });
  }

  divGenders(gender){
    console.log(this.dropdownDivisions.divisions)
    if(gender.toLowerCase()=="female"){
      return this.dropdownDivisions["female"];
    }
    else if(gender.toLowerCase()=="male")
      return this.dropdownDivisions["male"];
    else
      return [];
  }
  schedGenderChange(e){
    this.schedDivisions = this.divGenders(e);
  }
  schedDivisionChange(e){
    this.preSchedDivision = e._id;
  }

  changeDivision(){
    this.sportsService.changeGameDivision(this.id,this.preSchedDivision).subscribe(data => {
      this.loadGame();
    });
  }

  ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.id = params.get('id');
        this.loadGame();
        this.populateDivisions();
      });
  }

}

