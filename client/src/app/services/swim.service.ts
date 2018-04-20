import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class SwimService {

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

  allGroups(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'swim/all_groups',this.options).map(res => res.json()); 
  }

  inGroups(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'swim/in_groups',this.options).map(res => res.json()); 
  }

  removeGroup(id){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'swim/remove_swim_group',{id:id},this.options).map(res => res.json());
  }

  registerSwimGroup(group){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'swim/register_group',group,this.options).map(res => res.json());
  }

  getSwimGroup(id){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'swim/get_swim_group/'+ id,this.options).map(res => res.json());
  }

  addToSwimGroup(groupId,camperId){
    var data = {
      camperId:camperId,
      groupId:groupId
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'swim/add_to_swim_group',data,this.options).map(res => res.json());
  }

  removeFromSwimGroup(groupId,camperId){
    var data = {
      camperId:camperId,
      groupId:groupId
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'swim/remove_from_swim_group',data,this.options).map(res => res.json());
  }

  allLevels(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'swim/all_levels',this.options).map(res => res.json()); 
  }

  setLevel(camperId,level){
    var data = {
      camperId:camperId,
      level:level
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'swim/set_swim_level',data,this.options).map(res => res.json());
  }

  removeLevel(id){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'swim/remove_swim_level',{id:id},this.options).map(res => res.json());
  }

  registerSwimLevel(level){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'swim/register_level',level,this.options).map(res => res.json());
  }

  getSwimLevel(id){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'swim/get_swim_level/'+ id,this.options).map(res => res.json());
  }

  registerSwimAnimal(levelId,swimAnimal){
    var data = {
      id:levelId,
      swimAnimal:swimAnimal
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'swim/register_swim_animal',data,this.options).map(res => res.json());
  }

  registerAnimalSkill(levelId,swimAnimal){
    var data = {
      id:levelId,
      swimAnimalId:swimAnimal._id,
      skill:swimAnimal.addSkill
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'swim/register_animal_skill',data,this.options).map(res => res.json());
  }

  registerExitSkill(levelId,skill){
    var data = {
      id:levelId,
      skill:skill
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'swim/register_exit_skill',data,this.options).map(res => res.json());
  }

  checkSkill(camperId,animalId,skillId,checked){
    var data = {
      camperId:camperId,
      animalId:animalId,
      skillId:skillId,
      checked:checked
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'swim/check_skill',data,this.options).map(res => res.json());
  }

  checkExitSkill(camperId,skillId,checked){
    var data = {
      camperId:camperId,
      skillId:skillId,
      checked:checked
    }
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'swim/check_exit_skill',data,this.options).map(res => res.json());
  }

  levelComplete(camperId){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'swim/level_complete',{camperId:camperId},this.options).map(res => res.json());
  }

  registerLifeguard(counselor){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'swim/register_lifeguard',counselor,this.options).map(res => res.json());
  }
  

}