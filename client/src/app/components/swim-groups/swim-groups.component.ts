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
  loading;

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
    this.loading = true;
    this.swimService.allGroups().subscribe(data => {
      this.groups = data.groups;
      this.loading = false;
    });
  }

  removeGroup(id){
    this.loading = true;
    this.swimService.removeGroup(id).subscribe(data => {
      this.getGroups();
    });
  }

  createSwimGroupSubmit(){
    this.loading = true;
    var swimGroup = {
      name: this.form.get('name').value,
      sessionId: String(this.options.session._id),
      lifeguardId: this.toAddLifeguard,
    }

    this.swimService.registerSwimGroup(swimGroup).subscribe(data => {
      this.getGroups();
    });
  }

  generateGroups(){
    this.loading = true;
    this.swimService.autoGenerateGroups().subscribe(data => {
      var checkGroups = setInterval(()=>{
        if(this.groups.length != 0){
          clearInterval(checkGroups);
        }
        else{
          this.getGroups();
        }
      },5000);
    });
  }

  getOptions(){
    this.loading = true;
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options
      this.loading = false;
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
