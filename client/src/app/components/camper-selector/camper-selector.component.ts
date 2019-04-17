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
  @Output() multiSelection = new EventEmitter();
  options;
  divisions;
  gender = "male";
  division
  campers;
  dropdownDivisions;
  selectedCampers = [];
  constructor(
    private campService: CampsService
  ) { }

  divisionChange(e){
    this.division = e._id
    this.campers = [];
    console.log(this.division);
    this.populateDivision(e._id);
  }

  genderChange(e){

    this.gender = e;
    this.divisions = this.divGenders();
    this.campers = [];
    console.log(this.gender);
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
      this.dropdownDivisions = []
      for(let gender of data.divisions)
        this.dropdownDivisions[gender._id.gender] = gender.divisions;

      // this.dropdownDivisions = data;
      console.log(this.dropdownDivisions);
      this.divisions = this.dropdownDivisions["male"];
      console.log(this.divisions);
      this.populateDivision(this.divisions[0]._id);
    });
  }

  divGenders(){
      if(this.gender.toLowerCase()=="female"){
        return this.dropdownDivisions["female"];
      }
      else if(this.gender.toLowerCase()=="male")
        return this.dropdownDivisions["male"];
  }

  populateDivision(divisionId){
      this.campService.get_division_campers(divisionId).subscribe(data => {
        console.log(data);
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

  selectCamper(e,camper){
    if(e.target.style.fontWeight == "bold"){
      e.target.style.fontWeight = "";
      this.selectedCampers.splice(this.selectedCampers.indexOf(camper._id.toString()),1)
    }
    else{
      e.target.style.fontWeight = "bold";
      this.selectedCampers.push(camper._id.toString());
    }
  }

  addSelected(){
    this.multiSelection.emit(this.selectedCampers);
    this.selectedCampers = [];
  }

  ngOnInit() {
    this.populateDivisions();
  }

}