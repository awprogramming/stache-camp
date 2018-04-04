import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { SportsService } from '../../services/sports.service';

@Component({
  selector: 'app-roster-dropdown',
  templateUrl: './roster-dropdown.component.html',
  styleUrls: ['./roster-dropdown.component.css']
})
export class RosterDropdownComponent implements OnInit {

  @Input() specialtyId: String;
  @Output() selectedChanged = new EventEmitter();
  rosters;
  constructor(
    private sportsService: SportsService
  ) { }

  populateRosters(){
    this.sportsService.getSpecialtyRosters(this.specialtyId).subscribe(data=>{
        this.rosters = data.rosters;
        this.selectedChanged.emit(this.rosters[0]);
    });
    
  }

  handleChange(e){
    this.selectedChanged.emit(this.rosters[e.target.value]);
  }

  ngOnInit() {
    this.populateRosters();
  }

}