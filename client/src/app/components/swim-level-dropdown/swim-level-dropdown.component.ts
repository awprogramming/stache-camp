
import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { SwimService } from '../../services/swim.service';

@Component({
  selector: 'app-swim-level-dropdown',
  templateUrl: './swim-level-dropdown.component.html',
  styleUrls: ['./swim-level-dropdown.component.css']
})
export class SwimLevelDropdownComponent implements OnInit {

  @Output() selectedChanged = new EventEmitter();
  @Input() all: Boolean;

  levels;
  constructor(
    private swimService: SwimService
  ) { }

  populateLevels(){
    this.swimService.allLevels().subscribe(data=>{
      this.levels = data.levels;
      if(this.all)
        this.selectedChanged.emit("all");
      else
        this.selectedChanged.emit(this.levels[0]);
    });
    
  }

  handleChange(e){
    if(this.all && e.target.value == "all" ){
      this.selectedChanged.emit("all");
    }
    else{
      this.selectedChanged.emit(this.levels[e.target.value]);
    }
    
  }

  ngOnInit() {
    this.populateLevels();
  }

}