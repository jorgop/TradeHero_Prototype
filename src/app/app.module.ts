import { FormsModule } from '@angular/forms';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegistrationPage } from '../pages/registration/registration';
import { ActivityPage } from '../pages/activity/activity';
import { NewActivityPage } from '../pages/new-activity/new-activity';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestProvider } from '../providers/rest/rest';
import { HttpClientModule } from '@angular/common/http';
import { RedditData } from '../providers/reddit-data/reddit-data';
import { ActivityService } from '../services/activity.service';
import { CallNumber } from '@ionic-native/call-number';

//import { CameraMock } from './mocks/CameraMock';
import {Camera} from "@ionic-native/camera";
import { CameraMock } from './mocks/CameraMock';

import { IonicStorageModule } from '@ionic/storage';
import {ScanPage} from "../pages/scan/scan";
import {CameraPreview} from "@ionic-native/camera-preview";
import {CameraPreviewOptions} from "@ionic-native/camera-preview";

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    AboutPage,
    ContactPage,
    HomePage,
    RegistrationPage,
    ActivityPage,
    NewActivityPage,
    ScanPage
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, { swipeBackEnabled: true }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    AboutPage,
    ContactPage,
    HomePage,
    RegistrationPage,
    ActivityPage,
    NewActivityPage,
    ScanPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    [{ provide: ErrorHandler, useClass: IonicErrorHandler }],
    RestProvider,
    RedditData,
    ActivityService,
    CallNumber,
      //if running on device
    Camera, //if running on device
    CameraPreview
    //{ provide: Camera, useClass: CameraMock} //if running on browser
  ]
})
export class AppModule {}
