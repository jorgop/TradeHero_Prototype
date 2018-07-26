import { FormControl } from '@angular/forms';
export class PlzValidator {

  /**
   * Validates postcode numbers
   * @param {FormControl} control Object form to validate
   * @returns {any} Returns if validation is successful
   */
  static isValid(control: FormControl): any {

    var re = /^\b[0-9]{5}$/;
    let result = re.test(control.value);

    if (!result) {
      return {
        'plz:validation:fail' : true
      }
    }

    return null;
  }
}
