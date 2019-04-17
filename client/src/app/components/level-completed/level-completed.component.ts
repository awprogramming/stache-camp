import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';
import { SwimService } from '../../services/swim.service';


@Component({
  selector: 'app-level-completed',
  templateUrl: './level-completed.component.html',
  styleUrls: ['./level-completed.component.css']
})
export class LevelCompletedComponent implements OnInit {
  options;
  messageClass;
  message;
  previousUrl;
  form;
  newTypeForm;
  newhTypeForm;
  perSessionForm;
  newType = false;
  newhType = false;
  loading;
  completed;

  constructor(
    public campsService: CampsService,
    public authService: AuthService,
    private swimService: SwimService,
    private router: Router,
    private authGuard: AuthGuard
  ) {}


  getOptions(){
    this.loading = true;
    this.swimService.getCompleted().subscribe(data =>{
      this.completed = data.completed;
      this.loading = false;
    });
    // this.campsService.getOptions().subscribe(data => {
    //   this.options = data.options
    //   console.log(this.options);
    //   this.loading = false;
    // });
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.getOptions();
  }

}

