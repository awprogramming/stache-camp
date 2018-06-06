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
  allGroups;
  loading;
  divisions;
  showing = {
    name:"Show All"
  };
  lgShowing = {
    first:"All",
    last:"Lifeguards"
  }

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
      if(data.success){
        this.groups = data.groups;
        this.allGroups = data.groups;
        this.loading = false;
      }
      else{
        this.groups = {};
        this.allGroups = {};
      }
      this.getDivisions();
    });
  }

  getGroupDivisions(){
    return Object.keys(this.groups);
  }

  removeGroup(id){
    this.loading = true;
    this.swimService.removeGroup(id).subscribe(data => {
      this.getGroups();
    });
  }

  showDivision(e){
    this.showing = e;
    if(e.name == "Show All"){
      this.groups = this.allGroups;
    }
    else{
      this.groups = [];
      this.groups[e.name] = this.allGroups[e.name];
    }

    if(this.lgShowing.first !="All" && this.lgShowing.last != "Lifeguards"){
      this.lifeguardFilter(this.lgShowing);
    }
  }

  lifeguardFilter(lg){
    this.lgShowing = lg;
    if(lg.first == "All" && lg.last == "Lifeguards"){
      this.showDivision(this.showing);
    }
    else{
      var tempGroups = [];
      for(let group of this.getGroupDivisions()){
        for(let sGroup of this.groups[group]){
          if(sGroup.lifeguard && sGroup.lifeguard._id==lg._id){
            if(tempGroups[group])
              tempGroups[group].push(sGroup);
            else
              tempGroups[group] = [sGroup];
          }
        }
      }
      this.groups = tempGroups;
    }
  }

  getDivisions(){
    this.campsService.getAllDivisions().subscribe(data=>{
      console.log(data.divisions[0].divisions); 
      this.divisions = data.divisions[0].divisions;
      var all = {
        name:"Show All"
      }
      this.divisions.unshift(all);
      console.log(this.divisions);
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
        if(this.getGroupDivisions().length != 0){
          clearInterval(checkGroups);
          this.loading = false;
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
