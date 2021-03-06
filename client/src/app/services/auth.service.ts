import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  //domain = ""; // Production;
  domain = "http://localhost:8080/";
  authToken;
  user;
  options;

  constructor(
    private http: Http
  ) { }

  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    this.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authToken // Attach token
      })
    });
  }

  changePassword(newPassword){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'authentication/change_password', newPassword, this.options).map(res => res.json());
  }

  // Function to get token from client local storage
  loadToken() {
    this.authToken = localStorage.getItem('token');; // Get token and asssign to variable to be used elsewhere
  }

  // Function to register user accounts
  registerUser(user) {
    return this.http.post(this.domain + 'authentication/register', user).map(res => res.json());
  }

  registerCamp(camp){
    return this.http.post(this.domain + 'authentication/register-camp',camp).map(res => res.json());
  }

  // Function to check if e-mail is taken
  checkEmail(email) {
    return this.http.get(this.domain + 'authentication/checkEmail/' + email).map(res => res.json());
  }

  // Function to login user
  login(user) {
    return this.http.post(this.domain + 'authentication/login', user).map(res => res.json());
  }

  // Function to logout
  logout() {
    this.authToken = null; // Set token to null
    this.user = null; // Set user to null
    localStorage.clear(); // Clear local storage
  }

  // Function to store user's data in client local storage
  storeUserData(token, user) {
    localStorage.setItem('token', token); // Set token in local storage
    localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
    this.authToken = token; // Assign token to be used elsewhere
    this.user = user; // Set user to be used elsewhere
  }

  // // Function to check if user is logged in
  loggedIn() {
    return tokenNotExpired();
  }

  superUser(){
    if(this.loggedIn())
      return JSON.parse(localStorage.getItem('user')).permissions == 'superuser';
    else
      return false;
  }

  admin(){
    if(this.loggedIn())
      return JSON.parse(localStorage.getItem('user')).permissions == 'admin';
    else
      return false;
  }
  
  isUser(){
    if(this.loggedIn())
      return JSON.parse(localStorage.getItem('user')).permissions == 'user';
    else
      return false;
  }

  userType(){
    return JSON.parse(localStorage.getItem('user')).type.type;
  }

}