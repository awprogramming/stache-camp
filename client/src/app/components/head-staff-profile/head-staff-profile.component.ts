import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { EvaluationsService } from '../../services/evaluations.service';
import { CampsService } from '../../services/camps.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-head-staff-profile',
  templateUrl: './head-staff-profile.component.html',
  styleUrls: ['./head-staff-profile.component.css']
})
export class HeadStaffProfileComponent implements OnInit {
  user;

  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.user = params.get('headId');
      });
  }

}

