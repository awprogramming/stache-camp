import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-camper',
  templateUrl: './camper.component.html',
  styleUrls: ['./camper.component.css']
})
export class CamperComponent implements OnInit {

  id;
  camper;
  messageClass;
  message;
  processing = false;
  form: FormGroup;
  parentForm:FormGroup;
  bulkAddForm: FormGroup;
  previousUrl;
  newCamp = false;
  bulkAdd = false;
  campers;
  uploaded_campers;
  divisions;
  sessions;
  allSessions;
  enrolled;
  toAddType;
  options;
  dropdownDivisions;
  toMassReenroll = [];
  loading;
  divisionShowing = {
    name:"Show All"
  };
  genderShowing = "all";

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private campsService: CampsService,
    public authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) { 
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      pID:['', Validators.required],
      first: ['', Validators.required],
      last:['', Validators.required],
      gender: ['', Validators.required]
    });

    this.parentForm = this.formBuilder.group({
      pID:['', Validators.required],
      first: ['', Validators.required],
      last:['', Validators.required],
      p1Name: '',
      p1Email: '',
      p2Name: '',
      p2Email: '',
      gender: ['', Validators.required]
    });
  }

  onRegistrationSubmit() {
    this.loading = true;
    this.processing = true;
    var camper;
    if(!this.campsService.hasModule("swim")){
      camper = {
        _id: this.form.get('pID').value,
        first: this.form.get('first').value,
        last: this.form.get('last').value,
        gender: this.form.get('gender').value,
      }
    }
    else{
      camper = {
        _id: this.parentForm.get('pID').value,
        first: this.parentForm.get('first').value,
        last: this.parentForm.get('last').value,
        p1Name: this.parentForm.get('p1Name').value,
        p1Email: this.parentForm.get('p1Email').value,
        p2Name: this.parentForm.get('p2Name').value,
        p2Email: this.parentForm.get('p2Email').value,
        gender: this.parentForm.get('gender').value,
      }
      console.log(camper)
    }
    this.campsService.editCamper(camper).subscribe(data => {
      this.loadCamper();
    });
  }

  loadCamper(){
    this.campsService.getCamper(this.id).subscribe(data=>{
      this.camper = data.camper;
      this.camper.gender = this.camper.gender.toLowerCase();
      console.log(this.camper.gender);
      this.fillForms();
    });
  }
  
  fillForms(){
    this.form = this.formBuilder.group({
      pID:this.camper._id,
      first:this.camper.first,
      last:this.camper.last,
      gender:this.camper.gender,
    });

    this.parentForm = this.formBuilder.group({
      pID:this.camper._id,
      first:this.camper.first,
      last:this.camper.last,
      p1Name:this.camper.p1Name,
      p1Email:this.camper.p1Email,
      p2Name:this.camper.p2Name,
      p2Email:this.camper.p2Email,
      gender:this.camper.gender,
    });
    this.loading = false;
  }
  populateDivisions(){
    this.loading = true;
    this.campsService.getAllDivisions().subscribe(data=>{
      this.dropdownDivisions = []
      for(let gender of data.divisions)
        this.dropdownDivisions[gender._id.gender] = gender.divisions;
      if(this.authService.admin()){
        this.dropdownDivisions["female"].unshift({
          name:"Show All"
        });
        this.dropdownDivisions["male"].unshift({
          name:"Show All"
        });
      }
      this.loading = false;
      // if(this._gender=="female")
      //   this.divisions = data.divisions[0].divisions;
      // else if(this._gender=="male")
      //   this.divisions = data.divisions[1].divisions;
      
      // this.selectedChanged.emit(this.divisions[0]);
    });
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.loadCamper();
      this.populateDivisions();
    });
  }

}

