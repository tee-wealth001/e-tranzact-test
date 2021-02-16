import { get } from 'lodash';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  concatMap,
  map,
  switchMap,
  mergeMap,
  filter,
  withLatestFrom,
} from 'rxjs/operators';
import { routerNavigatedAction } from '@ngrx/router-store';
import { PaymentService } from '../services/payment.service';
import {
  load,
  loadSuccess,
  payWithCard,
  payWithCardError,
  payWithCardSuccess,
} from './actions';
import { Router } from '@angular/router';

@Injectable()
export class CreditCardPaymentStoreEffects {
  constructor(
    private dataService: PaymentService,
    private router: Router,
    private actions$: Actions
  ) {}

  proceedPayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(payWithCard),
      concatMap((action) => {
        return of(action).pipe(withLatestFrom());
      }),
      mergeMap(([action]) => {
        const { paymentData } = action;
        let returnedAction;
        return this.dataService.makePayment(paymentData).pipe(
          map((response) => {
            if (response.body.status === 'success') {
              this.router.navigate([''])
              returnedAction = payWithCardSuccess({creditCardData: paymentData});
            } else {
              returnedAction = payWithCardError({
                error: 'Something went wrong please try again',
              });
            }
            return returnedAction;
          }),
          catchError((error) => of(payWithCardError({ error })))
        );
      })
    )
  );
}
