import { Injectable } from '@angular/core';
import { Storage} from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { Router } from "@angular/router";
import { LoadingController } from '@ionic/angular';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private sessionId: string;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HTTP, private router: Router, private storage: Storage,
    public loadingController: LoadingController) { }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  autoAuthUser() {
    const sessionId = this.getSessionId();
    if(!sessionId){
    return;
    }
    this.sessionId = sessionId;
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
    this.router.navigate(['/home'])
  }

  private saveSessionId(sessionId: string) {
    this.storage.set('sessionId', sessionId).then((response)=>{
      console.log(response)
    }).catch((error)=>{
      console.log(error)
    })
  }
  
  private removeSessionId() {
    this.storage.remove('sessionId').then((res)=>{
      console.log(res)
    }).catch((err)=>{
      console.log(err)
    })
  }

   getSessionId() {
   this.storage.get('sessionId').then((val)=>{
     console.log(val);
     this.sessionId = val
   }).catch((err)=>{
     console.log(err)
   })
   return this.sessionId;
  }

  logout() {
    this.sessionId = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    this.removeSessionId();
    this.router.navigate(["/"]);
  }

  login(email: string, password: string){ 
    const body = {
      user: email,
      pass: password
    };
    this.presentLoading()
    this.http.post("https://erp.gengroup.in/android/live_location_tracking/login1.php", body, {'Content-Type': 'application/x-www-form-urlencoded'}).then((response)=>{
      this.loadingController.dismiss();
      const responseData = JSON.parse(response.data)
      if(!responseData.error){
        this.sessionId = responseData.user.user_session_id;
        this.userId = responseData.uid;
        this.authStatusListener.next(true);
        this.isAuthenticated = true;
        this.saveSessionId(this.sessionId)
        this.router.navigate(['/home'])
      }
    }).catch((error)=>{
      console.log(error)
      this.loadingController.dismiss()
    })
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: '',
    });
    await loading.present();
  }
}
