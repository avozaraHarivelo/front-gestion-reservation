import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'sb-tableaux',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './tableaux.component.html',
    styleUrls: ['tableaux.component.scss'],
})
export class ReservationComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}
