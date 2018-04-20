import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { SwimService } from '../../services/swim.service';
import { CampsService } from '../../services/camps.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-swim-level',
  templateUrl: './swim-level.component.html',
  styleUrls: ['./swim-level.component.css']
})
export class SwimLevelComponent implements OnInit {
  id;
  counselorId;
  form: FormGroup;
  swimLevel;
  options;
  addAnimal = false;
  exitSkill;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private swimService: SwimService,
    private campsService: CampsService,
    private authService: AuthService,
    private router: Router,
  ) { 
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      aName: ['', Validators.required],
    });
  }

  createAnimalSubmit(){
    this.addAnimal = false;
    var swimAnimal = {
      name: this.form.get('aName').value,
    }

    this.swimService.registerSwimAnimal(this.id,swimAnimal).subscribe(data => {
     this.loadSwimLevel();
    });
  }

  loadSwimLevel(){
    this.swimService.getSwimLevel(this.id).subscribe(data => {
      console.log(data);
      this.swimLevel = data.level;
    });
  }

  getOptions(){
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options
      this.loadSwimLevel();
    });
  }

  preAddSkill(e,animal){
    animal.addSkill = e.target.value;
  }

  addSkill(animal){
    this.swimService.registerAnimalSkill(this.id,animal).subscribe(data => {
      this.loadSwimLevel();
     });
  }

  preAddExitSkill(e){
    this.exitSkill = e.target.value;
  }

  addExitSkill(){
    this.swimService.registerExitSkill(this.id,this.exitSkill).subscribe(data => {
      this.loadSwimLevel();
     });
  }
  ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.id = params.get('levelId');
        this.getOptions();
      });
  }

}

