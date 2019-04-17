import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SportsService } from '../../services/sports.service';
import { EventsService } from '../../services/events.service';
import { CampsService } from '../../services/camps.service';
import { AuthService } from '../../services/auth.service';
import { createOfflineCompileUrlResolver } from '@angular/compiler';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.css']
})
export class EventCalendarComponent implements OnInit {

  selectedDate;
  selectedTime;
  selectedSpecialty;
  events = [];
  scheduler = false;
  formType:String;
  form: FormGroup;
  gameForm: FormGroup;
  tripForm: FormGroup;
  fullCampForm: FormGroup;
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
  tbd = false;

  constructor(
    private formBuilder: FormBuilder,
    private eventsService: EventsService,
    private campsService: CampsService,
    private authService: AuthService
  ) {
    this.createForms();
   }

  createForms() {
    this.formType = "game";
    this.gameForm = this.formBuilder.group({
      location: ['', Validators.required],
      opponent: ['', Validators.required],
      name: ['',Validators.required],
      needsLunch: ['',Validators.required],
    });

    this.tripForm = this.formBuilder.group({
      name: ['',Validators.required],
      location: ['', Validators.required]
    });

    this.fullCampForm = this.formBuilder.group({
      name: ['',Validators.required],
    });
  }

  typeChange(type){
    this.formType = type;
  }

  onScheduleSubmit() {

    this.loading = true;
    if(!this.tbd){
      var hour = this.selectedTime.hour;
      if(this.selectedTime.ampm == "AM" && this.selectedTime.hour == "12"){
        hour = "0";
      }
      if(this.selectedTime.ampm == "PM" && this.selectedTime.hour != "12"){
        hour = String(parseInt(this.selectedTime.hour)+12);
      }
      var date = new Date(this.selectedDate.date.year,this.selectedDate.date.month,this.selectedDate.date.day,hour,this.selectedTime.minute);
    }
    else{
      var date = new Date(this.selectedDate.date.year,this.selectedDate.date.month,this.selectedDate.date.day);
    }
    var event;
    if(this.formType=="game"){
      event = {
        type:"game",
        name: this.gameForm.get('name').value,
        location: this.gameForm.get('location').value,
        opponent: this.gameForm.get('opponent').value,
        date: date,
        tbd:this.tbd,
        specialty_id: this.selectedSpecialty._id.toString(),
        needsLunch: this.gameForm.get('needsLunch').value,
        division_ids: [this.preSchedDivision]
      }
    }
    else if(this.formType=="trip"){
      event = {
        type:"trip",
        name: this.tripForm.get('name').value,
        location: this.tripForm.get('location').value,
        date: date,
        tbd:this.tbd,
        division_ids: [this.preSchedDivision]
      }
    }
    else{
      event = {
        type:"full-camp",
        name: this.fullCampForm.get('name').value,
        date: date,
        tbd:this.tbd,
      }
    }

    this.eventsService.scheduleEvent(event).subscribe((data)=>{
      this.scheduler = false;
      this.getEvents(this.monthView);
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

  getEvents(e){
    this.loading = true;
    this.monthView = e;
    if(this.divisionShowing == -1){
      var type;
      if(this.authService.admin())
        type = "admin";
      else
        type = this.authService.userType();
      this.eventsService.getMonthEvents(e,type).subscribe((data)=>{
        this.events = data.events;
        this.loading = false;
      });
    }
    else{
      this.getDivisionEvents();
    }
  }

  getDivisionEvents(){

    this.loading = true;
    this.eventsService.getDivisionMonthEvents(this.monthView,this.divisionShowing).subscribe((data)=>{
      this.events = data.events;
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
        this.getEvents(this.monthView);
      }
      else{
        this.getDivisionEvents();
      }
  }

  divGenders(gender){
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

  removeEvent(event){
    this.eventsService.removeEvent(event._id).subscribe((data)=>{
      this.getEvents(this.monthView);
    });
  }

  logEvent(event){
    console.log(event);
  }

  eventTypes(){
    return Object.keys(this.selectedDate.date.events);
  }

  niceType(type){
    if(type=="game")
      return "Games"
    if(type=="trip")
      return "Trips"
    if(type=="full-camp")
      return "Full Camp Events"
  }

  bg(gender){
    if(gender.toLowerCase()=="male")
      return "Boys";
    else
      return "Girls";
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

  

  ngOnInit() {
    this.getSpecialties();
    this.populateDivisions();
  }

}
