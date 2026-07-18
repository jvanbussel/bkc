import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then((m) => m.HomeComponent) },
  {
    path: 'kaastips',
    loadComponent: () => import('./coming-soon/coming-soon').then((m) => m.ComingSoonComponent),
    data: { title: 'Kaastips' },
  },
  {
    path: 'kaastalogus',
    loadComponent: () => import('./kaastalogus/kaastalogus').then((m) => m.KaastalogusComponent),
  },
  {
    path: 'agenda',
    loadComponent: () => import('./coming-soon/coming-soon').then((m) => m.ComingSoonComponent),
    data: { title: 'Agenda' },
  },
  {
    path: 'lid-van-het-kwartaal',
    loadComponent: () =>
      import('./lid-van-het-kwartaal/lid-van-het-kwartaal').then((m) => m.LidVanHetKwartaalComponent),
  },
  {
    path: 'over',
    loadComponent: () => import('./coming-soon/coming-soon').then((m) => m.ComingSoonComponent),
    data: { title: 'Over' },
  },
  { path: '**', redirectTo: '' },
];
