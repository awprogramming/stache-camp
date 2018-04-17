import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { SwimService } from '../../services/swim.service';
import { CampsService } from '../../services/camps.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-swim-group',
  templateUrl: './swim-group.component.html',
  styleUrls: ['./swim-group.component.css']
})
export class SwimGroupComponent implements OnInit {
  id;
  counselorId;
  swimGroup;
  options;

  constructor(
    private route: ActivatedRoute,
    private swimService: SwimService,
    private campsService: CampsService,
    private authService: AuthService,
    private router: Router,
  ) {}

  loadSwimGroup(){
    this.swimService.getSwimGroup(this.id).subscribe(data => {
      this.swimGroup = data.group;
    });
  }

  getOptions(){
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options
      this.loadSwimGroup();
    });
  }

  ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.id = params.get('groupId');
        this.getOptions();
      });
  }

}

