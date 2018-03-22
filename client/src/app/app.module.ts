import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
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
import { EvaluationsService } from './services/evaluations.service';
import { EvaluationsComponent } from './components/evaluations/evaluations.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { HeadStaffTypeDropdownComponent } from './components/head-staff-type-dropdown/head-staff-type-dropdown.component';
import { EvaluateComponent } from './components/evaluate/evaluate.component';
import { ApproversComponent } from './components/approvers/approvers.component';
import { EvalArchiveComponent } from './components/eval-archive/eval-archive.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CampersComponent } from './components/campers/campers.component';
import { RostersComponent } from './components/rosters/rosters.component';
import { SportsService } from './services/sports.service';
import { RosterComponent } from './components/roster/roster.component';
import { CamperSelectorComponent } from './components/camper-selector/camper-selector.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
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
    EvaluationsComponent,
    QuestionsComponent,
    HeadStaffTypeDropdownComponent,
    EvaluateComponent,
    ApproversComponent,
    EvalArchiveComponent,
    DashboardComponent,
    CampersComponent,
    RostersComponent,
    RosterComponent,
    CamperSelectorComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [AuthService, CampsService, ModuleService, AuthGuard, NotAuthGuard, SuperUserGuard, AdminGuard, AdminOrUserGuard, ModuleGuard,EvaluationsService,SportsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
