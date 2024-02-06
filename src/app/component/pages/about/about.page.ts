import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(private messagesService: MessagesService) { }

  ngOnInit() {
  }

  rayner() {
    this.messagesService.presentToast("Lore", "danger", 1, "bottom");
  }
}
