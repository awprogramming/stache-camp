import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { CampsComponent } from '../camps/camps.component';
import { CampsService } from '../../services/camps.service';

@Component({
  selector: 'app-divisions-dropdown',
  templateUrl: './divisions-dropdown.component.html',
  styleUrls: ['./divisions-dropdown.component.css']
})
export class DivisionsDropdownComponent implements OnInit {

  @Output() selectedChanged = new EventEmitter();
  divisions;
  constructor(
    private campService: CampsService
  ) { }

  populateDivisions(){
    this.campService.getAllDivisions().subscribe(data=>{
      this.divisions = data.divisions;
      this.selectedChanged.emit(this.divisions[0]);
    });
    
  }

  handleChange(e){
    this.selectedChanged.emit(this.divisions[e.target.value]);
  }

  ngOnInit() {
    this.populateDivisions();
  }

}