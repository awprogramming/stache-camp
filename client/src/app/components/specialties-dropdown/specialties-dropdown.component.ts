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
  @Input() specialties: Array<Object>;
  constructor(
    private campService: CampsService
  ) { }

  populateSpecialties(){
      this.selectedChanged.emit(this.specialties[0]);
  }

  handleChange(e){
    this.selectedChanged.emit(this.specialties[e.target.value]);
  }

  ngOnInit() {
    this.populateSpecialties();
  }

}