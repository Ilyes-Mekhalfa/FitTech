import { Routes } from '@angular/router';
import { LoginComponent } from './pages/authentication/authentication';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { ResetPassword } from './pages/reset-password/reset-password';
import { ForgetPassword } from './pages/forget-password/forget-password';
import { Coach } from './pages/coach/coach';
import { Member } from './pages/member/member';
import { Plan } from './pages/plan/plan';
import { Settings } from './pages/settings/settings';
import { CreateCoach } from './shared/components/create-coach/create-coach';
import { CreateMember } from './shared/components/create-member/create-member';
import { canDeactivateGuard } from './core/guards/can-deactivate.guard';
import { authGuardGuard } from './core/guards/auth.guard-guard';
import { CreatePlan } from './shared/components/create-plan/create-plan';
import { Machine} from './pages/machine/machine';
import { LandingPage } from './pages/landing-page/landing-page';
import { DailyToken } from './shared/components/daily-token/daily-token'
export const routes: Routes = [
    {
        path: '',
        component: LandingPage,

        pathMatch: 'full'
    },
    {
        path: 'forget-password',
        component: ForgetPassword
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'reset-password',
        component: ResetPassword
    },
    {
        path: 'admin-dashboard',
        canActivate: [authGuardGuard],
        canDeactivate: [canDeactivateGuard],
        component: AdminDashboard,
    },
    {
        path: 'coach',
        canActivate: [authGuardGuard],
        canDeactivate: [canDeactivateGuard],
        component: Coach,
    },
    {
        path: 'coach/add',
        canActivate: [authGuardGuard],
        canDeactivate: [canDeactivateGuard],
        component: CreateCoach
    },
    {
        path: 'member',
        canActivate: [authGuardGuard],
        canDeactivate: [canDeactivateGuard],
        component: Member,
    },
    {
        path: "member/add",
        canActivate: [authGuardGuard],
        canDeactivate: [canDeactivateGuard],
        component: CreateMember,
    },
    {
        path: 'plan',
        canActivate: [authGuardGuard],
        canDeactivate: [canDeactivateGuard],
        component: Plan,
    },
    {
        path: 'plan/add',
        canActivate: [authGuardGuard],
        canDeactivate: [canDeactivateGuard],
        component: CreatePlan,
    },
    {
        path: 'machine',
        canActivate: [authGuardGuard],
        canDeactivate: [canDeactivateGuard],
        component: Machine,
    },
    {
        path: 'settings',
        canActivate: [authGuardGuard],
        canDeactivate: [canDeactivateGuard],
        component: Settings,
    },
    {
        path: 'dailyToken',
        canActivate: [authGuardGuard],
        canDeactivate: [canDeactivateGuard],
        component: DailyToken,
    }
];