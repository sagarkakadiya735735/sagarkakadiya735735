import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { SubscriptionLike } from 'rxjs';

@Directive({
    selector: '[CountryCodeMask]'
})
export class CountryCodeDirective implements OnInit, OnDestroy {

    private _countryCodeControl: AbstractControl;
    private _preValue: string;

    @Input()
    set phoneControl(control: AbstractControl) {
        this._countryCodeControl = control;
    }
    @Input()
    set preValue(value: string) {
        this._preValue = value;
    }
    @Input() id: string;

    private sub: SubscriptionLike;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngOnInit() {

        this.phoneValidate();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    phoneValidate() {

        this.sub = this._countryCodeControl.valueChanges.subscribe(data => {
            if (data) {
                /**the most of code from @Günter Zöchbauer's answer.*/

                /**we remove from input but: 
                   @preInputValue still keep the previous value because of not setting.
                */

                let preInputValue: string;
                if (this._preValue) {
                    preInputValue = this._preValue;
                } else {
                    preInputValue = "";
                }
                var lastChar: string = preInputValue.substr(preInputValue.length - 1);
                // remove all mask characters (keep only numeric)
                var newVal = data.replace(/\D/g, '');
                let start = this.renderer.selectRootElement('#' + this.id).selectionStart;
                let end = this.renderer.selectRootElement('#' + this.id).selectionEnd;

                //let start=this.phoneRef.nativeElement.selectionStart;
                //let end = this.phoneRef.nativeElement.selectionEnd;
                //when removed value from input
                if (data.length < preInputValue.length) {
                    // this.message = 'Removing...'; //Just console
                    /**while removing if we encounter ) character,
                      then remove the last digit too.*/
                    if (preInputValue.length < start) {
                        if (lastChar == ')') {
                            newVal = newVal.substr(0, newVal.length - 1);
                        }
                    }
                    //if no number then flush
                    if (newVal.length == 0) {
                        newVal = '';
                    }
                    else if (newVal.length <= 12) {
                        /**when removing, we change pattern match.
                        "otherwise deleting of non-numeric characters is not recognized"*/
                        newVal = newVal.replace(/^(\d{0,10})/, '+1 $1');
                    }

                    this._countryCodeControl.setValue(newVal, { emitEvent: false });
                    //keep cursor the normal position after setting the input above.
                    this.renderer.selectRootElement('#' + this.id).setSelectionRange(start, end);
                    //when typed value in input
                } else {
                    // this.message = 'Typing...'; //Just console
                    var removedD = data.charAt(start);
                    // don't show braces for empty value
                    if (newVal.length == 0) {
                        newVal = '';
                    }
                    // don't show braces for empty groups at the end
                    else if (newVal.length <= 12) {
                        newVal = newVal.substring(0, 10);
                        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '+1 $2-$3');
                    } 
                    // else if (newVal.length <= 10) {
                        // newVal = newVal.replace(/^(\d{0,5})(\d{0,5})/, '$1-$2');
                    // }
                    //check typing whether in middle or not
                    //in the following case, you are typing in the middle
                    if (preInputValue.length >= start) {

                        if (removedD == '-') {
                            start = start + 1;
                            end = end + 1;
                        }

                        this._countryCodeControl.setValue(newVal, { emitEvent: false });
                        this.renderer.selectRootElement('#' + this.id).setSelectionRange(start, end);
                    } else {
                        this._countryCodeControl.setValue(newVal, { emitEvent: false });
                        this.renderer.selectRootElement('#' + this.id).setSelectionRange(start + 2, end + 2); // +2 because of wanting standard typing
                    }
                }
            }
        });
    }
}