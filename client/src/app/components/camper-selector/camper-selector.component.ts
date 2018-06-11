import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { CampsComponent } from '../camps/camps.component';
import { CampsService } from '../../services/camps.service';

@Component({
  selector: 'app-camper-selector',
  templateUrl: './camper-selector.component.html',
  styleUrls: ['./camper-selector.component.css']
})
export class CamperSelectorComponent implements OnInit {

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
  campers;
  dropdownDivisions;
  constructor(
    private campService: CampsService
  ) { }

  divisionChange(e){
    this.division = e._id
    this.campers = [];
    this.populateDivision(e._id);
  }

  genderChange(e){

    this.gender = e;
    this.divisions = this.divGenders();
    this.campers = [];
    this.divGenders();
    this.populateDivision(this.division);
  }

  camperSelected(index){
    var camper = this.campers[index];
    this.campers.splice(index,1)
    this.selection.emit(camper);
  }
  
  getOptions(){
    this.campService.getOptions().subscribe(data => {
      this.options = data.options
    });
  }

  populateDivisions(){
    this.campService.getAllDivisions().subscribe(data=>{
      this.dropdownDivisions = data;
      this.divisions = this.dropdownDivisions.divisions[1].divisions;
      this.populateDivision(this.divisions[0]._id);
    });
  }

  divGenders(){
      if(this.gender.toLowerCase()=="female"){
        return this.dropdownDivisions.divisions[0].divisions;
      }
      else if(this.gender.toLowerCase()=="male")
        return this.dropdownDivisions.divisions[1].divisions;
  }

  populateDivision(divisionId){
    if(!this.options){
      this.getOptions()
    }
    else{
      this.campService.get_division_campers(divisionId,this.options.session._id).subscribe(data => {
        if(data.success == false)
          this.campers = [];
        else{
          this.campers = [];
          for(let camper of data.division.campers){
            var add = true
            for(let exclude of this._exclude){
              if(exclude && camper._id == exclude._id){
                add = false;
                break;
              }
            }
            if(add){
              this.campers.push(camper);
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