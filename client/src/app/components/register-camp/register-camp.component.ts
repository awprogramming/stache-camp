import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-register-camp',
  templateUrl: './register-camp.component.html',
  styleUrls: ['./register-camp.component.css']
})
export class RegisterCampComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  form: FormGroup;
  previousUrl;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) {
    this.createForm(); // Create Register Form when component is constructed
  }

  // Function to create registration form
  createForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required], // Username field
      admin_username:['', Validators.required],
      admin_email: ['', Validators.required], // Password field
      admin_password: ['',Validators.required]
    });
  }

  // Function to disable form
  disableForm() {
    this.form.controls['name'].disable(); // Disable username field
    this.form.controls['admin_username'].disable(); // Enable password field
    this.form.controls['admin_email'].disable(); // Disable password field
    this.form.controls['admin_password'].enable(); // Enable password field
  }

  // Function to enable form
  enableForm() {
    this.form.controls['name'].enable(); // Enable username field
    this.form.controls['admin_username'].enable(); // Enable password field
    this.form.controls['admin_email'].enable(); // Enable password field
    this.form.controls['admin_password'].enable(); // Enable password field
  }

  // Functiont to submit form and login user
  onRegistrationSubmit() {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm(); // Disable form while being process
    // Create user object from user's input
    const camp = {
      name: this.form.get('name').value, // Username input field
      admin_username: this.form.get('admin_username').value, // Password input field
      admin_email: this.form.get('admin_email').value, // Password input field
      admin_password: this.form.get('admin_password').value
    }
    //Function to send login data to API
    this.authService.registerCamp(camp).subscribe(data => {
      // Check if response was a success or error
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = data.message; // Set error message
        this.processing = false; // Enable submit button
        this.enableForm(); // Enable form for editting
      } else {
        this.messageClass = 'alert alert-success'; // Set bootstrap success class
        this.message = data.message; // Set success message
        // After 2 seconds, redirect to dashboard page
        setTimeout(() => {
          if(this.previousUrl)
            this.router.navigate([this.previousUrl]);
          else
            this.router.navigate(['/camps']); // Navigate to dashboard view
        }, 2000);
      }
    });
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