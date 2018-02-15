import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { SuperUserGuard } from './guards/superuser.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminOrUserGuard } from './guards/adminOrUser.guard';
import { RegisterCampComponent } from './components/register-camp/register-camp.component';
import { CampsComponent } from './components/camps/camps.component';
import { CampsService } from './services/camps.service';
import { ModuleService } from './services/module.service';
import { ModuleComponent } from './components/module/module.component';
import { ModuleDropdownComponent } from './components/module-dropdown/module-dropdown.component';
import { CounselorsComponent } from './components/counselors/counselors.component';
import { DivisionsComponent } from './components/divisions/divisions.component';
import { DivisionsDropdownComponent } from './components/divisions-dropdown/divisions-dropdown.component';
import { HeadStaffComponent } from './components/head-staff/head-staff.component';
import { HeadStaffDropdownComponent } from './components/head-staff-dropdown/head-staff-dropdown.component';
import { SpecialtiesComponent } from './components/specialties/specialties.component';
import { SpecialtiesDropdownComponent } from './components/specialties-dropdown/specialties-dropdown.component';
import { OptionsComponent } from './components/options/options.component';
import { CounselorTypesDropdownComponent } from './components/counselor-types-dropdown/counselor-types-dropdown.component';
import { ModuleGuard } from './guards/module.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    LoginComponent,
    RegisterCampComponent,
    CampsComponent,
    ModuleComponent,
    ModuleDropdownComponent,
    CounselorsComponent,
    DivisionsComponent,
    DivisionsDropdownComponent,
    HeadStaffComponent,
    HeadStaffDropdownComponent,
    SpecialtiesComponent,
    SpecialtiesDropdownComponent,
    OptionsComponent,
    CounselorTypesDropdownComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [AuthService, CampsService, ModuleService, AuthGuard, NotAuthGuard, SuperUserGuard, AdminGuard, AdminOrUserGuard, ModuleGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
