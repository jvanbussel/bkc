import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, CardModule, TagModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {}
