import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { RegisterComponent } from './components/register/register.component';
import { PropertyEditComponent } from './components/property-edit/property-edit.component';
import { PropertyAddComponent } from './components/property-add/property-add.component';
import { FavoritesComponent } from './components/favoritos/favoritos.component';
import { AdminGuard } from './guard/admin.guard';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'property/:id', component: PropertyDetailComponent },
  { path: 'about', component: AboutComponent },
  { path: 'propertyAdd', component: PropertyAddComponent, canActivate: [AdminGuard] },
  { path: 'propertyEdit/:id', component: PropertyEditComponent, canActivate: [AdminGuard] }, 
  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] }, 
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
