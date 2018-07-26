import {Component, ViewChild} from '@angular/core';
import {Navbar, NavController, ToastController,} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Storage} from "@ionic/storage";
import {RestProvider} from "../../providers/rest/rest";
import {AlertController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {ImpressumPage} from "../impressum/impressum";
import {LoginPage} from "../login/login";
import {ContactPage} from "../contact/contact";
import {ScanPage} from "../scan/scan";
import {ActivityPage} from "../activity/activity";


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  //TODO: set comments to variables and remove unused variables. For Example look at the ocrPage!
  private stammdatenForm : FormGroup;
  //TODO: set comments to variables and remove unused variables. For Example look at the ocrPage!
  private fname: any;
  //TODO: set comments to variables and remove unused variables. For Example look at the ocrPage!
  private mail: any;
  //TODO: set comments to variables and remove unused variables. For Example look at the ocrPage!
  private editInfo: string = "true";  //toggle Variable for editing the personal data
  //TODO: set comments to variables and remove unused variables. For Example look at the ocrPage!
  private borderStyle: string = ''; // Variable for Border Style
  //TODO: set comments to variables and remove unused variables. For Example look at the ocrPage!
  private buttonStyle: string = 'none';
  //TODO: set comments to variables and remove unused variables. For Example look at the ocrPage!
  private iconToggle: boolean = true;
  //TODO: set comments to variables and remove unused variables. For Example look at the ocrPage!
  private errorMsg: boolean = false;

  @ViewChild(Navbar) navBar: Navbar;

  /**
   * @constructor
   * @param {NavController} navCtrl Controller for Navigation
   * @param {ToastController} toastCtrl Tosat Message Controller
   * @param {AlertController} alertCtrl Alert Controller
   * @param {Storage} storage Local Storage
   * @param {FormBuilder} formBuilder Builder to create Forms
   * @param {RestProvider} restProvider Provider for Rest Service
   */
  constructor(public navCtrl: NavController,
              private toastCtrl: ToastController,
              public alertCtrl: AlertController,
              private storage: Storage,
              private formBuilder: FormBuilder,
              public restProvider: RestProvider) {

// Creates form
      this.stammdatenForm = formBuilder.group({
          firstName: ['', Validators.required],
          lastName : [''],
          mail : [''],
          street: [''],
          houseNumber: ['']
      });

  }

  /**
   * Function will be called if page will be load
   */
  ionViewDidLoad() {
        this.navBar.backButtonClick = (e:UIEvent)=>{
            this.navCtrl.push(HomePage);
        }
    }

//function to change editing mode of personal information
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

  /**
   * Function will called if page will be entered
   */
  ionViewWillEnter() {

    this.storage.get('identity').then((val) => {
      let identity = <any>{};
      identity = JSON.parse(val);

      try{
        this.restProvider.getUserData(identity['userID']).then((result) => {
          //set activities to Storage
          this.storage.set('user',JSON.stringify(result));

          this.updateUserDataInputfields();

        }, (err) => {

          this.updateUserDataInputfields()
          // daten ins html aus storage wenn rest nicht geht
        });
      }catch (e) {
        //TODO: Exception handling
        console.log("ID is null!")
      }
    });
  }

  /**
   * Read userdata from form and send it to REST
   */
  sendUserData(){

      //read new data from sheet
      var restData = <any>{};
      restData = {'firstName': this.stammdatenForm.controls.firstName.value,
                'lastName': this.stammdatenForm.controls.lastName.value,
                'mail': this.stammdatenForm.controls.mail.value,
                'street': this.stammdatenForm.controls.street.value,
                'houseNumber': this.stammdatenForm.controls.houseNumber.value,};
      console.log(restData);


      //send data to rest in variable restData

      var myIdentity;

      this.storage.get('identity').then((val) => {
        let identity = <any>{};
        identity = JSON.parse(val);

        try {
          this.restProvider.updateUserData(identity['userID'], restData).then((result) => {
            console.log(result);
            console.log(result['userMail']);
            if (result['userMail'] == "false") {
              this.sentToast("Email-Fehler");
            }
            else if ((result['userMail'] == "true") && (result['userData'] == "true")) {
              this.toggleediting();
              this.sentToast("Daten erfolgreich aktualisiert!");
            }

          }, (err) => {
            console.log('error2 ' + err);
            this.sentToast("Keine Internetverbindung!");
          });
        }catch (e) {
          //TODO:exception handling
          console.log("ID is null!")
        }
      });
  }

  /**
   * Update the Inputfields
   */
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

  /**
   * Navigate to ScanPage
   */
  goToScan(){
        this.navCtrl.push(ScanPage);
    }

  /**
   * Navigate to  ProfilePage
   */
  goToProfile(){
        this.navCtrl.push(ProfilePage);
    }

  /**
   * Navigate to ContactPage
   */
  goToContact(){
        this.navCtrl.push(ContactPage);
    }

  /**
   * Navigate to ActivityPage
   */
  goToActivity(){
        this.navCtrl.push(ActivityPage);
    }

  /**
   * Navigate to HomePage
   */
  goToHome(){
        this.navCtrl.push(HomePage);
    }

  /**
   * Navigate to ImpressumPage
   */
  goToImpressum(){
        this.navCtrl.push(ImpressumPage);
    }


  /**
   * Ask for logout
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

  /**
   * Perform logout and clean the local storage
   */
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

    /**
     * View a toast message
     * @param message Toast Text
     */
    sentToast(message) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top',
            cssClass: 'toastB',
            showCloseButton: true
        });
        toast.present();
    }

}
