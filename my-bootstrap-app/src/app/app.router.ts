import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { FormComponent } from './form/form.component';
import { AuthguardGuard } from './authguard.guard';
import { NotfoundComponent } from './notfound/notfound.component';

export const router: Routes = [
	{path: '', redirectTo:'home', pathMatch: 'full'},
	{path: 'products/:method/:numberOfPage', component: ProductsComponent , canActivate: [AuthguardGuard]},
	{path: 'products', component: ProductsComponent , canActivate: [AuthguardGuard]},
	{path: 'cart', component: CartComponent, canActivate: [AuthguardGuard] },
	{path: 'contact', component: ContactComponent },
	{path: 'home', component: HomeComponent },
	{path: 'form/:formMethod', component: FormComponent },
	{path: '**', component: NotfoundComponent }

];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);



//Children router//
//children:[
		//{path: ':method/:numberOfPage', component: ProductsComponent},
	//]