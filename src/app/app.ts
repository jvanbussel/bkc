import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuModule, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(private readonly router: Router) {}

  readonly menuItems: MenuItem[] = [
    { label: 'Home', routerLink: '/' },
    { label: 'Kaastips', routerLink: '/kaastips' },
    { label: 'Kaastalogus', routerLink: '/kaastalogus' },
    { label: 'Agenda', routerLink: '/agenda' },
    { label: 'Lid van het kwartaal', routerLink: '/lid-van-het-kwartaal' },
    { label: 'Over', routerLink: '/over' },
  ];

  isHomeRoute(): boolean {
    const path = this.router.url.split('?')[0].split('#')[0];
    return path === '' || path === '/';
  }
}
