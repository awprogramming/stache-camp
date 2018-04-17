import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterCampComponent } from './components/register-camp/register-camp.component';
import { CampsComponent } from './components/camps/camps.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { AdminGuard } from './guards/admin.guard';
import { SuperUserGuard } from './guards/superuser.guard';
import { ModuleComponent } from './components/module/module.component';
import { CounselorsComponent } from './components/counselors/counselors.component';
import { DivisionsComponent } from './components/divisions/divisions.component';
import { HeadStaffComponent } from './components/head-staff/head-staff.component';
import { AdminOrUserGuard } from './guards/adminOrUser.guard';
import { SpecialtiesComponent } from './components/specialties/specialties.component';
import { OptionsComponent } from './components/options/options.component';
import { ModuleGuard } from './guards/module.guard';
import { EvaluationsComponent } from './components/evaluations/evaluations.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { EvaluateComponent } from './components/evaluate/evaluate.component';
import { ApproversComponent } from './components/approvers/approvers.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CampersComponent } from './components/campers/campers.component';
import { RostersComponent } from './components/rosters/rosters.component';
import { RosterComponent } from './components/roster/roster.component';
import { MedsComponent } from './components/meds/meds.component';
import { DietaryComponent } from './components/dietary/dietary.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { GameCalendarComponent } from './components/game-calendar/game-calendar.component';
import { GameComponent } from './components/game/game.component';
import { SwimGroupsComponent } from './components/swim-groups/swim-groups.component';
import { SwimGroupComponent } from './components/swim-group/swim-group.component';
import { SwimStatsComponent } from './components/swim-stats/swim-stats.component';
import { SwimStatComponent } from './components/swim-stat/swim-stat.component';
import { SwimLevelsComponent } from './components/swim-levels/swim-levels.component';
import { SwimLevelComponent } from './components/swim-level/swim-level.component';


const appRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'register-camp',
        component: RegisterCampComponent,
        canActivate: [AuthGuard, SuperUserGuard]
    },
    {
        path: 'camps',
        component: CampsComponent,
        canActivate: [AuthGuard, SuperUserGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NotAuthGuard]
    },
    {
        path: 'modules',
        component: ModuleComponent,
        canActivate: [AuthGuard, SuperUserGuard]
    },
    {
        path: 'counselors',
        component: CounselorsComponent,
        canActivate: [AuthGuard, AdminOrUserGuard]
    },
    {
        path: 'divisions',
        component: DivisionsComponent,
        canActivate: [AuthGuard, AdminGuard]
    },
    {
        path: 'head-staff',
        component: HeadStaffComponent,
        canActivate: [AuthGuard, AdminGuard]
    },
    {
        path: 'specialties',
        component: SpecialtiesComponent,
        canActivate: [AuthGuard, AdminGuard]
    },
    {
        path: 'options',
        component: OptionsComponent,
        canActivate: [AuthGuard,AdminGuard]
    },
    {
        path:'evaluations',
        component: EvaluationsComponent,
        canActivate: [AuthGuard,ModuleGuard],
        data: {module: 'eval'}
    },
    {
        path:'questions',
        component: QuestionsComponent,
        canActivate: [AuthGuard,ModuleGuard],
        data: {module: 'eval'}
    },
    {
        path:'evaluate/:counselorId/:evaluationId/:type',
        component: EvaluateComponent,
        canActivate: [AuthGuard,ModuleGuard],
        data: {module: 'eval'}
    },
    {
        path: 'approvers',
        component: ApproversComponent,
        canActivate: [AuthGuard,ModuleGuard],
        data: {module: 'eval'}
    },
    {
        path: 'campers',
        component: CampersComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'rosters',
        component: RostersComponent,
        canActivate: [AuthGuard,ModuleGuard],
        data: {module: 'sports'}
    },
    {
        path:'roster/:sdId/:rosterId/:internal',
        component: RosterComponent,
        canActivate: [AuthGuard,ModuleGuard],
        data: {module: 'sports'}
    },
    {
        path:'calendar',
        component: GameCalendarComponent,
        canActivate: [AuthGuard,ModuleGuard],
        data: {module: 'sports'}
    },
    {
        path:'game/:id',
        component: GameComponent,
        canActivate: [AuthGuard,ModuleGuard],
        data: {module: 'sports'}
    },
    {
        path:'swim-groups',
        component: SwimGroupsComponent,
        canActivate: [AuthGuard,ModuleGuard],
        data: {module: 'swim'}
    },
    {
        path:'swim-group/:groupId',
        component: SwimGroupComponent,
        canActivate: [AuthGuard,ModuleGuard],
        data: {module: 'swim'}
    },
    {
        path:'swim-stats',
        component: SwimStatsComponent,
        canActivate: [AuthGuard,ModuleGuard],
        data: {module: 'swim'}
    },
    {
        path:'swim-stat/:camperId',
        component: SwimStatComponent,
        canActivate: [AuthGuard,ModuleGuard],
        data: {module: 'swim'}
    },
    {
        path:'swim-levels',
        component: SwimLevelsComponent,
        canActivate: [AuthGuard,ModuleGuard],
        data: {module: 'swim'}
    },
    {
        path:'swim-level/:levelId',
        component: SwimLevelComponent,
        canActivate: [AuthGuard,ModuleGuard],
        data: {module: 'swim'}
    },
    {
        path: 'meds',
        component: MedsComponent,
        canActivate: [AuthGuard,ModuleGuard],
        data: {module: 'meds'}
    },
    {
        path: 'dietary',
        component: DietaryComponent,
        canActivate: [AuthGuard,ModuleGuard],
        data: {module: 'meds'}
    },
    {   path: '**', 
        component: LoginComponent,
        canActivate: [NotAuthGuard]
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(appRoutes)],
    providers: [],
    bootstrap: [],
    exports: [RouterModule]
})
export class AppRoutingModule {}