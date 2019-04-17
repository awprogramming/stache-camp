import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class DbMaintenanceService {
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

  transferCampers(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'dbMaintenance/transfer_campers' ,this.options).map(res => res.json());
  }

  transferDivisions(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'dbMaintenance/transfer_divisions' ,this.options).map(res => res.json());
  }

  transferSpecialties(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'dbMaintenance/transfer_specialties' ,this.options).map(res => res.json());
  }

  transferCounselors(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'dbMaintenance/transfer_counselors' ,this.options).map(res => res.json());
  }

  transferUsers(){ 
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'dbMaintenance/transfer_users' ,this.options).map(res => res.json());
  }

  transferSessions(){ 
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'dbMaintenance/transfer_sessions' ,this.options).map(res => res.json());
  }

  transferQuestions(){ 
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'dbMaintenance/transfer_questions' ,this.options).map(res => res.json());
  }

  efficientAnswers(){ 
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'dbMaintenance/efficient_answers' ,this.options).map(res => res.json());
  }

  sessToId(){ 
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'dbMaintenance/sess_to_id' ,this.options).map(res => res.json());
  }

  rosSessToId(){ 
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'dbMaintenance/ros_sess_to_id' ,this.options).map(res => res.json());
  }

  transferRosters(){ 
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'dbMaintenance/transfer_rosters' ,this.options).map(res => res.json());
  }

  transferSwimGroups(){ 
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'dbMaintenance/transfer_swim_groups' ,this.options).map(res => res.json());
  }

  transferSwimLevels(){ 
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'dbMaintenance/transfer_swim_levels' ,this.options).map(res => res.json());
  }

  convertCompleted(){ 
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'dbMaintenance/convert_completed' ,this.options).map(res => res.json());
  }
  flSwap(){ 
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'dbMaintenance/fl_swap' ,this.options).map(res => res.json());
  }

  unsetStuff(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'dbMaintenance/unset_stuff' ,this.options).map(res => res.json());
  }

}