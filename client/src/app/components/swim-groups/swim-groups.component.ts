import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';
import { SwimService } from '../../services/swim.service';

@Component({
  selector: 'app-swim-groups',
  templateUrl: './swim-groups.component.html',
  styleUrls: ['./swim-groups.component.css']
})
export class SwimGroupsComponent implements OnInit {
  
  messageClass;
  message;
  form: FormGroup;
  previousUrl;
  toAddLifeguard;
  options;
  groups;

  constructor(
    private formBuilder: FormBuilder,
    private campsService: CampsService,
    public swimService: SwimService,
    public authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) { 
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  getGroups(){
    this.swimService.allGroups().subscribe(data => {
      this.groups = data.groups;
      console.log(this.groups);
    });
  }

  removeGroup(id){
    this.swimService.removeGroup(id).subscribe(data => {
      this.getGroups();
    });
  }

  createSwimGroupSubmit(){
    var swimGroup = {
      name: this.form.get('name').value,
      sessionId: String(this.options.session._id),
      lifeguardId: this.toAddLifeguard,
    }

    this.swimService.registerSwimGroup(swimGroup).subscribe(data => {
      this.getGroups();
    });
  }

  getOptions(){
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options
    });
  }

  preAddLifeguard(lifeguard){
    this.toAddLifeguard = String(lifeguard._id);
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.getOptions();
    this.getGroups();
  }

}
