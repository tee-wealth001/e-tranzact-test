import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { CardPaymentComponent } from './card-payment/card-payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PaymentService } from './services/payment.service';
import { HomeComponent } from './home/home.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import * as storeModuleConfiguration from './store';
import { CreditCardPaymentStoreEffects } from './store/effects';
import { CreditCardPaymentFacade } from './store/facade';
// import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [
    AppComponent,
    CardPaymentComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    EffectsModule.forRoot(),
    StoreModule.forRoot({}),
    StoreModule.forFeature(storeModuleConfiguration.moduleFeatureKey, storeModuleConfiguration.moduleReducers),
    EffectsModule.forFeature([CreditCardPaymentStoreEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    AppRoutingModule
  ],
  providers: [PaymentService, CreditCardPaymentFacade, CreditCardPaymentStoreEffects],
  bootstrap: [AppComponent]
})
export class AppModule { }
