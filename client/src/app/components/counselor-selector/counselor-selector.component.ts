import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { CampsComponent } from '../camps/camps.component';
import { CampsService } from '../../services/camps.service';

@Component({
  selector: 'app-counselor-selector',
  templateUrl: './counselor-selector.component.html',
  styleUrls: ['./counselor-selector.component.css']
})
export class CounselorSelectorComponent implements OnInit {

  _exclude;
  @Input() 
    set exclude(exclude: Array<Object>){
        this._exclude = exclude;
        this.populateDivision(this.division);
    }

  @Output() selection = new EventEmitter();
  options;
  divisions;
  gender = "male";
  division
  counselors;
  divisionsShowing;
  dropdownDivisions;

  constructor(
    private campService: CampsService
  ) { }

  divisionChange(e){
    this.division = e._id
    this.populateDivision(e._id);
  }

  genderChange(e){
    this.gender = e;
    this.divGenders(e);
    this.populateDivision(this.division);
  }

  counselorSelected(index){
    var counselor = this.counselors[index];
    this.counselors.splice(index,1)
    this.selection.emit(counselor);
  }
  
  getOptions(){
    this.campService.getOptions().subscribe(data => {
      this.options = data.options
    });
  }

  divGenders(gender){
    if(gender.toLowerCase()=="female"){
      this.divisionsShowing = this.dropdownDivisions["female"];
    }
    else if(gender.toLowerCase()=="male")
      this.divisionsShowing = this.dropdownDivisions["male"];
    else
      return [];
  }


  populateDivisions(){
    this.campService.getAllDivisions().subscribe(data=>{
      this.dropdownDivisions = []
      for(let gender of data.divisions)
        this.dropdownDivisions[gender._id.gender] = gender.divisions;
      this.divGenders("male");
    });
  }

  populateDivision(divisonId){
    console.log("**");
    if(!this.options){
      this.getOptions()
    }
    else{
      this.campService.get_division_counselors(divisonId,this.options.session._id).subscribe(data => {
        console.log(data);
        if(data.success == false){
          console.log("fail")
          this.counselors = [];
        }
        else{
          console.log("success")
          console.log(this._exclude);
          this.counselors = [];
          for(let counselor of data.counselors){
            var add = true
            for(let exclude of this._exclude){
              if(counselor._id == exclude._id){
                add = false;
                break;
              }
            }
            if(add){
              this.counselors.push(counselor);
            }
          }
        }
      });
    }
  }

  ngOnInit() {
    this.populateDivisions();
  }

}