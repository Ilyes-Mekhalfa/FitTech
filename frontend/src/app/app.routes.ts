import { Routes } from '@angular/router';
import { LoginComponent } from './pages/authentication/authentication';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';

export const routes: Routes = [
    {
        path: '',
        redirectTo:'home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'admin-dashboard',
        component: AdminDashboard,
    }
];