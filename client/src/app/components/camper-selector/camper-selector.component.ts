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

  populateDivision(divisonId){
    if(!this.options){
      this.getOptions()
    }
    else{
      this.campService.get_division_campers(divisonId,this.options.session._id).subscribe(data => {
        if(data.success == false)
          this.campers = [];
        else{
          this.campers = [];
          for(let camper of data.division.campers){
            var add = true
            for(let exclude of this._exclude){
              if(camper._id == exclude._id){
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
  }

}