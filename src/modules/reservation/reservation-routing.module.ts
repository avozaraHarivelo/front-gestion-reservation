/* tslint:disable: ordered-imports*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


/* Containers */
import * as ReservationContainers from './containers';

import { SBRouteData } from '@modules/navigation/models';
import { ReservationModule } from './reservation.module';

/* Routes */
export const ROUTES: Routes = [
    {
        path: '',
        canActivate: [],
        component: ReservationContainers.ReservationComponent,
        data: {
            title: 'Réservation & Planning',
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    link: '/dashboard',
                },
                {
                    text: 'Réservation & Planning',
                    active: true,
                },
            ],
        } as SBRouteData,
    },
];

@NgModule({
    imports: [ReservationModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class ReservationRoutingModule {}
