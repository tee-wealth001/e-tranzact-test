import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
// import { CreditCardPaymentFacade } from '../store/facade';
// import { currentDate } from '../store/reducer';
import { PaymentService } from '../services/payment.service';
import { YearModel } from '../models/year-model.class';
import { MonthModel } from '../models/month-model.class';
import { Router } from '@angular/router';
import { CreditCardPaymentFacade } from '../store/facade';

@Component({
  selector: 'app-card-payment',
  templateUrl: './card-payment.component.html',
  styleUrls: ['./card-payment.component.css']
})
export class CardPaymentComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();

  paymentForm: FormGroup;
  errorMessage: string;
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth() + 1;
  currentYear = this.currentDate.getFullYear();

  months: MonthModel[] = [
    { id: 1, monthNumber: "01", monthTitle: "JAN" },
    { id: 2, monthNumber: "02", monthTitle: "FEB" },
    { id: 3, monthNumber: "03", monthTitle: "MAR" },
    { id: 4, monthNumber: "04", monthTitle: "APR" },
    { id: 5, monthNumber: "05", monthTitle: "MAY" },
    { id: 6, monthNumber: "06", monthTitle: "JUN" },
    { id: 7, monthNumber: "07", monthTitle: "JUL" },
    { id: 8, monthNumber: "08", monthTitle: "AUG" },
    { id: 9, monthNumber: "09", monthTitle: "SEP" },
    { id: 10, monthNumber: "10", monthTitle: "OCT" },
    { id: 11, monthNumber: "11", monthTitle: "NOV" },
    { id: 12, monthNumber: "12", monthTitle: "DEC" },
  ]

  years: YearModel[] = [
    { id: 1, year: 2019 },
    { id: 2, year: 2020 },
    { id: 3, year: 2021 },
    { id: 4, year: 2022 },
    { id: 5, year: 2023 },
    { id: 5, year: 2024 },
    { id: 6, year: 2025 },
  ]

  constructor(
    private formBuilder: FormBuilder,
    private facade: CreditCardPaymentFacade, 
    private paymentService: PaymentService,
    private _router:Router,
    private _toastr: ToastrService) { }

  ngOnInit() {
    this.errorMessage = "Please Fill all fields";
    this.buildForm();
  }



  buildForm() {
    this.paymentForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      nameOnCard: ['', [Validators.required, Validators.minLength(1), Validators.pattern('^[A-Za-z][A-Za-z -]*$')]],
      cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.min(1111111111111111), Validators.max(9999999999999999)]],
      expirationMonth: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.min(this.currentMonth), Validators.max(12)]],
      expirationYear: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.min(this.currentYear), Validators.max(9999)]],
      cardCVVNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3), Validators.min(111), Validators.max(999)]]
    });
  }

  // convenience getter for easy access to form fields
  get formControls() { return this.paymentForm.controls; }

  onSubmit() {
    console.log("*****************", this.paymentForm.getRawValue());
    console.log("*****************", this.paymentForm.valid);
    console.log("*****************", this.paymentForm.status);
    this.submitForm();
  }

  limit() {
    var max_chars = 3;
    let element = this.paymentForm.get('cardCVVNumber').value;
    console.log(element)

    if (element.length > max_chars) {
      element = element.substr(0, max_chars);
    }
  }

  submitForm() {
    if (this.paymentForm.status === 'VALID') {
      const expiryDate = new Date(this.paymentForm.get('expirationYear').value, this.paymentForm.get('expirationMonth').value, 1);
      console.log("expiryDate",expiryDate)
      const paymentFormData = {
        creditCardNumber: this.paymentForm.get('cardNumber').value.toString(),
        cardHolder: this.paymentForm.get('nameOnCard').value,
        expirationDate: expiryDate,
        securityCode: this.paymentForm.get('cardCVVNumber').value,
        amount: +this.paymentForm.get('amount').value,
      };

      this.facade.makePayment(paymentFormData);
        this._toastr.success('SUCCESSFUL', 'Your payment was successful')
    } else {
      this._toastr.error("Form Submission Failed", "FAILED")
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
