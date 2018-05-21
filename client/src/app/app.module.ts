import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
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
import { MedsComponent } from './components/meds/meds.component';
import { MedsService } from './services/meds.service';
import { DietaryComponent } from './components/dietary/dietary.component';
import { CalendarComponent } from './components/calendar/calendar.component';
//calendar stuff
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'angular-calendar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimepickerComponent } from './components/timepicker/timepicker.component';
import { GameCalendarComponent } from './components/game-calendar/game-calendar.component';
import { GameComponent } from './components/game/game.component';
import { RosterDropdownComponent } from './components/roster-dropdown/roster-dropdown.component';
import { CounselorSelectorComponent } from './components/counselor-selector/counselor-selector.component';
import { LifeguardComponent } from './components/lifeguard/lifeguard.component';
import { LifeguardDropdownComponent } from './components/lifeguard-dropdown/lifeguard-dropdown.component';
import { SwimGroupsComponent } from './components/swim-groups/swim-groups.component';
import { SwimService } from './services/swim.service';
import { SwimGroupComponent } from './components/swim-group/swim-group.component';
import { SwimStatsComponent } from './components/swim-stats/swim-stats.component';
import { SwimLevelsComponent } from './components/swim-levels/swim-levels.component';
import { SwimLevelComponent } from './components/swim-level/swim-level.component';
import { SwimStatComponent } from './components/swim-stat/swim-stat.component';
import { SwimLevelDropdownComponent } from './components/swim-level-dropdown/swim-level-dropdown.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { SwimReportComponent } from './components/swim-report/swim-report.component';
import { HeadStaffProfileComponent } from './components/head-staff-profile/head-staff-profile.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';

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
    MedsComponent,
    DietaryComponent,
    CalendarComponent,
    TimepickerComponent,
    GameCalendarComponent,
    GameComponent,
    RosterDropdownComponent,
    CounselorSelectorComponent,
    LifeguardComponent,
    LifeguardDropdownComponent,
    SwimGroupsComponent,
    SwimGroupComponent,
    SwimStatsComponent,
    SwimLevelsComponent,
    SwimLevelComponent,
    SwimStatComponent,
    SwimLevelDropdownComponent,
    BackButtonComponent,
    SwimReportComponent,
    HeadStaffProfileComponent,
    PasswordResetComponent,

  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
  ],
  providers: [AuthService, CampsService, ModuleService, AuthGuard, NotAuthGuard, SuperUserGuard, AdminGuard, AdminOrUserGuard, ModuleGuard,EvaluationsService,SportsService,MedsService,HttpClient,SwimService],
  bootstrap: [AppComponent]
})
export class AppModule { }