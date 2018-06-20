import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Storage} from "@ionic/storage";
import {RestProvider} from "../../providers/rest/rest";
import { AlertController } from 'ionic-angular';
import {HomePage} from "../home/home";

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
  private mail: any;
  public editInfo: string = "true";  //toggle Variable for editing the personal data
  public borderStyle: string = ''; // Variable for Border Style
  public buttonStyle: string = 'none';
  public iconToggle: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private formBuilder: FormBuilder,
              public restProvider: RestProvider) {

// Saves user Id from storage
      this.storage.get('identity').then((val) => {
          let identity = <any>{};
          identity = JSON.parse(val);
          this.userID = identity['userID'];
      });

// Creates form
      this.stammdatenForm = formBuilder.group({
          firstName: ['', Validators.required],
          lastName : [''],
          mail : [''],
          street: [''],
          houseNumber: ['']
      });

  }

//function to change editing mode of personal infomation
    public toggleediting(): void {
        if(this.editInfo === 'true') {
            this.editInfo = 'false';
            this.borderStyle = '2px solid #15B2A2';
            this.buttonStyle = '';
            this.iconToggle = false;
            //console.log("first toggle: ", this.editInfo);
        } else if(this.editInfo === 'false'){
            this.editInfo = 'true';
            this.borderStyle = '';
            this.buttonStyle = 'none';
            this.iconToggle = true;

        }
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
                'lastName': this.stammdatenForm.controls.lastName.value,
                'mail': this.stammdatenForm.controls.mail.value,
                'street': this.stammdatenForm.controls.street.value,
                'houseNumber': this.stammdatenForm.controls.houseNumber.value,};
      console.log(myData);
  }

  updateUserDataInputfields(){
      this.storage.get('user').then((val) => {
          let user = <any>{};
          user = JSON.parse(val);
          console.log("raw:", user);
          //console.log("raw1:", user['userData'][0]['firstName']);
          var userData = user['userData'][0];

          //username for variable used in profile headline
          this.fname = userData['firstName'];
          Object.keys(userData).forEach(key => {
              //console.log(key);
              //console.log(userData[key]);
              if(key == "firstName"){
                  this.stammdatenForm.patchValue({firstName:userData['firstName']});
              }
              else if(key == "lastName"){
                  this.stammdatenForm.patchValue({lastName:userData['lastName']});
              }
              else if(key == "mail"){
                  this.stammdatenForm.patchValue({mail:userData['mail']});
              }
              else if(key == "street"){
                  this.stammdatenForm.patchValue({street:userData['street']});
              }
              else if(key == "houseNumber"){
                  this.stammdatenForm.patchValue({houseNumber:userData['houseNumber']});
              };
          });
      });
  }

    goToHome(params){
        this.navCtrl.push(HomePage);
    }

}