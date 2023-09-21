import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  public validField( form: FormGroup, field: string ) {

    return form.controls[ field ].errors
      && form.controls[ field ].touched;
  }

  equalFields( field1: string, field2: string ) {

    return ( formGroup: FormGroup ): ValidationErrors | null => {

      const value1= formGroup.get( field1 )?.value;
      const value2 = formGroup.get( field2 )?.value;

      if ( value1 !== value2) {

        formGroup.get( field2 )?.setErrors( { notEqual: true } );
        return { notEqual: true }
      }

      formGroup.get( field1 )?.setErrors( null );
      return null;
    }
  }

}
