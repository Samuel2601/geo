import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.page.html',
  styleUrls: ['./update-password.page.scss'],
})
export class UpdatePasswordPage implements OnInit {

  public updateForm: FormGroup|any;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private messagesService: MessagesService) {
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
      else {
        return passwordConfirmationInput.setErrors(null);
      }
    }
  }

  ngOnInit() {
    this.updateForm = this.formBuilder.group({
      oldPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\[\\]\{\}#¿?!@$%^&*-_.,:;()/|]).{8,30}$'),
        Validators.minLength(8),
        Validators.maxLength(30)
      ]],
      passwordConfirmation: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30)
      ]]
    }, { validator: this.checkIfMatchingPasswords('password', 'passwordConfirmation') } as AbstractControlOptions);
  }

  get formControls() {
    return this.updateForm.controls;
  }

  async updatePassword() {
    await this.messagesService.presentLoading();
    this.apiService.SecurePostPass(
      {
        pass: this.updateForm.get("oldPassword")?.value,
        newpass: this.updateForm.get("password")?.value,
      }
    ).subscribe({
      next: async (res) => {
        this.apiService.handleResponse(res);
        await this.messagesService.dismissLoading();
        this.messagesService.presentToast(res.message);
        this.updateForm.reset();
        this.router.navigateByUrl('/tabs/tab3');
      },
      error: async (error) => {
        await this.messagesService.dismissLoading();
        this.apiService.errorSubscription(error);
      }
    });
  }
}
