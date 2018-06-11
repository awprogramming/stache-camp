import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SportsService } from '../../services/sports.service';
import { CampsService } from '../../services/camps.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-game-calendar',
  templateUrl: './game-calendar.component.html',
  styleUrls: ['./game-calendar.component.css']
})
export class GameCalendarComponent implements OnInit {

  selectedDate;
  selectedTime;
  selectedSpecialty;
  games = [];
  scheduler = false;
  form: FormGroup;
  monthView;
  specialties;
  loading;
  divisionShowing = -1;
  genderShowing = "all";
  dropdownDivisions;
  dropdownDivisionsShowing;
  schedGender;
  schedDivisions;
  preSchedDivision;




  constructor(
    private formBuilder: FormBuilder,
    private sportsService: SportsService,
    private campsService: CampsService,
    private authService: AuthService
  ) {
    this.createForm();
   }

  createForm() {
    this.form = this.formBuilder.group({
      location: ['', Validators.required],
      opponent: ['', Validators.required],
      name: ['',Validators.required],
      needsLunch: ['',Validators.required],
    });
  }

  onScheduleSubmit() {
    this.loading = true;
    var hour = this.selectedTime.hour;
    if(this.selectedTime.ampm == "AM" && this.selectedTime.hour == "12"){
      hour = "0";
    }
    if(this.selectedTime.ampm == "PM" && this.selectedTime.hour != "12"){
      hour = String(parseInt(this.selectedTime.hour)+12);
    }
    var date = new Date(this.selectedDate.date.year,this.selectedDate.date.month,this.selectedDate.date.day,hour,this.selectedTime.minute);
    const game = {
      name: this.form.get('name').value,
      location: this.form.get('location').value,
      opponent: this.form.get('opponent').value,
      date: date,
      specialty: this.selectedSpecialty,
      needsLunch: this.form.get('needsLunch').value,
      divisionId: this.preSchedDivision
    }

    this.sportsService.scheduleGame(game).subscribe((data)=>{
      this.scheduler = false;
      this.getGames(this.monthView);
    });

  }

  dateSelected(e){
    this.selectedDate = e;
    this.scheduler = false;
  }
  timeSelected(e){
    this.selectedTime = e;
  }

  specialtySelected(e){
    this.selectedSpecialty = e;
  }

  getGames(e){
    this.loading = true;
    this.monthView = e;
    if(this.divisionShowing == -1){
      var type;
      if(this.authService.admin())
        type = "admin";
      else
        type = this.authService.userType();
      this.sportsService.getMonthGames(e,type).subscribe((data)=>{
        this.games = data.games;
        this.loading = false;
      });
    }
    else{
      this.getDivisionGames();
    }
  }

  getDivisionGames(){

    this.loading = true;
    this.sportsService.getDivisionMonthGames(this.monthView,this.divisionShowing).subscribe((data)=>{
      this.games = data.games;
      this.loading = false;
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

  getSpecialties(){
    this.loading = true;
    this.campsService.getAllSpecialties().subscribe(data=>{
      this.specialties = data.specialties;
      this.loading = false;
    });
  }

  displayTime(date){
    return new Date(date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  filterDivision(e){
    if(this.genderShowing != "all"){
      this.divisionShowing = e;
      this.filter();
    }
  }
  filterGender(e){
    this.genderShowing = e;
    this.dropdownDivisionsShowing = this.divGenders(e);
    this.divisionShowing = this.dropdownDivisionsShowing[0];

    this.filter();
  }

  filter(){
      if(this.genderShowing == "all"){
        this.divisionShowing = -1;
        this.getGames(this.monthView);
      }
      else{
        this.getDivisionGames();
      }
  }

  divGenders(gender){
    if(gender.toLowerCase()=="female"){
      return this.dropdownDivisions.divisions[0].divisions;
    }
    else if(gender.toLowerCase()=="male")
      return this.dropdownDivisions.divisions[1].divisions;
    else
      return [];
  }
  schedGenderChange(e){
    this.schedDivisions = this.divGenders(e);
  }
  schedDivisionChange(e){
    this.preSchedDivision = e._id;
  }

  removeGame(game){
    this.sportsService.removeGame(game._id).subscribe((data)=>{
      this.getGames(this.monthView);
    });
  }

  logGame(game){
    console.log(game);
  }


  populateDivisions(){
    this.loading = true;
    this.campsService.getAllDivisions().subscribe(data=>{
      this.dropdownDivisions = data;
      this.schedDivisions = this.divGenders("male");
      this.loading = false;
    });
  }

  ngOnInit() {
    this.getSpecialties();
    this.populateDivisions();
  }

}
