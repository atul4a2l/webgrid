import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HTTP) { }

  sendLocation(empid: string, posit: string) {
    const body = {
      empid : empid,
      posit : posit
    };
    return this.http.post("https://erp.gengroup.in/android/live_location_tracking/livelocationupdate1.php", body, {'Content-Type': 'application/x-www-form-urlencoded'})
  }
}
