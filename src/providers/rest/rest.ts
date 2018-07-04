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
   * Scan image
   * @param data Image file to scan
   * @returns {Promise<any>} POST return
   */
  scanImage(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl+'/api/scan', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  /**
   * Get text by ocr by an scaned document
   * @param data Scaned document
   * @returns {Promise<any>} POST return
   */
  getOcrData(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl+'/api/ocr', data)
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

  /**
   * Update user user data by userID
   * @param userID User-ID
   * @returns {Promise<any>} Return update status
   */
  getUserData(userID) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl+'/api/user?userID='+userID,{responseType: "json"})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  /**
   * Get the actifities by userID
   * @param userID User-ID
   * @returns {Promise<any>} Return a list of the activities by the User-ID
   */
  updateUserData(userID,data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl+'/api/user?userID='+userID,data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  /**
   * Get user user data by userID
   * @param userID User-ID
   * @returns {Promise<any>} Return the user data as JSON format
   */
  getActivityData(userID) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl+'/api/activity?userID='+userID,{responseType: "json"})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  /**
   * Get user user data by userID
   * @param userID User-ID
   * @returns {Promise<any>} Return the user data as JSON format
   */
  getAggregationData(userID) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl+'/api/aggregation?userID='+userID,{responseType: "json"})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  /**
   * Get ticket data by ticketID
   * @param ticketID Ticket-ID
   * @returns {Promise<any>} Return the user data as JSON format
   */
  getTicketData(ticketID) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl+'/api/ticket?ID='+ticketID,{responseType: "json"})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  /**
   * Add a new activity
   * @param data JSON with userID and Image
   * @returns {Promise<any>} POST return
   */
  addActivity(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl+'/api/activity', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
}


