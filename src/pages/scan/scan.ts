import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {Platform} from 'ionic-angular';
import { CameraPreview, CameraPreviewPictureOptions} from '@ionic-native/camera-preview';
import { Content } from 'ionic-angular';
import {ActivityPage} from "../activity/activity";
import {HomePage} from "../home/home";

@Component({
  selector: 'page-scan',
  templateUrl: './scan.html',
})
export class ScanPage {
  @ViewChild(Content) content: Content;

  private photoStatus : any;
  private controllStatus :any;

  imgbase64ImageFile: any;

  cameraActivitytext: any;
  controllActivitytext: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,platform: Platform,private cameraPreview: CameraPreview) {}

  /**
   * Start on page load
   */
  ionViewDidLoad() {
    this.cameraActivitytext = "Take Photo";
    this.photoStatus = false;
    this.controllActivitytext = "Cancel";
    this.controllStatus = false;
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

      this.navCtrl.push(ActivityPage);
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
      width: 1280,
      height: 1280,
      quality: 70
    }

    this.cameraPreview.takePicture(pictureOpts).then((imageData) => {
      this.imgbase64ImageFile = 'data:image/jpeg;base64,' + imageData;
      this.cameraPreview.hide();
    }, (err) => {
       console.log(err);
      //this.imgbase64ImageFile = 'assets/img/test.jpg';
    });
  }

}
