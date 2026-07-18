import { Component } from '@angular/core';

type Kaas = {
  naam: string;
  beschrijving: string;
};

@Component({
  selector: 'app-kaastalogus',
  standalone: true,
  templateUrl: './kaastalogus.html',
  styleUrl: './kaastalogus.scss',
})
export class KaastalogusComponent {
  readonly kazen: Kaas[] = [
    {
      naam: 'Roquefort',
      beschrijving: 'Franse blauwschimmelkaas van schapenmelk met een pittige, ziltige smaak en romige textuur.',
    },
    {
      naam: 'Gorgonzola',
      beschrijving: 'Italiaanse blauwaderkaas van koemelk; zacht en romig met een lichte tot krachtige scherpte.',
    },
    {
      naam: 'Blue Stilton',
      beschrijving: 'Engelse klassieker met kruimelige, romige structuur en diepe, nootachtige blauwe smaak.',
    },
    {
      naam: 'Delice de Bourgogne',
      beschrijving: 'Rijke Franse triple-creme kaas met een fluweelzachte binnenkant en boterige, milde smaak.',
    },
    {
      naam: 'Cremeux de Bourgogne',
      beschrijving: 'Zeer romige Bourgondische kaas met witte korst en een zachte, licht frisse roomtoets.',
    },
    {
      naam: "Bleu d'Auvergne",
      beschrijving: 'Franse blauwschimmelkaas van koemelk met een romig karakter, aardse tonen en milde pit.',
    },
  ];
}

