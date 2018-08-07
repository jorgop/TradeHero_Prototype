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
import {identity} from "rxjs/util/identity";
import {PlzValidator} from "../../validators/plz";
import {HousenumberValidator} from "../../validators/housenumber";


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
    /**
     * Form to display and change personal data
     */
    private stammdatenForm: FormGroup;
    /**
     * Variables to store user name
     */
    private fname: any;

    /**
     *  toggle variable for editing the personal data
     */
    private editInfo: string = "true";
    /**
     *  Variable for border style
     */
    private borderStyle: string = '';
    /**
     *  Variable for button style
     */
    private buttonStyle: string = 'none';
    /**
     *  Variable for icon style
     */
    private iconToggle: boolean = true;
    //TODO: set comments to variables and remove unused variables. For Example look at the ocrPage!
    //private errorMsg: boolean = false;

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

// Creates form with validators
        this.stammdatenForm = formBuilder.group({
            firstName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            lastName: ['', Validators.required],
            mail: ['', Validators.compose([Validators.required, Validators.email])],
            street: ['', Validators.required],
            houseNumber: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(4)])],
            contractID: ['', Validators.required]
        });

    }

    /**
     * Function will be called if page will be load
     */
    ionViewDidLoad() {
        this.navBar.backButtonClick = (e: UIEvent) => {
            this.navCtrl.push(HomePage);
        }
    }

    /**
     * Function to change editing mode of personal information
     */
    public toggleediting(): void {
        if (this.editInfo === 'true') {
            this.editInfo = 'false';
            this.borderStyle = '2px solid #15B2A2';
            this.buttonStyle = '';
            this.iconToggle = false;
            //console.log("first toggle: ", this.editInfo);
        } else if (this.editInfo === 'false') {
            this.editInfo = 'true';
            this.borderStyle = '';
            this.buttonStyle = 'none';
            this.iconToggle = true;
            this.updateUserDataInputfields();

        }
    }

    /**
     * Function will called if page will be entered
     */
    ionViewWillEnter() {

        //get id from Rest
        this.storage.get('identity').then((val) => {
            let identity = <any>{};
            identity = JSON.parse(val);

            try {
                this.restProvider.getUserData(identity['userID']).then((result) => {
                    //set activities to Storage
                    this.storage.set('user', JSON.stringify(result));

                    this.updateUserDataInputfields();

                }, (err) => {
                    //sends stored data to html in case storage can not be reached
                    this.updateUserDataInputfields()

                });
            } catch (e) {
                //TODO: Exception handling
                console.log("ID is null!")
            }
        });
    }

    /**
     * Read userdata from form and send it to REST
     */
    sendUserData() {

        //read new data from sheet
        var restData = <any>{};
        restData = {
            'firstName': this.stammdatenForm.controls.firstName.value,
            'lastName': this.stammdatenForm.controls.lastName.value,
            'mail': this.stammdatenForm.controls.mail.value,
            'street': this.stammdatenForm.controls.street.value,
            'houseNumber': this.stammdatenForm.controls.houseNumber.value,
            'contractID': this.stammdatenForm.controls.contractID.value
        };

        //send data to rest in the variable "restData"
        var newIdentity;
        this.storage.get('identity').then((val) => {
            let identity = <any>{};
            identity = JSON.parse(val);

        // checks validation of new input
            try {
                if (this.stammdatenForm.controls.street.valid &&
                    this.stammdatenForm.controls.houseNumber.valid &&
                    this.stammdatenForm.controls.mail.valid) {
                this.validateFormInput();
                this.restProvider.updateUserData(identity['userID'], restData).then((result) => {
                    console.log(result);
                    console.log(result['userMail']);
                    if (result['userMail'] == "false") {
                        this.sentToast("Email-Fehler");
                    }
                    else if ((result['userMail'] == "true") && (result['userData'] == "true")) {
                        this.toggleediting();
                        this.updateUserDataInputfields();
                        this.sentToast("Daten erfolgreich aktualisiert!");
                    }

                }, (err) => {
                    console.log('error2 ' + err);
                    this.sentToast("Daten konnten nicht aktualisiert werden. Überprüfe deine Internetverbindung!");
                });
              }

              else{
                console.log("2");
                    //wrong fields for toast message
                    var wrongTextFields = "";
                    var checkValuesList = {
                        "street":this.stammdatenForm.controls.street.valid ,
                        "houseNumber":this.stammdatenForm.controls.houseNumber.valid ,
                        "email":this.stammdatenForm.controls.mail.valid };

                    //push wrong values to the checkValuesList
                    for(let key in checkValuesList){
                        if(checkValuesList[key] == false){

                            switch (key){
                                case "street": {
                                    wrongTextFields += "Straßenname" + "\n";
                                    break;
                                }
                                case "houseNumber":{
                                    wrongTextFields += "Hausnummer" + "\n";
                                    break;
                                }
                                case "email":{
                                    wrongTextFields += "Email-Adresse" + "\n";
                                    break;
                                }

                            }
                        }
                    };
                    this.sentToast("Bitte die Felder überprüfen: \n"+ wrongTextFields);
                }
            } catch (e) {
                //TODO:exception handling
                console.log("ID is null!")
            }
        });
    }

    /**
     * Update the Inputfields
     */
    updateUserDataInputfields() {
        this.storage.get('user').then((val) => {
            let user = <any>{};
            user = JSON.parse(val);
            var userData = user['userData'][0];

            //username for variable used in profile headline
            this.fname = userData['firstName'];

            Object.keys(userData).forEach(key => {

                if (key == "firstName") {
                    this.stammdatenForm.patchValue({firstName: userData['firstName']});
                }
                else if (key == "lastName") {
                    this.stammdatenForm.patchValue({lastName: userData['lastName']});
                }
                else if (key == "mail") {
                    this.stammdatenForm.patchValue({mail: userData['mail']});
                }
                else if (key == "street") {
                    this.stammdatenForm.patchValue({street: userData['street']});
                }
                else if (key == "contractID") {
                    this.stammdatenForm.patchValue({contractID: userData['contractID']});
                }
                else if (key == "houseNumber") {

                    this.stammdatenForm.patchValue({houseNumber: userData['houseNumber']});
                }
                ;
            });
        });
    }


    /**
     * Navigate to ScanPage
     */
    goToScan() {
        this.navCtrl.push(ScanPage);
    }

    /**
     * Navigate to  ProfilePage
     */
    goToProfile() {
        this.navCtrl.push(ProfilePage);
    }

    /**
     * Navigate to ContactPage
     */
    goToContact() {
        this.navCtrl.push(ContactPage);
    }

    /**
     * Navigate to ActivityPage
     */
    goToActivity() {
        this.navCtrl.push(ActivityPage);
    }

    /**
     * Navigate to HomePage
     */
    goToHome() {
        this.navCtrl.push(HomePage);
    }

    /**
     * Navigate to ImpressumPage
     */
    goToImpressum() {
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
            closeButtonText: 'x'
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
            showCloseButton: true,
            closeButtonText: 'x'
        });
        toast.present();
    }

    /**
     * Validate Data
     * */

    validateFormInput() {
        //validate fields
        //this.validateFields();


            this.storage.get('user').then((val) => {
                let user = <any>{};
                user = JSON.parse(val);
                //console.log("raw:", user);
                var userData = user['userData'][0];
                var newFname = userData['firstName'];
                var newPlace = userData['place'];
                var newPlz = userData['PLZ'];
                var newBday = userData ['birthdate'];
                var newGender = userData ['gender'];
                var newData = <any>{};

                newData = {
                    "userData": [
                        {
                            "firstName": newFname,
                            "street": this.stammdatenForm.controls.street.value,
                            "place": newPlace,
                            "PLZ": newPlz,
                            "lastName": this.stammdatenForm.controls.lastName.value,
                            "houseNumber": this.stammdatenForm.controls.houseNumber.value,
                            "birthDate": newBday,
                            "gender": newGender,
                            "mail": this.stammdatenForm.controls.mail.value,
                            "contractID": this.stammdatenForm.controls.contractID.value
                        }
                    ]
                };

                this.storage.set('user', JSON.stringify(newData));
            })
    }
}


