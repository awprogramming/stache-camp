import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from "ngx-simple-modal";
import { SimpleModalService } from "ngx-simple-modal";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  constructor(
    private simpleModalService:SimpleModalService
  ) { }

  ngOnInit() {
    
  }

}
