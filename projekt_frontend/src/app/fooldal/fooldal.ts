import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FiokService } from '../fiok.service';

@Component({
  imports: [RouterLink],
  selector: 'app-fooldal',
  styleUrl: './fooldal.css',
  templateUrl: './fooldal.html',
})
export class Fooldal {
  protected readonly fiok = inject(FiokService);
}
