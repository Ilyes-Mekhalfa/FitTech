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
        component: AdminDashboard,
    },
    {
        path: 'coach',
        component: Coach,
    },
    {
        path: 'coach/add',
        canDeactivate: [canDeactivateGuard],
        component: CreateCoach
    },
    {
        path: 'member',
        component: Member,
    },
    {
        path: "member/add",
        component: CreateMember,
    },
    {
        path: 'plan',
        component: Plan,
    },
    {
        path: 'plan/add',
        // canDeactivate: [canDeactivateGuard],
        component: CreatePlan,
    },
    {
        path: 'machine',
        component: Machine,
    },
    {
        path: 'settings',
        component: Settings,
    },
    {
        path: 'dailyToken',
        component: DailyToken,
    }
];