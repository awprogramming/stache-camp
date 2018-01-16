import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CampsService } from '../../services/camps.service'
import { ModuleService } from '../../services/module.service';

@Component({
  selector: 'app-camps',
  templateUrl: './camps.component.html',
  styleUrls: ['./camps.component.css']
})
export class CampsComponent implements OnInit {

  camps;

  constructor(
    private authService: AuthService,
    private campsService: CampsService,
    private moduleService: ModuleService
  ) { }

  getAllCamps(){
    this.campsService.getAllCamps().subscribe(data => {
      this.camps = data.camps;
    })
  }

  showAddModule(camp){
    camp.hideAdd = true;
  }

  addModule(camp){
    console.log(camp.toAdd);
  }

  preAdd(e,camp){
    camp.toAdd = e;
  }

  ngOnInit() {
    this.getAllCamps();
  }

}
