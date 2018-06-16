import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Storage} from "@ionic/storage";
import {RestProvider} from "../../providers/rest/rest";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private stammdatenForm : FormGroup;
  private userID: any;
  private fname: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private formBuilder: FormBuilder,
              public restProvider: RestProvider) {


      this.storage.get('identity').then((val) => {
          let identity = <any>{};
          identity = JSON.parse(val);
          this.userID = identity['userID'];
      });

      this.stammdatenForm = formBuilder.group({
          firstName: ['', Validators.required],
          lastName : [''],
      });

  }

  ionViewWillEnter() {




      this.restProvider.getUserData(this.userID).then((result) => {
          //set activities to Storage
          this.storage.set('user',JSON.stringify(result));

         this.updateUserDataInputfields();

      }, (err) => {

          this.updateUserDataInputfields()
          // daten ins html aus storage wenn rest nicht geht
      });


  }

  sendUserData(){
      var myData = <any>{};
      myData = {'firstName': this.stammdatenForm.controls.firstName.value,
                'lastName': this.stammdatenForm.controls.lastName.value};
      console.log(myData);
  }


  updateUserDataInputfields(){
      this.storage.get('user').then((val) => {
          let user = <any>{};
          user = JSON.parse(val);
          //console.log("raw:", user);
          //console.log("raw1:", user['userData'][0]['firstName']);
          var userData = user['userData'][0];
          this.fname = userData['firstName'];
          Object.keys(userData).forEach(key => {
              //console.log(key);
              //console.log(userData[key]);
              if(key == "firstName"){
                  this.stammdatenForm.patchValue({firstName:userData['firstName']});

              }else if(key == "lastName"){
                  this.stammdatenForm.patchValue({lastName:userData['lastName']});
              };
          });
      });
  }
}