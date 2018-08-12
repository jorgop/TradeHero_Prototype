import { FormControl } from '@angular/forms';
export class HousenumberValidator {

  /**
   * Validates the format for the housenumber
   * @param {FormControl} control Object form to validate
   * @returns {any} Returns if validation is successful
   */
  static isValid(control: FormControl): any {

    var re = /^[0-9]$/;
    let result = re.test(control.value);

    if (!result) {
      return {
        'housenumber:validation:fail' : true
      }
    }

    return null;
  }
}
