import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { FiokService } from './fiok.service';
import { Fooldal } from './fooldal/fooldal';
import { Naptar } from './naptar/naptar';
import { Tanarok } from './tanarok/tanarok';

const csakKijelentkezve = () => {
    const fiok = inject(FiokService);
    const router = inject(Router);
    return fiok.allapotBetoltese().pipe(
        map(() => fiok.fiok() ? router.createUrlTree(['/fooldal']) : true),
        catchError(() => of(router.createUrlTree(['/fooldal']))),
    );
};

export const routes: Routes = [
    {path:'', redirectTo:'fooldal', pathMatch:'full'},
    {path:'fooldal', component:Fooldal},
    {path:'bejelentkezes', canActivate: [csakKijelentkezve], loadComponent: () => import('./bejelentkezes/bejelentkezes').then(m => m.Bejelentkezes)},
    {path:'regisztracio', canActivate: [csakKijelentkezve], loadComponent: () => import('./regisztracio/regisztracio').then(m => m.Regisztracio)},
    {path:'naptar', component:Naptar},
    {path:'tanarok', component:Tanarok},
    {path:'profil', loadComponent: () => import('./profil/profil').then(m => m.Profil)}
];
