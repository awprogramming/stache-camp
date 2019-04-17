import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';
import { SwimService } from '../../services/swim.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

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
  group1;
  group2;
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
      console.log(data);
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
    if(confirm("Are you sure you wish to delete this group?")){
      this.loading = true;
      this.swimService.removeGroup(id).subscribe(data => {
        this.getGroups();
      });
    }
  }

  showDivision(e){
    this.showing = e;
    if(e.name == "Show All"){
      this.groups = this.allGroups;
    }
    else{
      this.groups = [];
      for(let division of this.allGroups){
        console.log(division.division,e)
        if(division.division && division.division._id == e._id){
          this.groups.push(division);
          break;
        }
      }
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
      for(let division of this.groups){
        for(let group of division.groups){
          if(group.lifeguard && group.lifeguard._id==lg._id){
            var added = false;
            for(let div of tempGroups){
              if(div.division._id == division.division._id){
                div.groups.push(group);
                added = true;
                break;
              }
            }
            if(!added)
              tempGroups.push({
                division:division.division,
                lifeguard:division.lifeguard,
                groups:[group]
              })
          }
        }
      }
      this.groups = tempGroups;
    }
  }

  getDivisions(){
    this.campsService.getAllDivisions().subscribe(data=>{
      console.log(data);
      this.divisions = []
      for(let gender of data.divisions)
        this.divisions[gender._id.gender] = gender.divisions;
      var all = {
        name:"Show All"
      }
      this.divisions.unshift(all);
    });
  }

  createSwimGroupSubmit(){
    this.loading = true;
    var swimGroup = {
      name: this.form.get('name').value,
      session_id: String(this.options.session._id),
      lifeguard_id: this.toAddLifeguard,
    }
    console.log(swimGroup);
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

  export(){
    this.swimService.prepExport().subscribe(data => {
        var labels = {
          first:"First",
          last:"Last",
          group:"Group",
          level:"Level",
          swimGroup:"Swim Group",
          instructor:"Instructor"
        };
        data.campers.unshift(labels);
        new Angular2Csv(data.campers,'Swim_Groups');
    });
  }

  selectForMerge(e,group){
    if(this.authService.admin()){
    if(!this.group1 && group != this.group2){
      this.group1 = group;
      e.target.style.border = "thick solid black";
    }
    else if(group == this.group1){
      this.group1 = null;
      e.target.style.border = "";
    }
    else if(!this.group2  && group != this.group1){
      this.group2 = group;
      e.target.style.border = "thick solid black";
    }
    else if(group == this.group2){
      this.group2 = null;
      e.target.style.border = "";
    }
  }

  }

  mergeGroups(){
    if(confirm("Are you sure you want to merge "+this.group1.name+" into "+this.group2.name+" ("+this.group2.name+" will retain its name)?")){
      this.loading = true;
      this.swimService.mergeGroups({group1:this.group1._id,group2:this.group2._id}).subscribe(data => {
        this.loading = false;
        this.group1 = null;
        this.group2 = null;
        this.getGroups();
      });
    }
  }

  swapGroups(){
    var temp = this.group1;
    this.group1 = this.group2;
    this.group2 = temp;
  }

  // export(session_id){
  //   this.loading = true;
  //   var session;
  //   for(let sess of this.sessions){
  //     if(sess._id==session_id){
  //       session = sess;
  //       break;
  //     }
  //   }
  //   var data = [];

  //   var labels = {
  //     first:"First",
  //     last:"Last"
  //   };
      
  //   for(var i = 0; i < this.options.evaluationOpts.perSession;i++){
  //     for(let type of this.options.headStaff_types){
  //       labels[type.type+(i+1)+" Score"] = type.type+(i+1)+" Score";
  //       labels[type.type+(i+1)+" Level"] = type.type+(i+1)+" Level";
  //     }
  //     labels[(i+1)+" Average"] = (i+1)+" Average";
  //   }
    
  //   data.push(labels);


  //   for(let counselor of session.counselors){
  //     var rowObj = {};
  //     var count = 0;
  //     rowObj["first"] = counselor.first;
  //     rowObj["last"] = counselor.last;
  //     if(counselor.preFiller){
  //       for(let pre of counselor.preFiller){
  //         count++;
  //         for(let type of this.options.headStaff_types){
  //           rowObj[type.type+"score"+count] = "-"; 
  //           rowObj[type.type+"level"+count] = "-"; 
  //         }
  //         rowObj["avg"+count] = "-";
  //       }
  //     }
  //     for(let evaluation of counselor.evaluations){
  //       count++;
  //       var score_total = 0;
  //       var num_subs = 0;
  //       for(let type of this.options.headStaff_types){
  //         if(evaluation.sub_evals[type.type]){
  //           var sub_eval_score = this.getScore(evaluation.sub_evals[type.type]);
  //           score_total += sub_eval_score;
  //           num_subs++;
  //           rowObj[type.type+"score"+count] = sub_eval_score;
  //           rowObj[type.type+"level"+count] = this.getLevel(sub_eval_score);
  //         }
  //         else{
  //           rowObj[type.type+"score"+count] = "-"; 
  //           rowObj[type.type+"level"+count] = "-";
  //         }
  //       }
  //       if(num_subs!= 0){
  //         var avg = score_total/num_subs;
  //         rowObj["avg"+count] = avg;
  //       }
  //       else{
  //         rowObj["avg"+count] = "-";
  //       }
  //     }
  //     if(counselor.postFiller){
  //     for(let post of counselor.postFiller){
  //         count++;
  //         for(let type of this.options.headStaff_types){
  //           rowObj[type.type+"score"+count] = "-"; 
  //           rowObj[type.type+"level"+count] = "-"; 
  //         }
  //         rowObj["avg"+count] = "-";
  //       }
  //     }
  //     data.push(rowObj)
  //   }
    
  //  new Angular2Csv(data, session.session.name+'_Swim_Groups');
  //  this.loading = false;
  // }


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
