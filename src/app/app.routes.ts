import { Routes } from '@angular/router';
import { ComingSoonComponent } from './coming-soon/coming-soon';
import { HomeComponent } from './home/home';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'kaastips', component: ComingSoonComponent, data: { title: 'Kaastips' } },
  { path: 'kaastalogus', component: ComingSoonComponent, data: { title: 'Kaastalogus' } },
  { path: 'agenda', component: ComingSoonComponent, data: { title: 'Agenda' } },
  {
    path: 'lid-van-het-kwartaal',
    component: ComingSoonComponent,
    data: { title: 'Lid van het kwartaal' },
  },
  { path: 'over', component: ComingSoonComponent, data: { title: 'Over' } },
  { path: '**', redirectTo: '' },
];
