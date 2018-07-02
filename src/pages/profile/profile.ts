import {Component, ViewChild} from '@angular/core';
import {Navbar, NavController, ToastController,} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Storage} from "@ionic/storage";
import {RestProvider} from "../../providers/rest/rest";
import {AlertController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {AboutPage} from "../about/about";
import {LoginPage} from "../login/login";
import {ContactPage} from "../contact/contact";
import {ScanPage} from "../scan/scan";
import {ActivityPage} from "../activity/activity";

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

  @ViewChild(Navbar) navBar: Navbar;
  constructor(public navCtrl: NavController,
              private toastCtrl: ToastController,
              public alertCtrl: AlertController,
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

    ionViewDidLoad() {
        this.navBar.backButtonClick = (e:UIEvent)=>{
            this.navCtrl.push(HomePage);
        }
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

    goToScan(){
        this.navCtrl.push(ScanPage);
    }
    goToProfile(){
        this.navCtrl.push(ProfilePage);
    }
    goToContact(){
        this.navCtrl.push(ContactPage);
    }
    goToActivity(){
        this.navCtrl.push(ActivityPage);
    }
    goToHome(){
        this.navCtrl.push(HomePage);
    }
    goToAbout(){
        this.navCtrl.push(AboutPage);
    }

    /**
     * Logout Funktion: logout() startet einen Confirm Alert. Bei Bestätigung des Logouts wird die Funktion performLogout() ausgeführt.
     * Im Anschluß erscheint ein Toast zur Bestätigung des erfolgreichen Logouts, nachdem der Storage geleert wurde.
     */
    logout() {
        const confirm = this.alertCtrl.create({
            title: 'Wollen Sie sich wirklich ausloggen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    handler: () => {
                        console.log('Logout abgebrochen');
                    }
                },
                {
                    text: 'Ausloggen',
                    handler: () => {
                        console.log('Logout erfolgreich');
                        this.performLogout();
                    }
                }
            ]
        });
        confirm.present();
    }
    performLogout() {
        this.navCtrl.setRoot(LoginPage);
        this.navCtrl.popToRoot();
        this.storage.clear();
        let logoutConf = this.toastCtrl.create({
            message: 'Sie wurden erfolgreich ausgeloggt',
            duration: 2000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: 'X'
        });
        logoutConf.onDidDismiss(() => {
            console.log('Dismissed toast');
        });
        logoutConf.present();
    }

}