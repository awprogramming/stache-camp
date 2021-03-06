import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ModuleService } from '../../services/module.service';
import { CampsComponent } from '../camps/camps.component';
import { CampsService } from '../../services/camps.service';


@Component({
  selector: 'app-module-dropdown',
  templateUrl: './module-dropdown.component.html',
  styleUrls: ['./module-dropdown.component.css']
})
export class ModuleDropdownComponent implements OnInit {

  @Input() campModules: Array<object>;
  @Output() selectedChanged = new EventEmitter();
  modules;
  constructor(
    private moduleService: ModuleService,
    private campService: CampsService
  ) { }

  populateModules(){
    this.moduleService.getAllModules().subscribe(data=>{
      this.modules = data.modules;
      for(var cmod in this.campModules){
        for(var mod in this.modules){
          if(isEquivalent(this.campModules[cmod],this.modules[mod])){
            this.modules.splice(mod,1);
          }
        }
      }
      this.selectedChanged.emit(this.modules[0]);
    });
    
  }

  handleChange(e){
    this.selectedChanged.emit(this.modules[e.target.value]);
  }

  ngOnInit() {
    this.populateModules();
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