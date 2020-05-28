import { Component, OnInit, ViewChild } from '@angular/core';
import {IonSlides} from '@ionic/angular';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from "@angular/forms";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  slideOpts = {
    direction: 'vertical'
  };
  constructor(public authService: AuthService, public loadingController: LoadingController,
    public alertController: AlertController) { }
  @ViewChild('slider') slider: IonSlides;
  @ViewChild('innerSlider') innerSlider: IonSlides;
  
  ngOnInit() {

  }

  goToLogin() {
    this.slider.slideTo(1);
  }

  goToSignup() {
    this.slider.slideTo(2);
  }

  slideNext() {
    this.innerSlider.slideNext();
  }

  slidePrevious() {
    this.innerSlider.slidePrev();
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.login(form.value.email, form.value.password);
    form.resetForm();
  }

  async presentLoading(msg) {
    const loading = await this.loadingController.create({
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    const alert = await this.alertController.create({
      header: 'Sucess',
      message: msg,
      buttons: ['Dismiss']
    });

    await alert.present();
  }
  signup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    form.resetForm();
    this.presentLoading('Thanks for signing up!');
  }
  resetPassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    form.resetForm();
    this.presentLoading('An e-mail was sent with your new password.');
  }

}
