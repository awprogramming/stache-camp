import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class SportsService {

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

  registerRoster(roster){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'sports/add_roster',roster,this.options).map(res => res.json());
  }

  removeRoster(specialty,roster){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'sports/remove_roster/'+specialty._id+'/'+roster._id,this.options).map(res => res.json());
  }

  removeInternalRoster(division,roster){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'sports/remove_internal_roster/'+division+'/'+roster._id,this.options).map(res => res.json());
  }

  getAllRosters() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'sports/all_rosters' ,this.options).map(res => res.json());
  }

  getRoster(specialtyId,rosterId){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'sports/get_roster/'+specialtyId+'/'+rosterId,this.options).map(res => res.json());
  }

  getInternalRoster(divisionId,rosterId){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'sports/get_internal_roster/'+divisionId+'/'+rosterId,this.options).map(res => res.json());
  }

  addCamperToRoster(ids){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'sports/add_camper_to_roster',ids,this.options).map(res => res.json());
  }

  addCamperToInternalRoster(ids){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'sports/add_camper_to_internal_roster',ids,this.options).map(res => res.json());
  }

  removeCamperFromRoster(ids){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'sports/remove_camper_from_roster',ids,this.options).map(res => res.json());
  }

  removeCamperFromInternalRoster(ids){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'sports/remove_camper_from_internal_roster',ids,this.options).map(res => res.json());
  }

  getLeaderRosters(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'sports/get_leader_rosters',this.options).map(res => res.json());
  }

}