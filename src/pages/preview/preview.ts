import { Component,ViewChild } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { ToastController } from 'ionic-angular';
import {OcrPage} from "../ocr/ocr";
import {HomePage} from "../home/home";

@Component({
  selector: 'page-preview',
  templateUrl: './preview.html',
})
export class PreviewPage {

  private imgbase64ImageFile: any;
  private scanedImage : any;
  private takenImage: any;
  private sendLoading : any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public restProvider: RestProvider,
              public toastCtrl: ToastController,
              public loadingController: LoadingController,) {

    this.takenImage= this.navParams.get('takenImage');

    //loading for sending data
    this.sendLoading = this.loadingController.create({
      content: 'Rechung wird eingereicht'
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

    console.log(myImage);

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
        console.log('Oooops Scan failed');
        //this.navCtrl.push(ScanPage);
        this.sentToast("Bild konnte nicht gelesen werden!");
      });
    });
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
