import { Component } from '@angular/core';

type Kaas = {
  naam: string;
  beschrijving: string;
  afbeelding: string;
};

@Component({
  selector: 'app-kaastalogus',
  standalone: true,
  templateUrl: './kaastalogus.html',
  styleUrl: './kaastalogus.scss',
  imports: [],
})
export class KaastalogusComponent {
  readonly kazen: Kaas[] = [
    {
      naam: 'Roquefort',
      beschrijving:
        'Franse blauwschimmelkaas van schapenmelk met een pittige, ziltige smaak en romige textuur.',
      afbeelding: 'assets/kaastalogus/Roquefort.png',
    },
    {
      naam: 'Gorgonzola',
      beschrijving:
        'Italiaanse blauwaderkaas van koemelk; zacht en romig met een lichte tot krachtige scherpte.',
      afbeelding: 'assets/kaastalogus/Gorgonzola.png',
    },
    {
      naam: 'Blue Stilton',
      beschrijving:
        'Engelse klassieker met kruimelige, romige structuur en diepe, nootachtige blauwe smaak.',
      afbeelding: 'assets/kaastalogus/Blue-Stilton.png',
    },
    {
      naam: 'Delice de Bourgogne',
      beschrijving:
        'Rijke Franse triple-creme kaas met een fluweelzachte binnenkant en boterige, milde smaak.',
      afbeelding: 'assets/kaastalogus/Delice-de-Bourgogne.png',
    },
    {
      naam: 'Cremeux de Bourgogne',
      beschrijving:
        'Zeer romige Bourgondische kaas met witte korst en een zachte, licht frisse roomtoets.',
      afbeelding: 'assets/kaastalogus/Cremeux-de-Bourgogne.png',
    },
    {
      naam: "Bleu d'Auvergne",
      beschrijving:
        'Franse blauwschimmelkaas van koemelk met een romig karakter, aardse tonen en milde pit.',
      afbeelding: 'assets/kaastalogus/Bleu-d-Auvergne.png',
    },
  ];
}
