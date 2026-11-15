import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Fooldal } from './fooldal/fooldal';

@Component({
  imports: [RouterOutlet,Fooldal],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('projekt_frontend');
}