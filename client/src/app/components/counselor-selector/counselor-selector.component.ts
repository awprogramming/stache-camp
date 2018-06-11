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
      this.divisionsShowing = this.dropdownDivisions.divisions[0].divisions;
    }
    else if(gender.toLowerCase()=="male")
      this.divisionsShowing = this.dropdownDivisions.divisions[1].divisions;
    else
      return [];
  }


  populateDivisions(){
    this.campService.getAllDivisions().subscribe(data=>{
      this.dropdownDivisions = data;
      this.divGenders("male");
    });
  }

  populateDivision(divisonId){
    if(!this.options){
      this.getOptions()
    }
    else{
      this.campService.get_division_counselors(divisonId,this.options.session._id).subscribe(data => {
        if(data.success == false){
          this.counselors = [];
        }
        else{
          this.counselors = [];
          for(let counselor of data.division.counselors){
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