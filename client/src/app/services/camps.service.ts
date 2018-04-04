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
  
  getModules(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'camps/all_modules',this.options).map(res => res.json());
  }

  hasModule(hmod){
    for(let mod of JSON.parse(localStorage.getItem('user')).modules){
      if(hmod == mod.short_name)
        return true
    }
    return false;
    
  }
  
  /* COUNSELORS */
  getAllCounselors(){
    this.createAuthenticationHeaders();
    var permissions = JSON.parse(localStorage.getItem('user')).permissions;
    return this.http.get(this.domain + 'camps/all_counselors/'+permissions,this.options).map(res => res.json());
  }

  registerCounselor(counselor){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/add_counselor',counselor,this.options).map(res => res.json());
  }

  bulkRegisterCounselor(counselors){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/bulk_add_counselor/'+this.hasModule('eval'),counselors,this.options).map(res => res.json());
  }

  removeCounselor(counselor){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'camps/remove_counselor/'+counselor._id,this.options).map(res => res.json());
  }

  rehire(counselor){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/rehire',counselor,this.options).map(res => res.json());
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

  addDivisionToCounselor(counselor){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/add_division_counselor',counselor,this.options).map(res => res.json());
  }

  addDivisionToCamper(camper){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/add_division_camper',camper,this.options).map(res => res.json());
  }

  get_division_counselors(divisionId,sessionId){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'camps/get_division_counselors/'+divisionId+"/"+sessionId,this.options).map(res => res.json());
  }



  /* HEAD STAFF */

  registerHeadStaff(user) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/register_head_staff', user,this.options).map(res => res.json());
  }

  getAllHeads(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'camps/all_heads' ,this.options).map(res => res.json());
  }

  removeHead(head){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'camps/remove_head/'+head._id,this.options).map(res => res.json());
  }

  addHeadToDivision(division){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/add_head_division',division,this.options).map(res => res.json());
  }

  removeHeadFromDivision(division_id,leader_id){
    this.createAuthenticationHeaders();
    var data = {
      "division_id":division_id,
      "leader_id":leader_id
    }
    return this.http.post(this.domain + 'camps/remove_head_division',data,this.options).map(res => res.json());
  }

  addHeadToSpecialty(specialty){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/add_head_specialty',specialty,this.options).map(res => res.json());
  }

  removeHeadFromSpecialty(specialty_id,leader_id){
    this.createAuthenticationHeaders();
    var data = {
      "specialty_id":specialty_id,
      "leader_id":leader_id
    }
    return this.http.post(this.domain + 'camps/remove_head_specialty',data,this.options).map(res => res.json());
  }

  addTypeToHead(head){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/add_type_head',head,this.options).map(res => res.json());
  }

  /* Specialty */

  registerSpecialty(specialty) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/register_specialty', specialty,this.options).map(res => res.json());
  }

  getAllSpecialties(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'camps/all_specialties' ,this.options).map(res => res.json());
  }

  removeSpecialty(specialty){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'camps/remove_specialty/'+specialty._id,this.options).map(res => res.json());
  }

  addSpecialtyToCounselor(counselor){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/add_specialty_counselor',counselor,this.options).map(res => res.json());
  }

  /* Options */

  getOptions(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'camps/options' ,this.options).map(res => res.json());
  }

  changeSession(session){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/change_session',session,this.options).map(res => res.json());
  }

  addType(type){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/register_type', type,this.options).map(res => res.json());
  }

  addhType(type){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/register_htype', type,this.options).map(res => res.json());
  }

  removeType(type){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'camps/remove_type/'+type._id,this.options).map(res => res.json());
  }

  removehType(type){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'camps/remove_htype/'+type._id,this.options).map(res => res.json());
  }

  /* CAMPERS */
  getAllCampers(){
    this.createAuthenticationHeaders();
    var permissions = JSON.parse(localStorage.getItem('user')).permissions;
    return this.http.get(this.domain + 'camps/all_campers/'+permissions,this.options).map(res => res.json());
  }

  registerCamper(camper){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/add_camper',camper,this.options).map(res => res.json());
  }

  bulkRegisterCampers(campers){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/bulk_add_camper/',campers,this.options).map(res => res.json());
  }

  removeCamper(camper){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'camps/remove_camper/'+camper._id,this.options).map(res => res.json());
  }

  reenroll(camper){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'camps/reenroll',camper,this.options).map(res => res.json());
  }

  get_division_campers(divisionId,sessionId){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'camps/get_division_campers/'+divisionId+"/"+sessionId,this.options).map(res => res.json());
  }
}