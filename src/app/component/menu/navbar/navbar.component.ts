import { Component, ElementRef, OnInit } from '@angular/core';
import { ModalService } from 'src/app/service/modal.service'; // Asegúrate de importar correctamente
import { ROUTES } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  private listTitles: any[] = [];
  public mobile_menu_visible = false;
  private toggleButton: HTMLElement | null = null;
  private sidebarVisible = false;

  constructor(
    private element: ElementRef,
    private router: Router,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.toggleButton = this.element.nativeElement.querySelector('.navbar-toggler');
    this.router.events.subscribe(() => {
      this.sidebarClose();
      const layer = document.querySelector('.close-layer');
      if (layer) {
        layer.remove();
        this.mobile_menu_visible = false;
      }
    });
  }

  abrirModal(): void {
    this.modalService.abrirModalInicio();
  }

  getTitle(): string {
    return 'Home';
  }

  sidebarToggle(): void {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

  sidebarOpen(): void {
    if (this.toggleButton) {
      this.toggleButton.classList.add('toggled');
    }
    document.body.classList.add('nav-open');
    this.sidebarVisible = true;
  }

  sidebarClose(): void {
    if (this.toggleButton) {
      this.toggleButton.classList.remove('toggled');
    }
    document.body.classList.remove('nav-open');
    this.sidebarVisible = false;
  }
}
