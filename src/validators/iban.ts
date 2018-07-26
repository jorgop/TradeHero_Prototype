import { FormControl } from '@angular/forms';
export class IbanValidator {

  /**
   * Valdator for IBAN
   * @param {FormControl} control Object form to validate
   * @returns {any} Returns if validation is successful
   */
  static isValid(control: FormControl): any {

    var re = /^\b[A-Za-z]{2}[0-9]{2}(?:[ ]?[0-9]{4}){4}(?!(?:[ ]?[0-9]){3})(?:[ ]?[0-9]{1,2})?\b/;
    let result = re.test(control.value);

    if (!result) {
      return {
        'iban:validation:fail' : true
      }
    }

    return null;
  }
}
