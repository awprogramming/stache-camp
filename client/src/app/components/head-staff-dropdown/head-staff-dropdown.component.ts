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
  @Output() selectedChanged = new EventEmitter();
  @Output() showAddButton = new EventEmitter();
  heads;
  constructor(
    private campService: CampsService
  ) { }

  populateHeads(){
    this.campService.getAllHeads().subscribe(data=>{
      this.heads = data.heads;
      for(var ex in this.exclude){
        for(var head in this.heads){
          if(isEquivalent(this.exclude[ex],this.heads[head])){
            this.heads.splice(head,1);
          }
        }
      }
      this.selectedChanged.emit(this.heads[0]);
      this.showAddButton.emit(this.heads.length!=0);
    });
    
  }

  handleChange(e){
    this.selectedChanged.emit(this.heads[e.target.value]);
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
