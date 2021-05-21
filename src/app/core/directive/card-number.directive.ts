import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { SubscriptionLike } from 'rxjs';

@Directive({
  selector: '[cardnumber]'
})
export class CardNumberDirective implements OnInit, OnDestroy {

  private _cardNumberControl: AbstractControl;
  private _preValue: string;

  @Input()
  set cardNumberControl(control: AbstractControl) {
    this._cardNumberControl = control;
  }

  @Input()
  set preValue(value: string) {
    this._preValue = value;
  }

  @Input() id: string;

  private sub: SubscriptionLike;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.cardNumberFormat();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  cardNumberFormat() {
    this.sub = this._cardNumberControl.valueChanges.subscribe(data => {
      if (data) {
        var v = data.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        var matches = v.match(/\d{4,16}/g);
        var match = matches && matches[0] || ''
        var parts = []

        for (let i = 0, len = match.length; i < len; i += 4) {
          parts.push(match.substring(i, i + 4))
        }

        if (parts.length) {
          let x = parts.join(' ');
          return x
        } else {
          return data
        }
      }
    });

  }

}
