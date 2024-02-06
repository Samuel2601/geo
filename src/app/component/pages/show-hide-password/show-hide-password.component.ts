import { Component, ContentChild } from '@angular/core';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'show-hide-password',
  templateUrl: './show-hide-password.component.html',
  styleUrls: ['./show-hide-password.component.scss'],
})
export class ShowHidePasswordComponent {

  visible: boolean = false;
  @ContentChild(IonInput) input: IonInput|any;

  constructor() { }

  togglePass() {
    this.visible = !this.visible;
    this.input.type = this.visible ? 'text' : 'password';
  }
}
