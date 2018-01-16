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
      for(var mod of this.campModules){
        var i = this.modules.indexOf(mod);
        this.modules.splice(i,1);
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