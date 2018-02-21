import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { CampsComponent } from '../camps/camps.component';
import { CampsService } from '../../services/camps.service';

@Component({
  selector: 'app-head-staff-type-dropdown',
  templateUrl: './head-staff-type-dropdown.component.html',
  styleUrls: ['./head-staff-type-dropdown.component.css']
})
export class HeadStaffTypeDropdownComponent implements OnInit {
  @Output() selectedChanged = new EventEmitter();
  types;
  constructor(
    private campService: CampsService
  ) { }

  populateTypes(){
    this.campService.getOptions().subscribe(data=>{
      this.types = data.options.headStaff_types;
      this.selectedChanged.emit(this.types[0]);
    });
    
  }

  handleChange(e){
    this.selectedChanged.emit(this.types[e.target.value]);
  }

  ngOnInit() {
    this.populateTypes();
  }
}