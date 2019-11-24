import { NgModule } from 'node_modules/@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Camera } from '@ionic-native/camera/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { WebcamModule } from 'ngx-webcam';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { MatToolbarModule, MatCardModule,
         MatInputModule, MatIconModule,
         MatDialogModule,
         MatRadioModule, MatTabsModule,
         MatListModule, MatButtonModule, MatExpansionModule, MatDialogRef, MAT_DIALOG_DATA } from  '@angular/material';
import { ReversePipe } from './businesscard/reverse.pipe';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { HomePage } from './home/home.page';
import { LoginComponent } from './login/login.component';
import { WebcamComponent } from './webcam/webcam.component';
import { NewbusinesscardComponent } from './newbusinesscard/newbusinesscard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BusinesscardComponent } from './businesscard/businesscard.component';
import { SearchComponent } from './search/search.component';

@NgModule({
    declarations: [
      AppComponent,
      ReversePipe,
      HomePage,
      LoginComponent,
      NotFoundComponent,
      NewbusinesscardComponent,
      BusinesscardComponent,
      WebcamComponent,
      SearchComponent
    ],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    MatToolbarModule,
    MatRadioModule,
    MatIconModule,
    MatExpansionModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatButtonModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase,
                                'business-cards-app'),
AngularFirestoreModule.enablePersistence(),
AngularFireAuthModule,
WebcamModule,
FormsModule,
HttpModule],
  providers: [
    Camera,
    ReversePipe,
    StatusBar,
    SplashScreen,
    { provide: MAT_DIALOG_DATA, useValue: {} },   {
       provide: MatDialogRef,
       useValue: {}
   },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
