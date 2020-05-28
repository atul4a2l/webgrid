import { Component, OnInit } from '@angular/core';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
} from "@ionic-native/background-geolocation/ngx";
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { LocationService } from '../services/location.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public isChecked: boolean;

  constructor(public toastController: ToastController,
    private backgroundGeolocation: BackgroundGeolocation,
    public authService: AuthService,
    public locationService: LocationService) { }

  ngOnInit() {
  
  }

  changeToggle(data: CustomEvent){
    this.isChecked = data.detail.checked;
    if(this.isChecked){
      this.presentToast('Location Sync is turned ON')
      this.startBackgroundGeolocation();
    }
    if(!this.isChecked){
    this.presentToast('Location Sync is turned OFF')
    this.backgroundGeolocation.stop();
    }
  }

  startBackgroundGeolocation() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false // enable this to clear background location settings when the app terminates
    };
    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
          console.log(location);
          this.sendGPS(location);
        });
    });

    //start recording location
    this.backgroundGeolocation.start();
    //If you wish to turn OFF background-tracking, call the #stop method.
    //this.backgroundGeolocation.stop();
  }

  stop(){
    this.backgroundGeolocation.stop().then((response)=>{
      console.log('location stopped')
      console.log('Tracking is stop',response)
    });
  }

  sendGPS(location:BackgroundGeolocationResponse) {
    let userId = this.authService.getUserId();
    let posit: string = location.longitude + ','+ location.latitude;
    this.locationService.sendLocation(userId, posit).then((response)=>{
      console.log(response);
    }).catch((error)=>{
      console.log(error)
    })
}

async presentToast(msg: string) {
  const toast = await this.toastController.create({
    message: msg,
    duration: 2000,
    cssClass: "toast-scheme",
    position:"bottom"
  });
  toast.present();
}

}
