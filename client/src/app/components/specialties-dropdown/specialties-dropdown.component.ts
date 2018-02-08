import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ModuleService } from '../../services/module.service';
import { CampsComponent } from '../camps/camps.component';
import { CampsService } from '../../services/camps.service';

@Component({
  selector: 'app-specialties-dropdown',
  templateUrl: './specialties-dropdown.component.html',
  styleUrls: ['./specialties-dropdown.component.css']
})
export class SpecialtiesDropdownComponent implements OnInit {

  @Output() selectedChanged = new EventEmitter();
  specialties;
  constructor(
    private campService: CampsService
  ) { }

  populateSpecialties(){
    this.campService.getAllSpecialties().subscribe(data=>{
      this.specialties = data.specialties;
      this.selectedChanged.emit(this.specialties[0]);
    });
    
  }

  handleChange(e){
    this.selectedChanged.emit(this.specialties[e.target.value]);
  }

  ngOnInit() {
    this.populateSpecialties();
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

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
          return false;
      }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
}