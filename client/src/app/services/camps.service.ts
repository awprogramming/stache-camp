import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';



@Injectable()
export class CampsService {

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

  getAllCamps() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'camps/all_camps' ,this.options).map(res => res.json());
  }


  /* MODULES */
  activateModule(mod){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/activate_module',mod,this.options).map(res => res.json());
  }
  
  /* COUNSELORS */
  getAllCounselors(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'camps/all_counselors' ,this.options).map(res => res.json());
  }

  registerCounselor(counselor){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/add_counselor',counselor,this.options).map(res => res.json());
  }

  removeCounselor(counselor){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'camps/remove_counselor/'+counselor._id,this.options).map(res => res.json());
  }

  /* DIVISIONS */
  getAllDivisions(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'camps/all_divisions' ,this.options).map(res => res.json());
  }

  registerDivision(division){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/register_division',division,this.options).map(res => res.json());
  }

  removeDivision(division){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'camps/remove_division/'+division._id,this.options).map(res => res.json());
  }

  addDivision(counselor){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/add_division',counselor,this.options).map(res => res.json());
  }

  /* HEAD STAFF */

  registerHeadStaff(user) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/register_head_staff', user,this.options).map(res => res.json());
  }


}