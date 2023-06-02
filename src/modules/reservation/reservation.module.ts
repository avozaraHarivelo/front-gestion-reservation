/* tslint:disable: ordered-imports*/
import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/* Modules */
import { AppCommonModule } from '@common/app-common.module';
import { NavigationModule } from '@modules/navigation/navigation.module';
import {DayPilotModule} from 'daypilot-pro-angular';


/* Containers */
import * as tableauxContainers from './containers';

/* Components */
import * as tableauxComponents from './components';

/* Directives */
import * as tablesDirectives from './../tables/directives';

/* Guards */
import * as tablesGuards from './../tables/guards';

/* Services */
import * as tablesServices from './../tables/services';
import { DataService } from './components/scheduler/data.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        AppCommonModule,
        NavigationModule,
        DayPilotModule
    ],
    providers: [
        DecimalPipe,
        ...tablesServices.services,
        ...tablesGuards.guards,
        ...tablesDirectives.directives,
        DataService
    ],
    declarations: [ 
        ...tableauxContainers.containers,
        ...tableauxComponents.components,
        ...tablesDirectives.directives,],
    exports: [],
})
export class ReservationModule {}
