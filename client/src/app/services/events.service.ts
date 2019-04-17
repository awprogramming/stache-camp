import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class EventsService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    this.authService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
  }

  
  scheduleEvent(event){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'events/schedule_event',event,this.options).map(res => res.json());
  }

  editEvent(event){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'events/edit_event',event,this.options).map(res => res.json());
  }

  getMonthEvents(date,type){
    console.log(date);
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'events/get_month_events/'+date.month+'/'+date.year+'/'+type,this.options).map(res => res.json());
  }

  getDivisionMonthEvents(date,division){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'events/get_division_month_events/'+date.month+'/'+date.year+'/'+division._id,this.options).map(res => res.json());
  }

  getEvent(id){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'events/get_event/'+id,this.options).map(res => res.json());
  }

  addRosterToEvent(eventId,roster){
    var data = {
      eventId:eventId,
      roster:roster
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'events/add_roster_to_event',data,this.options).map(res => res.json());
  }

  removeRosterFromEvent(eventId){
    var data = {
      eventId:String(eventId)
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'events/remove_roster_from_event',data,this.options).map(res => res.json());
  }

  addCoachToEvent(eventId,coachId){
    var data = {
      eventId:eventId,
      coachId: coachId
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'events/add_coach_to_event',data,this.options).map(res => res.json());
  }

  removeCoachFromEvent(eventId,coachId){
    var data = {
      eventId:eventId,
      coachId: coachId
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'events/remove_coach_from_event',data,this.options).map(res => res.json());
  }

  addRefToEvent(eventId,refId){
    var data = {
      eventId:eventId,
      refId: refId
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'events/add_ref_to_event',data,this.options).map(res => res.json());
  }

  removeRefFromEvent(eventId,refId){
    var data = {
      eventId:eventId,
      refId: refId
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'events/remove_ref_from_event',data,this.options).map(res => res.json());
  }

  removeEvent(eventId){
    var data = {
      eventId:eventId
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'events/remove_event',data,this.options).map(res => res.json());
  }

  changeEventDivision(eventId,divisionId){
    var data = {
      eventId:eventId,
      divisionId:divisionId
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'events/change_event_division',data,this.options).map(res => res.json());
  }

  addEventDivision(eventId,divisionId){
    var data = {
      eventId:eventId,
      divisionId:divisionId
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'events/add_event_division',data,this.options).map(res => res.json());
  }

  removeEventDivision(eventId,divisionId){
    var data = {
      eventId:eventId,
      divisionId:divisionId
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'events/remove_event_division',data,this.options).map(res => res.json());
  }
  


}