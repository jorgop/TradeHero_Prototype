import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { RestProvider } from '../../providers/rest/rest';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    private image: string;
    private imgbase64: string;
    private newItem: string;

    users: any;

    constructor(
        public toastCtrl: ToastController,
        private camera: Camera,
        public alertCtrl: AlertController,
        public restProvider: RestProvider) {
          this.getData();
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
        console.log(this.users.data[0].l_name);
        let toast = this.toastCtrl.create({
            message: "Name: " + this.users.data[0].v_name +" "+ this.users.data[0].l_name,
            duration: 3000,
            position: 'top'
        });

        this.newItem =  this.imgbase64;
        toast.present();
    }

    getData() {
      this.restProvider.getData()
        .then(data => {
          this.users = data;
          console.log(this.users);
        });
  }
}
