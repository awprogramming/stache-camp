import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class MedsService {

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

  changeEpi(data){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'meds/change_epi',data,this.options).map(res => res.json());
  }

  changeInh(data){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'meds/change_inh',data,this.options).map(res => res.json());
  }

  addMed(camper){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'meds/add_med',camper,this.options).map(res => res.json());
  }

  removeMed(data){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'meds/remove_med',data,this.options).map(res => res.json());
  }


}