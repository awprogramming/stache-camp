import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { CampsComponent } from '../camps/camps.component';
import { CampsService } from '../../services/camps.service';

@Component({
  selector: 'app-lifeguard-dropdown',
  templateUrl: './lifeguard-dropdown.component.html',
  styleUrls: ['./lifeguard-dropdown.component.css']
})
export class LifeguardDropdownComponent implements OnInit {
  @Input() addAll: String;
  @Output() selectedChanged = new EventEmitter();
  lifeguards;
  constructor(
    private campService: CampsService
  ) { }

  populateTypes(){
    this.campService.getAllLifeguards().subscribe(data=>{
      this.lifeguards = data.lifeguards['Lifeguard'];
      if(this.addAll){
        this.lifeguards.unshift({
          first:"All",
          last:"Lifeguards"
        })
      }
      else if(this.lifeguards && this.lifeguards.length > 0){
        this.selectedChanged.emit(this.lifeguards[0]);
      }
      
    });
    
  }

  handleChange(e){
    this.selectedChanged.emit(this.lifeguards[e.target.value]);
  }

  ngOnInit() {
    this.populateTypes();
  }
}