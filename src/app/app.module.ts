import { FormsModule } from '@angular/forms';
import {NgModule, ErrorHandler} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegistrationPage } from '../pages/registration/registration';
import { ActivityPage } from '../pages/activity/activity';
import {ProfilePage} from "../pages/profile/profile";
import {OcrPage} from "../pages/ocr/ocr";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestProvider } from '../providers/rest/rest';
import { HttpClientModule } from '@angular/common/http';
import { ActivityService } from '../services/activity.service';
import { CallNumber } from '@ionic-native/call-number';
import {HistoryPage} from "../pages/history/history";
import {HistoryService} from "../services/history.service";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import { IonicImageViewerModule } from 'ionic-img-viewer';
import {ImpressumPage} from "../pages/impressum/impressum";
import {Camera} from "@ionic-native/camera";
import { Keyboard } from '@ionic-native/keyboard';
import { IonicStorageModule } from '@ionic/storage';
import {ScanPage} from "../pages/scan/scan";
import {CameraPreview} from "@ionic-native/camera-preview";
import {PreviewPage} from "../pages/preview/preview";
import { SimpleTimer } from 'ng2-simple-timer';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ContactPage,
    HomePage,
    RegistrationPage,
    ActivityPage,
    ScanPage,
    HistoryPage,
    ProfilePage,
    OcrPage,
    ImpressumPage,
    PreviewPage
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    IonicImageViewerModule,
    IonicModule.forRoot(MyApp, { swipeBackEnabled: false, tabsPlacement: 'top', backButtonText: "Zurück"}),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    ContactPage,
    HomePage,
    RegistrationPage,
    ActivityPage,
    ScanPage,
    ProfilePage,
    HistoryPage,
    OcrPage,
    ImpressumPage,
    PreviewPage
  ],
  providers: [
    SimpleTimer,
    StatusBar,
    SplashScreen,
    [{ provide: ErrorHandler, useClass: IonicErrorHandler }],
    //[{ provide: LOCALE_ID, useValue: 'de' }],
    RestProvider,
    ActivityService,
    HistoryService,
    CallNumber,
    PhotoViewer,
    Keyboard,
      //if running on device
    Camera, //if running on device
    CameraPreview
    //{ provide: Camera, useClass: CameraMock} //if running on browser
  ]
})
export class AppModule {}
    registerLocaleData(localeDe,'de');
