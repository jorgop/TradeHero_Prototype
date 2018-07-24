import { FormControl } from '@angular/forms';
export class RefundValidator {

  /**
   * Validates the format for the refund
   * @param {FormControl} control Object form to validate
   * @returns {any} Returns if validation is successful
   */
  static isValid(control: FormControl): any {

    var re = /^[0-9]+\.[0-9]{2}$/;
    let result = re.test(control.value);

    if (!result) {
      return {
        'refund:validation:fail' : true
      }
    }

    return null;
  }
}
