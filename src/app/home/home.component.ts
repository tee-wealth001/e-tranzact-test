import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CreditCardState } from '../models/credit-card.interface';
import { CreditCardPaymentFacade } from '../store/facade';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    title:string = '';
    creditCard$: Observable<CreditCardState>;

    cardHolder:string = '';
    creditCardNumber:string = '';
    expirationDate:Date; 
    securityCode:string = ''; 
    amount:number; 

    constructor(private router: Router, private creditCardPaymentFacade: CreditCardPaymentFacade) {
        this.creditCard$ = this.creditCardPaymentFacade.data$;

    }


    ngOnInit(){
        this.title = 'e-tranzact';
        this.creditCard$.subscribe(data => {
            console.log("data >>>>>>>>>",data);
            this.cardHolder = data.cardHolder;
            this.creditCardNumber = data.creditCardNumber;
            this.expirationDate = data.expirationDate;
            this.securityCode = data.securityCode;
            this.amount = data.amount;
            
        })
    }

    

}