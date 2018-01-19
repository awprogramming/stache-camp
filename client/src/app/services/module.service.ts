import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';



@Injectable()
export class ModuleService {

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

  registerModule(mod){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'modules/add_module',mod,this.options).map(res => res.json());
  }

  removeModule(mod){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'modules/remove_module/'+mod._id,this.options).map(res => res.json());
  }

  getAllModules() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'modules/all_modules' ,this.options).map(res => res.json());
  }

}