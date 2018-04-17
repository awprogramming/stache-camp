import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';
import { SwimService } from '../../services/swim.service';

@Component({
  selector: 'app-swim-levels',
  templateUrl: './swim-levels.component.html',
  styleUrls: ['./swim-levels.component.css']
})
export class SwimLevelsComponent implements OnInit {
  
  messageClass;
  message;
  form: FormGroup;
  previousUrl;
  toAddLifeguard;
  options;
  levels;

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
      num: ['',Validators.required]
    });
  }

  getLevels(){
    this.swimService.allLevels().subscribe(data => {
      this.levels = data.levels;
    });
  }

  removeLevel(id){
    this.swimService.removeLevel(id).subscribe(data => {
      this.getLevels();
    });
  }

  createSwimLevelSubmit(){
    var swimLevel = {
      name: this.form.get('name').value,
      rcLevel: this.form.get('num').value
    }

    this.swimService.registerSwimLevel(swimLevel).subscribe(data => {
      this.getLevels();
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
    this.getLevels();
  }

}
