import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CampsService } from '../../services/camps.service'
import { ModuleService } from '../../services/module.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-camps',
  templateUrl: './camps.component.html',
  styleUrls: ['./camps.component.css']
})
export class CampsComponent implements OnInit {

  camps;
  messageClass;
  message;
  previousUrl;

  constructor(
    private authService: AuthService,
    private campsService: CampsService,
    private moduleService: ModuleService,
    private router: Router
  ) { }

  getAllCamps(){
    this.campsService.getAllCamps().subscribe(data => {
      this.camps = data.camps;
    })
  }

  showAddModule(camp){
    camp.hideAdd = true;
  }
  hideAddModule(camp){
    camp.hideAdd = false;
  }

  addModule(camp){
    const toAdd = {
      _id:camp._id,
      toAdd:camp.toAdd
    }
    this.campsService.activateModule(toAdd).subscribe(data => {
      this.hideAddModule(camp);
      this.getAllCamps();
      // if (!data.success) {
      //   this.messageClass = 'alert alert-danger';
      //   this.message = data.message;
      // } else {
      //   this.messageClass = 'alert alert-success';
      //   this.message = data.message;
      //   console.log(this.message);
      //   this.hideAddModule(camp);
      // }
    });
  }

  preAdd(e,camp){
    camp.toAdd = e;
  }

  ngOnInit() {
    this.getAllCamps();
  }

}
