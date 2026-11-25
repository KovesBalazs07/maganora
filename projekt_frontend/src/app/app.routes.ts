import { Routes } from '@angular/router';
import { Fooldal } from './fooldal/fooldal';
import { Bejelentkezes } from './bejelentkezes/bejelentkezes';
import { Regisztracio } from './regisztracio/regisztracio';
import { Naptar } from './naptar/naptar';
import { Profil } from './profil/profil';

export const routes: Routes = [
    {path:'', redirectTo:'fooldal', pathMatch:'full'},
    {path:'fooldal', component:Fooldal},
    {path:'bejelentkezes', component:Bejelentkezes},
    {path:'regisztracio', component:Regisztracio},
    {path:'naptar', component:Naptar},
    {path:'profil', component:Profil}
];