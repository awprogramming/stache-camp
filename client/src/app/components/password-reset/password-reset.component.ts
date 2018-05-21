import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';
import { EvaluationsService } from '../../services/evaluations.service';
import { SwimService } from '../../services/swim.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent  implements OnInit {
  
  @Input() user: String;
  options;
  messageClass;
  message;
  previousUrl;
  newPasswordForm;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) {
    this.createForm();
  }

  createForm() {
    this.newPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
    });
  }
  onNewPasswordSubmit(){
    const newPassword = {
      user_id: this.user,
      password: this.newPasswordForm.get('password').value
    }
    if(newPassword.password.length == 0){
      this.messageClass = 'alert alert-danger'; // Set bootstrap error class
      this.message = "Please enter a new password"; // Set error message
    }
    else{
      this.authService.changePassword(newPassword).subscribe(data => {
        if (!data.success) {
          this.messageClass = 'alert alert-danger'; // Set bootstrap error class
          for(let error of Object.keys(data.message)){
            this.message = data.message[error].message;
          }
            //this.message = error.message;
        } else {
          this.messageClass = 'alert alert-success'; // Set bootstrap success class
          this.message = data.message; // Set success message
        }
      });
    }
  }  

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
  }

}

