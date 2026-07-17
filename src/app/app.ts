import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenubarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly menuItems: MenuItem[] = [
    { label: 'Home', routerLink: '/' },
    { label: 'Kaastips', routerLink: '/kaastips' },
    { label: 'Kaastalogus', routerLink: '/kaastalogus' },
    { label: 'Agenda', routerLink: '/agenda' },
    { label: 'Lid van het kwartaal', routerLink: '/lid-van-het-kwartaal' },
    { label: 'Over', routerLink: '/over' },
  ];
}
