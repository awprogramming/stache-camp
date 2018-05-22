import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SportsService } from '../../services/sports.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-rosters',
  templateUrl: './rosters.component.html',
  styleUrls: ['./rosters.component.css']
})
export class RostersComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  form: FormGroup;
  previousUrl;
  newRoster = false;
  rosters;
  specialties;
  toAddTo;
  divisions;
  d_keys;
  keys;
  internal;
  loading;

  constructor(
    private formBuilder: FormBuilder,
    private sportsService: SportsService,
    private router: Router,
    private authGuard: AuthGuard
  ) { 
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  onRegistrationSubmit() {
    this.loading = true;
    this.processing = true;
    const roster = {
      name: this.form.get('name').value,
      specialty: this.toAddTo,
      internal: this.internal
    }
  
    this.sportsService.registerRoster(roster).subscribe(data => {
    
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;

        setTimeout(() => {
          if(this.previousUrl)
            this.router.navigate([this.previousUrl]);
          else{
            this.newRoster = false;
            this.getAllRosters();
          }
        }, 2000);
      }
    });
  }

  remove(sd,roster,internal){
    this.loading = true;
    if(internal){
      this.sportsService.removeInternalRoster(sd,roster).subscribe(data => {
        if (!data.success) {
          this.messageClass = 'alert alert-danger';
          this.message = data.message;
          this.processing = false;
        } else {
          this.messageClass = 'alert alert-success';
          this.message = data.message;
          this.getAllRosters();
        }
      });
    }
    else{
      this.sportsService.removeRoster(sd,roster).subscribe(data => {
        if (!data.success) {
          this.messageClass = 'alert alert-danger';
          this.message = data.message;
          this.processing = false;
        } else {
          this.messageClass = 'alert alert-success';
          this.message = data.message;
          this.getAllRosters();
        }
      });
    }
  }

  showAdd(specialty, internal) {
    this.toAddTo = specialty;
    this.internal = internal;
    this.newRoster = true;
  }

  cancelAdd() {
    this.newRoster = false;
  }

  getType(){
    return JSON.parse(localStorage.getItem('user')).type.type;
  }

  getAllRosters(){
    this.loading = true;
    if(this.getType() == "Head Specialist"){
      this.sportsService.getAllRosters().subscribe(data => {
        this.specialties = data.specialties
        this.loading = false;;
      });
    }
    else{
      this.sportsService.getLeaderRosters().subscribe(data => {
        this.divisions = data.rosters;
        if(this.divisions){
          this.d_keys = Object.keys(this.divisions);
          this.keys = []
          for(let key of this.d_keys){
            this.keys[key] = Object.keys(this.divisions[key]["specialties"]);
          }
        }
        this.loading = false;
      });
    }
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.getAllRosters();
  }

}
