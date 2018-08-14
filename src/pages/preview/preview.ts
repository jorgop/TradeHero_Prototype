import { Component,ViewChild } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { ToastController } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import {OcrPage} from "../ocr/ocr";
import {HomePage} from "../home/home";
import {ScanPage} from "../scan/scan";

@Component({
  selector: 'page-preview',
  templateUrl: './preview.html',
})
export class PreviewPage {

  /**
   * Scanned Image from openCV
   */
  private scanedImage : any;

  /**
   * Raw Image from the camera
   */
  private takenImage: any;

  /**
   * Loading Animation for sending the Image
   */
  private sendLoading : any;

  /**
   * @constructor
   * @param {NavController} navCtrl Navigation Controller
   * @param {NavParams} navParams Parameter Controller
   * @param {ImageViewerController} imageViewerCtrl Image Viewer
   * @param {AlertController} alertCtrl Alert Controller
   * @param {RestProvider} restProvider Provider for Rest-Service
   * @param {ToastController} toastCtrl Toast Message Controller
   * @param {LoadingController} loadingController Loding Animation Controller
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private imageViewerCtrl: ImageViewerController,
              public alertCtrl: AlertController,
              public restProvider: RestProvider,
              public toastCtrl: ToastController,
              public loadingController: LoadingController,) {

    this.takenImage= this.navParams.get('takenImage');

    //loading for sending data
    this.sendLoading = this.loadingController.create({
      content: 'Bild wird gescannt...'
    });
  }

  /**
   * Start scan images if page will be entered
   */
  ionViewWillEnter(){
    this.scanImage();
  }

  /**
   * Detect borders and greyscale the images with opencv upon calling the rest service
   */
  scanImage(){

    this.sendLoading.present();

    let myImage = { "imgFile": this.takenImage };

    this.restProvider.scanImage(myImage).then((result) => {

      let scanFile = <any>{};
      scanFile = result;
      scanFile = scanFile['scanedFile'];

      this.scanedImage = scanFile;

      this.sendLoading.dismiss().then(() => {
        console.log('Scan Success');
      });
    }, (err) => {
      console.log('Scan failed ' + err);
      this.sendLoading.dismiss().then(() => {
        this.presentConfirm();
      });
    });
  }

  /**
   * Show message Box if scan failed
   */
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Oh nein ;(',
     // message: 'Leider konnte das Bild nicht erkannt werden. Bitte überprüfe deine Internet Verbindung und achte darauf das nur die Rechnung im Bild zu sehen ist.',

      message: '<p>Leider konnte das Bild nicht erkannt werden. Bitte überpr&uuml;fen Sie die folgenden Punkte:</p>\n' +
      '<ul>\n' +
      '<li>Aktive Internetverbindung&nbsp;</li>\n' +
      '<li>Kein zu heller Hintergrund</li>\n' +
      '<li>Nur die Rechnung ist zu sehen&nbsp;</li>\n' +
      '<li>Das Format ist A4</li>\n' +
      '</ul>',
      cssClass: 'alertCustomCss',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            this.navCtrl.push(HomePage);
          }
        },
        {
          text: 'Erneut versuchen',
          handler: () => {
            this.navCtrl.push(ScanPage);
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Navigate to Ocr Page
   */
  gotToOcrPage(){
    this.navCtrl.push(OcrPage,{scanedImage: this.scanedImage,rawImage: this.takenImage});
  }

  /**
   * Navigation to HomePage
   */
  goToHome(){
    this.navCtrl.push(HomePage);
  }

    /**
     * Thumbnail of scanned image is enlarged to full screen
     * @param myImg
     */
  showPreviewPhoto(myImg) {
      const imageViewer = this.imageViewerCtrl.create(myImg);
      imageViewer.present(myImg);
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
