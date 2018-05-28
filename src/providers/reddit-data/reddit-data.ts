import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';


/*
  Generated class for the RedditDataProvider provider. - Test class

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RedditData {

  private apiUrl = 'https://rest-app.brandau.solutions';

  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }

  getCountries(): Observable<{}> {
    return this.http.get(this.apiUrl + '/api').pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  getUsers() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/api').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  addUser(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl+'/api/register', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
