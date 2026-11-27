import { Component,signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-bejelentkezes',
  styleUrl: './bejelentkezes.css',
  templateUrl: './bejelentkezes.html',
})
export class Bejelentkezes {
  protected readonly title=signal('Projekt');
  protected readonly username=signal('Felhasználónév');
  protected readonly email=signal('E-mail-cím');
  protected readonly password=signal('Jelszó');
  protected readonly login=signal('Bejelentkezés');
  protected readonly forgot=signal('Elfelejtett jelszó?');
}