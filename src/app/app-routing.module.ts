import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NewbusinesscardComponent } from './newbusinesscard/newbusinesscard.component';
import { WebcamComponent } from './webcam/webcam.component';
import { BusinesscardComponent } from './businesscard/businesscard.component';
import { SearchComponent } from './search/search.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomePage } from './home/home.page';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomePage,
      data: {animation: 'Home'} },
    { path: 'login', component: LoginComponent,
      data: {animation: 'Login'} },
    { path: 'not-found', component: NotFoundComponent,
      data: {animation: 'NotFound'} },
    { path: 'add-card', component: NewbusinesscardComponent,
      data: {animation: 'AddCard'}, canActivate: [AuthGuard] },
    { path: 'webcam', component: WebcamComponent,
      data: {animation: 'WebCam'}, canActivate: [AuthGuard] },
    { path: 'card', component: BusinesscardComponent,
      data: {animation: 'Card'}, canActivate: [AuthGuard] },
    { path: 'search', component: SearchComponent,
      data: {animation: 'Search'}, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
