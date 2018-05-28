import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';


@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    private image: string;
    private imgbase64: string;
    private newItem: string;

    toastmessage = {
        input:''
    };

    constructor(
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        private camera: Camera,
        public alertCtrl: AlertController,
        private domSanitizer: DomSanitizer) {
    }

    onTakePicture() {
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            saveToPhotoAlbum: true,
            mediaType: this.camera.MediaType.PICTURE
        }

        this.camera.getPicture(options).then((imageData) => {
            this.image = 'data:image/jpeg;base64,' + imageData;
        }, (err) => {
            this.displayErrorAlert(err);
        });
    }

    displayErrorAlert(err){
        console.log(err);
        let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Error while trying to capture picture',
            buttons: ['OK']
        });
        alert.present();
    }

    openDeviceCamera() {
        const options: CameraOptions = {
            quality: 100,
            targetWidth: 900,
            targetHeight: 600,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            saveToPhotoAlbum: false,
            allowEdit: true,
            sourceType: 1
        }
        this.camera.getPicture(options).then((imageData) => {
            this.imgbase64 = 'data:image/jpeg;base64,' + imageData;
        }, (err) => {
            alert("Failed to capture image");
        });

    }


    sentToast() {
        let toast = this.toastCtrl.create({
            message: this.toastmessage.input,
            position: 'top',
            showCloseButton: true,
            closeButtonText: "x"
        });

        this.newItem =  this.imgbase64;
        toast.present();
    }
}
