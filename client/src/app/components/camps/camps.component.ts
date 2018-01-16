import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CampsService } from '../../services/camps.service'
@Component({
  selector: 'app-camps',
  templateUrl: './camps.component.html',
  styleUrls: ['./camps.component.css']
})
export class CampsComponent implements OnInit {

  camps;
  constructor(
    private authService: AuthService,
    private campsService: CampsService
  ) { }

  getAllCamps(){
    this.campsService.getAllCamps().subscribe(data => {
      this.camps = data.camps;
    })
  }
  ngOnInit() {
    this.getAllCamps();
  }

}
