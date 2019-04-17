import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { SportsService } from '../../services/sports.service';
import { EventsService } from '../../services/events.service';
import { CampsService } from '../../services/camps.service';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  id;
  event;
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
  edit = false;
  gameForm: FormGroup;
  tripForm: FormGroup;
  fullCampForm: FormGroup;
  selectedDate;
  selectedTime;
  tbd;

  constructor(
    private route: ActivatedRoute,
    private sportsService: SportsService,
    private eventsService: EventsService,
    private campsService: CampsService,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    
  ) {
    this.createForms();
   }

  createForms() {
    this.gameForm = this.formBuilder.group({
      location: ['', Validators.required],
      opponent: ['', Validators.required],
      name: ['',Validators.required],
      needsLunch: ['',Validators.required],
      notes: ['',Validators.required]
    });

    this.tripForm = this.formBuilder.group({
      name: ['',Validators.required],
      location: ['', Validators.required],
      notes: ['',Validators.required]
    });

    this.fullCampForm = this.formBuilder.group({
      name: ['',Validators.required],
      notes: ['',Validators.required]
    });
  }

  hours12(date) { return (date.getHours() + 24) % 12 || 12; }
  ampm(date) {return date.getHours()>=12?"PM":"AM"}

  loadEvent(){
    this.loading = true;
    this.eventsService.getEvent(this.id).subscribe(data => {
      this.event = data.event;
      
      var sDate = new Date(this.event.date);
      this.tbd = this.event.tbd;
      if(!this.tbd){
        this.selectedTime = {
          hour:this.hours12(sDate),
          minute:sDate.getMinutes(),
          ampm:this.ampm(sDate)
        }
      }
      else{
        this.selectedTime = {
          hour:12,
          minute:0,
          ampm:"PM"
        }
      }
      this.selectedDate = {
        date:{
          month:sDate.getMonth(),
          day: sDate.getDate(),
          year: sDate.getFullYear()
        },
        day:this.getDayName(sDate.getDay())
      }
      
      this.campers = []//data.campers;
      this.coaches = []//data.coaches;
      this.refs = []//data.refs;
      this.exclude = [];
      for(let counselor of this.event.coaches)
        this.exclude.push(counselor);
      for(let counselor of this.event.refs)
        this.exclude.push(counselor);

      
      if(!this.event.notes)
        this.event.notes = "";
      if(this.event.type=="game")
        this.gameForm.setValue({
          location: this.event.location,
          opponent: this.event.opponent,
          name: this.event.name,
          needsLunch: this.event.needsLunch,
          notes: this.event.notes
        });
      if(this.event.type=="trip")
        this.tripForm.setValue({
          location: this.event.location,
          name: this.event.name,
          notes: this.event.notes
        });

      if(this.event.type=="full-camp")
        this.fullCampForm.setValue({
          name: this.event.name,
          notes: this.event.notes
        });

      console.log("*");
      this.loading = false;
    });
    
  }

  rosterSelected(e){
    this.roster = e;
  }

  addRoster(){
    this.loading = true;
    this.eventsService.addRosterToEvent(this.id,this.roster._id).subscribe(data => {
      console.log("hello world");
      this.loadEvent();
    });
  }

  removeRoster(){
    this.loading = true;
    this.eventsService.removeRosterFromEvent(this.id).subscribe(data => {
      this.loadEvent();
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

  displayDateTime(date,tbd){
    var d = new Date(date)
    if(!tbd)
      var time = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    else
      var time = "Time TBD";
    var day = this.getDayName(d.getDay());
    var month = this.getMonthName(d.getMonth());
    return time + " on " + day+ ", " + month + " " + d.getDate();

  }

  addCoachToEvent(e){
    this.loading = true;
    this.eventsService.addCoachToEvent(this.id,e._id).subscribe(data => {
      this.loadEvent();
    });
  }

  removeCoachFromEvent(e){
    this.loading = true;
    this.eventsService.removeCoachFromEvent(this.id,e._id).subscribe(data => {
      this.loadEvent();
    });
  }

  addRefToEvent(e){
    this.loading = true;
    this.eventsService.addRefToEvent(this.id,e._id).subscribe(data => {
      this.loadEvent();
    });
  }

  removeRefFromEvent(e){
    this.loading = true;
    this.eventsService.removeRefFromEvent(this.id,e._id).subscribe(data => {
      this.loadEvent();
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

  bg(gender){
    if(gender.toLowerCase()=="male")
      return "Boys";
    else
      return "Girls";
  }

  changeDivision(){
    this.eventsService.changeEventDivision(this.id,this.preSchedDivision).subscribe(data => {
      this.loadEvent();
    });
  }

  addDivision(){
    this.eventsService.addEventDivision(this.id,this.preSchedDivision.toString()).subscribe(data => {
      this.loadEvent();
    });
  }

  removeDivision(division){
    this.eventsService.removeEventDivision(this.id,division.toString()).subscribe(data => {
      this.loadEvent();
    });
  }

  editEvent(){
    console.log(this.fullCampForm);
    this.edit = true;
  }

  dateSelected(e){
    this.selectedDate = e;
  }
  timeSelected(e){
    this.selectedTime = e;
  }

  onEditSubmit() {
    this.loading = true;
    var hour = this.selectedTime.hour;
    if(!this.tbd){
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
    if(this.event.type=="game"){
      event = {
        _id:this.event._id.toString(),
        type:"game",
        name: this.gameForm.get('name').value,
        location: this.gameForm.get('location').value,
        opponent: this.gameForm.get('opponent').value,
        date: date,
        tbd:this.tbd,
        needsLunch: this.gameForm.get('needsLunch').value,
        notes: this.gameForm.get('notes').value,
      }
    }
    else if(this.event.type=="trip"){
      event = {
        _id:this.event._id.toString(),
        type:"trip",
        name: this.tripForm.get('name').value,
        location: this.tripForm.get('location').value,
        date: date,
        tbd:this.tbd,
        notes: this.tripForm.get('notes').value,
      }
    }
    else{
      event = {
        _id:this.event._id.toString(),
        type:"full-camp",
        name: this.fullCampForm.get('name').value,
        date: date,
        tbd:this.tbd,
        notes: this.fullCampForm.get('notes').value,
      }
    }

    this.eventsService.editEvent(event).subscribe((data)=>{
      this.edit = false;
      console.log("1");
      this.loadEvent();

    });

  }

  ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.id = params.get('id');
        this.loadEvent();
        this.populateDivisions();
      });
  }

}

