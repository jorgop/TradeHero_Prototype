import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { ToastController } from 'ionic-angular';
import { OcrPage } from "../ocr/ocr";
import { Camera, CameraOptions } from '@ionic-native/camera';
import {HomePage} from "../home/home";
import {PreviewPage} from "../preview/preview";

@Component({
  selector: 'page-scan',
  templateUrl: './scan.html',
})
export class ScanPage {
  @ViewChild(Content) content: Content;

  /**
   * Raw image from the Camera
   */
  private imgbase64ImageFile: any;

  /**
   * @constructor
   * @param {NavController} navCtrl Navigation Controller
   * @param {NavParams} navParams Paramter Controller
   * @param {AlertController} alertCtrl Alert Controller
   * @param {Platform} platform Platform
   * @param {RestProvider} restProvider Provider for Rest-Service
   * @param {ToastController} toastCtrl Controler for Toast Messages
   * @param {Camera} camera Camera
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,platform: Platform,
              public restProvider: RestProvider,
              public toastCtrl: ToastController,
              private camera: Camera) {
  }

  /**
   * Start Camera to take a picture
   */
  takeCameraPicture(){
    const options: CameraOptions = {
      sourceType:1,
      saveToPhotoAlbum: true,
      quality: 100,
      targetWidth: 1920,
      targetHeight: 1080,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      var base64Image = 'data:image/png;base64,' + imageData;
      this.imgbase64ImageFile = base64Image;
      this.gotToPreviewPage();
      if (imageData == null){
        this.navCtrl.push(HomePage);
      }
    }, (err) => {
      this.navCtrl.push(HomePage);
    });
  }

  /**
   *  Start camara when the page is about to enter and become the active page
   */
  ionViewWillEnter(){
    this.takeCameraPicture();
  }

  /**
   * Navigate to Ocr Page
   */
  gotToOcrPage(){
    this.navCtrl.push(OcrPage,{scanedImage: this.imgbase64ImageFile});
  }

  /**
   * Navigate to Ocr Page
   */
  gotToPreviewPage(){
    this.navCtrl.push(PreviewPage,{takenImage: this.imgbase64ImageFile});
  }

}
