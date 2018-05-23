import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ModuleService } from '../../services/module.service';
import { CampsComponent } from '../camps/camps.component';
import { CampsService } from '../../services/camps.service';

@Component({
  selector: 'app-head-staff-dropdown',
  templateUrl: './head-staff-dropdown.component.html',
  styleUrls: ['./head-staff-dropdown.component.css']
})
export class HeadStaffDropdownComponent implements OnInit {

  @Input() exclude: Array<object>;
  @Input() heads: Array<object>
  @Output() selectedChanged = new EventEmitter();
  @Output() showAddButton = new EventEmitter();
  inDD;
  constructor(
    private campService: CampsService
  ) { }

  populateHeads(){
    this.inDD = [];
    if(this.exclude.length == 0){
      this.inDD = this.heads;
    }
    else{
      for(var head in this.heads){
        var e = false;
        for(var ex in this.exclude){
          // console.log(this.exclude[ex]["_id"],this.heads[head]["_id"],this.exclude[ex]["_id"] == this.heads[head]["_id"])
          if(this.exclude[ex]["_id"] == this.heads[head]["_id"]){
            e = true;
            break;
          }
        }
        if(!e)
          this.inDD.push(this.heads[head]);
      }
    }
    if(this.inDD){
      this.selectedChanged.emit(this.inDD[0]);
      this.showAddButton.emit(this.inDD.length!=0);
    }
  }

  handleChange(e){
    this.selectedChanged.emit(this.inDD[e.target.value]);
  }

  ngOnInit() {
    this.populateHeads();
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
