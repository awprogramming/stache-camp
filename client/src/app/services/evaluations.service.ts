import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class EvaluationsService {
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

  registerQuestion(question){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'evaluations/register_question',question,this.options).map(res => res.json());
  }

  removeQuestion(question){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'evaluations/remove_question/'+question._id,this.options).map(res => res.json());
  }

  getAllQuestions() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'evaluations/all_questions' ,this.options).map(res => res.json());
  }

  changePerSession(newAmount){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'evaluations/change_per_session',newAmount,this.options).map(res => res.json());
  }

  changePeriod(newPeriod){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'evaluations/change_period',newPeriod,this.options).map(res => res.json());
  }

}