import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.css']
})
export class TimepickerComponent implements OnInit {

  time ={
      hour:"12",
      minute:"00",
      ampm:"PM"
    }
  @Input() 
    set selectedTime(selectedTime){
        console.log(selectedTime);
          
          this.time = {
            hour:selectedTime.hour,
            minute:selectedTime.minute,
            ampm:selectedTime.ampm
          }
          if(this.time.minute=="0"){
            this.time.minute="00";
          }
    }

  @Output() selection = new EventEmitter();

  
  constructor() { }

  increaseHour(){
    var hour = parseInt(this.time.hour);
    if(hour == 12)
      hour = 1;
    else 
      hour++;
    this.time.hour = String(hour);
    this.selection.emit(this.time);
  }
  decreaseHour(){
    var hour = parseInt(this.time.hour);
    if(hour == 1)
      hour = 12;
    else 
      hour--;

    this.time.hour = String(hour);
    this.selection.emit(this.time);
  }

  increaseMinute(){
    var minute = parseInt(this.time.minute);
    if(minute == 45)
      minute = 0;
    else 
      minute+=15;
    
    if(minute < 10)
      this.time.minute = "0" + minute;
    else
      this.time.minute = String(minute);
    
    this.selection.emit(this.time);
  }
  decreaseMinute(){
    var minute = parseInt(this.time.minute);
    if(minute == 0)
      minute = 45;
    else 
      minute-=15;
    
    if(minute < 10)
      this.time.minute = "0" + minute;
    else
      this.time.minute = String(minute);
    
    this.selection.emit(this.time);
  }

  toggleAMPM(ampm){
    this.time.ampm = ampm;
    this.selection.emit(this.time);
  }

  ngOnInit() {
    this.selection.emit(this.time);
  }

}
