import { HomeComponent } from './components/pages/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './components/pages/signin/signin.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { AuthGuardService as AuthGuard } from './providers/auth-guard.service';

const routes: Routes = [
    { path: 'signin', component: SigninComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]  },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]  },
    { path: '**', redirectTo: '/home' }
  ];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
