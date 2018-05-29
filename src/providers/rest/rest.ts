import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {

  apiUrl = 'https://rest-app.brandau.solutions';
//  response:any;

  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }

  /**
   * Get data from root - function is deprecated
   * @returns {Promise<any>}
   */
  getData() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/api').subscribe(data => {
        resolve(data);
      }, err => {
          console.log(err);
      });
    });
  }

  /**
   * Register a new user
   * @param data Array of user data
   * @returns {Promise<any>} POST return
   */
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

  /**
   * Check user authentication
   * @param mail User mail
   * @param password User password as MD5-Hash
   * @param data
   * @returns {Promise<any>}
   */
  checkLogin(mail,password) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl+'/api/login?mail='+mail+'&password='+password,{responseType: "json"})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

}


