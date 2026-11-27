import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-naptar',
  styleUrl: './naptar.css',
  templateUrl: './naptar.html',
})
export class Naptar {
  protected readonly foglalhato=signal("Szabad időpontok");
  protected readonly foglalt=signal("Foglalt időpontok");
}