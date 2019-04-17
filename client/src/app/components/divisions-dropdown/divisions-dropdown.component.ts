import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { CampsComponent } from '../camps/camps.component';
import { CampsService } from '../../services/camps.service';

@Component({
  selector: 'app-divisions-dropdown',
  templateUrl: './divisions-dropdown.component.html',
  styleUrls: ['./divisions-dropdown.component.css']
})
export class DivisionsDropdownComponent implements OnInit {
  _gender;
  @Input() 
    set gender(gender: string){
        this._gender = gender;
        //this.populateDivisions();
    }
  _divisions;
    @Input() 
      set divisions(divisions: Array<object>){
          this._divisions = divisions;
          if(this._divisions)
            this.selectedChanged.emit(this._divisions[0]);
      }
  @Output() selectedChanged = new EventEmitter();
  constructor(
    private campService: CampsService
  ) { }

  populateDivisions(){
    this.campService.getAllDivisions().subscribe(data=>{
      var divs = []
      for(let gender of data.divisions)
        divs[gender._id.gender] = gender.divisions;
      if(this._gender=="female")
        this.divisions = divs["female"];
      else if(this._gender=="male")
        this.divisions = divs["male"];
      
      this.selectedChanged.emit(this._divisions[0]);
    });
  }

  handleChange(e){
    this.selectedChanged.emit(this._divisions[e.target.value]);
  }

  ngOnInit() {
    //this.populateDivisions();
  }

}

function isEquivalent(a, b) {
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
      return false;
  }

  for (var i = 0; i < aProps.length; i++) {
      
      var propName = aProps[i];
        if(propName != "leaders"){
        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
      }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
}