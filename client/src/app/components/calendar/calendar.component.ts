import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  @Output() selection = new EventEmitter();
  @Output() changeVisible = new EventEmitter();
  _events;
  @Input() 
    set events(events: Array<Object>){
        this._events = events;
        this.populateEvents();
    }
  today;
  selectedDate;
  visibleMonth;
  days;
  scheduler = false;
  monthStart;

  constructor() { }

  daysInMonth (month, year) { // Use 1 for January, 2 for February, etc.
    return new Date(year, month+1, 0).getDate();
  }

  generateDates(){
    var month = this.visibleMonth.month;
    var year = this.visibleMonth.year;
    var lastMonthYear = year;
    var lastMonth = month-1;
    if(lastMonth == 0){
      lastMonth = 11;
      lastMonthYear = year - 1;
    }
    var firstDate = year + '-' + (month+1) + '-01';
    var firstDay = new Date(year,month,1).getDay();
    this.monthStart = firstDay;
    var days = [];
    for(var i = firstDay-1; i >= 0; i--)
      days.push({month:lastMonth,day:this.daysInMonth(lastMonth,lastMonthYear)-i,year:lastMonthYear,cur:false});

    for(var i = 0; i < this.daysInMonth(month,year); i++)
      days.push({month:month,day:i+1,year:year,cur:true});
    var daysLeft = 42 - days.length;
    var nextMonth = month+1;
    var nextMonthYear = year;

    if(month == 12){
      nextMonth = 11;
      nextMonthYear = year+1;
    }

    for(var i = 0; i < daysLeft; i++){
      days.push({month:nextMonth,day:i+1,year:nextMonthYear,cur:false});
    }
    this.days = days;
  }

  // generateDates(){
  //   var month = this.visibleMonth.month;
  //   var year = this.visibleMonth.year;
  //   var lastMonthYear = year;
  //   var lastMonth = month-1;
  //   if(lastMonth == 0){
  //     lastMonth = 11;
  //     lastMonthYear = year - 1;
  //   }
  //   var stringMonth = month;
  //   stringMonth++;
  //   if(String(month).length==1){
  //     stringMonth = "0" + stringMonth;
  //   }

  //   var firstDate = year + '-' + (stringMonth) + '-01';
  //   console.log(firstDate);
  //   this.fd = firstDate;

    

  //   var firstDay = new Date(firstDate).getDay();
  //   this.monthStart = firstDay;
  //   var days = [];
  //   for(var i = firstDay-1; i >= 0; i--)
  //     days.push({month:lastMonth,day:this.daysInMonth(lastMonth,lastMonthYear)-i,year:lastMonthYear,cur:false});
  //   for(var i = 0; i < this.daysInMonth(month,year); i++)
  //     days.push({month:month,day:i+1,year:year,cur:true});
  //   var daysLeft = 42 - days.length;
  //   var nextMonth = month+1;
  //   var nextMonthYear = year;

  //   if(month == 12){
  //     nextMonth = 11;
  //     nextMonthYear = year+1;
  //   }

  //   for(var i = 0; i < daysLeft; i++){
  //     days.push({month:nextMonth,day:i+1,year:nextMonthYear,cur:false});
  //   }
  //   this.days = days;
  // }

  getMonthName(month){
    var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return monthNames[month];
  }

  getDayName(day){
    var dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return dayNames[day];
  }

  previousMonth(){
    
    if(this.visibleMonth.month == 0){
      this.visibleMonth.month = 11;
      this.visibleMonth.year--;
    }
    else{
      this.visibleMonth.month--;
    }
    this.generateDates();
    this.changeVisible.emit(this.visibleMonth);
  }

  currentMonth(){
    this.visibleMonth = {month:this.today.getMonth(),year:this.today.getFullYear()};
    this.generateDates();
    this.changeVisible.emit(this.visibleMonth);
  }

  nextMonth(){
    
    if(this.visibleMonth.month == 11){
      this.visibleMonth.month = 0;
      this.visibleMonth.year++;
    }
    else{
      this.visibleMonth.month++;
    }
    this.generateDates();
    this.changeVisible.emit(this.visibleMonth);
  }

  dateSelected(date,day){
    this.scheduler = false;
    this.selectedDate = {date:date,day:this.getDayName(day%7)};
    this.selection.emit(this.selectedDate);
  }

  populateEvents(){
    
    if(this.days){
      for(let day of this.days){
        delete day.events;
      }
    }
    if(this._events){
      console.log(this._events);
      for(let type of this._events){
        console.log(type);
        for(let event of type.events){
          var day = this.days[new Date(event.date).getDate()+this.monthStart-1];
          if(day.events){
            if(day.events[type._id])
              day.events[type._id].push(event);
            else
              day.events[type._id] = [event];
          }
          else{
            day.events = {};
            day.events[type._id] = [event];
          }
          this.days[new Date(event.date).getDate()+this.monthStart-1] = day;
        }
      }
    }
  }

  types(events){
    return Object.keys(events);
  }
  eventClass(events,type){

    if(type=="game"){
      for(let event of events){
        if(!event.roster_id){
          return "no-roster";
        }
      }
    }
    return "event-num "+type;
  }

  ngOnInit() {
    this.today = new Date();
    this.visibleMonth = {month:this.today.getMonth(),year:this.today.getFullYear()};
    this.changeVisible.emit(this.visibleMonth);
    this.generateDates();
  }

}
