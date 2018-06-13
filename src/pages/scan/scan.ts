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
import {LoginPage} from "../login/login";
import {OcrPage} from "../ocr/ocr";

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

  private loading: any;
  private imgLoading: any;

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

    //loading
    this.loading = this.loadingController.create({
      content: 'Dokument wird erkannt...'
    });

    this.imgLoading = this.loadingController.create({
      content: "Bild wird hochgeladen"
    });

  }

  /**
   * Start on page load
   */
  ionViewDidLoad() {
    this.cameraActivitytext = "Scannen";
    this.photoStatus = false;
    this.controllActivitytext = "Abbrechen";
    this.controllStatus = false;

    this.isenabled=true;
  }

  /**
   *  Start camara when the page is about to enter and become the active page
   */
  ionViewWillEnter(){

    this.cameraActivitytext = "Scannen";
    this.photoStatus = false;
    this.controllActivitytext = "Abbrechen";
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
      this.navCtrl.push(OcrPage,{scanedImage:this.imgbase64ImageFile});
    };
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
      this.cameraActivitytext = "Neu Scannen?"
      this.photoStatus = true;

      this.controllActivitytext = "Weiter!"
      this.controllStatus = true;

      this.takePicture();
    }else{
      this.cameraActivitytext = "Scannen";
      this.photoStatus = false;

      this.controllActivitytext = "Abbrechen";
      this.controllStatus = false;

      this.cameraPreview.show();
    }
  }

  /**
   * Send an image to the the server and scan it with openCV
   * @param img Taken image
   */
  scanImage(img){

    this.loading.present();

    let myImage = { "imgFile": img };

    this.restProvider.scanImage(myImage).then((result) => {

      let scanFile = <any>{};
      scanFile = result;
      scanFile = scanFile['scanedFile'];

      this.imgbase64ImageFile = scanFile;

      this.loading.dismiss().then(() => {
        console.log('Scan Success');
      });
    }, (err) => {
      console.log('Scan failed ' + err);
      this.loading.dismiss().then(() => {
        console.log('Oooops Scan failed');
        this.sentToast("Scan failed");
      });
      //this.navCtrl.push(LoginPage);
    });
  }

  /**
   * Take a picture
   */
  takePicture(){
    const pictureOpts: CameraPreviewPictureOptions = {
      width: 1920,
      height: 1080,
      quality: 100
    }

    this.cameraPreview.takePicture(pictureOpts).then((imageData) => {

      var base64Image = 'data:image/jpeg;base64,' + imageData;

      this.scanImage(base64Image);
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
