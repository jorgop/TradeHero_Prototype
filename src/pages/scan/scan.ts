import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {Platform} from 'ionic-angular';
import { CameraPreview, CameraPreviewPictureOptions} from '@ionic-native/camera-preview';
import { Content } from 'ionic-angular';
import {ActivityPage} from "../activity/activity";
import {HomePage} from "../home/home";
import { RestProvider } from '../../providers/rest/rest';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-scan',
  templateUrl: './scan.html',
})
export class ScanPage {
  @ViewChild(Content) content: Content;

  private photoStatus : any;
  private controllStatus :any;
  private userID : any;
  private token : boolean;

  isenabled=true;

  imgbase64ImageFile: any;

  cameraActivitytext: any;
  controllActivitytext: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,platform: Platform,private cameraPreview: CameraPreview,public restProvider: RestProvider,public toastCtrl: ToastController,private storage: Storage,public loadingController: LoadingController) {

    this.storage.get('identity').then((val) => {
      let identity = <any>{};
      identity = JSON.parse(val);
      this.userID = identity['userID'];
    });

  }

  /**
   * Start on page load
   */
  ionViewDidLoad() {
    this.cameraActivitytext = "Take Photo";
    this.photoStatus = false;
    this.controllActivitytext = "Cancel";
    this.controllStatus = false;

    this.isenabled=true;
  }

  /**
   *  Start camara when the page is about to enter and become the active page
   */
  ionViewWillEnter(){

    this.cameraActivitytext = "Take Photo";
    this.photoStatus = false;
    this.controllActivitytext = "Cancel";
    this.controllStatus = false;
    this.startImagePreview();
    this.isenabled=true;
  }

  /**
   *  Stop the camera when the page has finished leaving and is no longer the active page
   */
  ionViewDidLeave(){
    this.cameraPreview.stopCamera();
  }

  /**
   * Action of the left button
   */
  controllActivty(){

    if(this.controllStatus == false){
        this.navCtrl.push(HomePage);
    }else{

      var restData = <any>{};

      restData = { "activity":[
                                { "userID": this.userID ,
                                  "imgFile": this.imgbase64ImageFile
                                }
                              ]
      };

      this.isenabled=false;

      let loader = this.loadingController.create({
        content: "Bild wird hochgeladen"
      });

      loader.present().then(() => {
        let token;
        this.restProvider.addActivity(restData).then((result) => {

          if (result == true){

            this.storage.get('identity').then((val) => {
              let identity = <any>{};
              identity = JSON.parse(val);
              //console.log(identity['userID']);


              //get activities
              this.restProvider.getActivityData(identity['userID']).then((result) => {
                this.storage.set('strActivities',JSON.stringify(result));
              })
            });

            setTimeout(() => {
              loader.dismiss().then(() => { this.navCtrl.push(ActivityPage); });
            }, 5000);

          }else {
            this.isenabled=true;
            this.sentToast("Bild konnete nicht verarbeitet werden!")
          }
        }, (err) => {
          setTimeout(() => {
          //loader.present();
          loader.dismiss();
          }, 5000);
          console.log('error2 ' + err);
          this.sentToast("Oooops upload failed");
          //this.navCtrl.push(LoginPage);
        })
      });
    }
  }

  /**
   * Stop camera stream
   */
  stopImagePreview(){
    this.cameraPreview.stopCamera();
  }

  /**
   * Start camera stream
   */
  startImagePreview(){

    // get height of the footer
    var element = document.getElementById("scanFooter");

    const options = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height - 61,
      camera: this.cameraPreview.CAMERA_DIRECTION.BACK,
      toBack: false,
      tapPhoto: false,
      tapFocus: false,
      previewDrag: false
    };
    this.cameraPreview.startCamera(options);
  }

  /**
   * Action of the right button and text for booth buttons
   */
  cameraActivity(){

    if(this.photoStatus == false){
      this.cameraActivitytext = "Retry?"
      this.photoStatus = true;

      this.controllActivitytext = "Upload!"
      this.controllStatus = true;

      this.takePicture();
    }else{
      this.cameraActivitytext = "Take Photo";
      this.photoStatus = false;

      this.controllActivitytext = "Cancel";
      this.controllStatus = false;

      this.cameraPreview.show();
    }
  }

  /**
   * Take a picture
   */
  takePicture(){
    const pictureOpts: CameraPreviewPictureOptions = {
      width: 1000,
      height: 1000,
      quality: 100
    }

    this.cameraPreview.takePicture(pictureOpts).then((imageData) => {
      this.imgbase64ImageFile = 'data:image/jpeg;base64,' + imageData;
      this.cameraPreview.hide();
    }, (err) => {
       console.log(err);
      //this.imgbase64ImageFile = 'assets/img/test.jpg';
    });
  }

  /**
   * View a toast message
   * @param message Toast Text
   */
  sentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
