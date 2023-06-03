import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {DayPilot, DayPilotNavigatorComponent, DayPilotSchedulerComponent} from 'daypilot-pro-angular';
import {
  DataService,
  MoveReservationParams,
} from './data.service';
import {Router} from '@angular/router';
import Modal = DayPilot.Modal;
import ModalFormItem = DayPilot.ModalFormItem;
import ModalFormOption = DayPilot.ModalFormOption;

@Component({
  selector: 'scheduler-component',
  template: `
    <sidebar-container #sidebar [(expanded)]="expanded">
      <sidebar-expanded>
        <div style="padding: 3px;">
          <daypilot-navigator [config]="navigatorConfig" (dateChange)="dateChange()" #navigator></daypilot-navigator>
        </div>
      </sidebar-expanded>
      <sidebar-collapsed></sidebar-collapsed>
      <sidebar-main>
        <div class="main-header">
          <button (click)="createRoom()">Add Room...</button>
        </div>
        <div class="main-body">
          <daypilot-scheduler [config]="config" [events]="events" (viewChange)="viewChange($event)" #scheduler></daypilot-scheduler>
          <div class="main-bottom"></div>
        </div>
      </sidebar-main>
    </sidebar-container>
  `,
  styles: [`

    h2 {
      padding-left: 5px;
      margin: 0;
    }

    input[type=checkbox] {
      vertical-align: middle;
      position: relative;
      bottom: 1px;
    }

    button {
      display: inline-block;
      text-align: center;
      background-color: #3c78d8;
      border: 1px solid #1155cc;
      color: #fff;
      padding: 6px 20px;
      border-radius: 2px;
      cursor: pointer;
      margin-right: 5px;
      /*width: 80px;*/
      text-decoration: none;
    }

    .main-header {
      white-space: nowrap;
      display: block;
      height: 60px;
      border-bottom: 1px solid #ccc;
      box-sizing: border-box;
      padding: 15px;
      background-color: #f3f3f3;
    }

    .main-body {
      position: absolute;
      left: 0px;
      right: 0px;
      top: 60px;
      bottom: 0px;
      overflow: hidden;
      box-sizing: border-box;
      /*padding: 10px;*/
      background-color: #f3f3f3;
    }

    .main-bottom {
      border-top: 1px solid #ccc;
    }

    .row {
      margin-top: 2px;
      white-space: nowrap;
      display: block;
    }

    ::ng-deep :not(.scheduler_default_rowheader_col) .scheduler_default_rowheader_inner {
      padding-left: 10px;
    }

    ::ng-deep .scheduler_default_columnheader_cell:first-of-type .scheduler_default_columnheader_cell_inner {
      padding-left: 10px;
      box-sizing: border-box;
    }

  `]
})
export class SchedulerComponent implements AfterViewInit {

  @ViewChild('scheduler') scheduler!: DayPilotSchedulerComponent;
  @ViewChild('navigator') navigator!: DayPilotNavigatorComponent;

  events: DayPilot.EventData[] = [];

  expanded = true;

  navigatorConfig: DayPilot.NavigatorConfig = {
    showMonths: 1,
    skipMonths: 1,
    selectMode: 'Month'
  };

  month = {
    from: null,
    to: null
  };

  menuRoom: DayPilot.Menu = new DayPilot.Menu({
    items: [
      {
        text: 'Edit...', onClick: args => { this.editRoom(args.source); }
      },
      {
        text: 'Delete', onClick: args => {
          const row = args.source;
          this.ds.deleteRoom(row.id).subscribe(result => {
            row.remove();
            this.scheduler.control.message('Room deleted.');
          });
        }
      }
    ]
  });

  config: DayPilot.SchedulerConfig = {
    scale: 'Manual',
    timeline: [],
    timeHeaders: [{groupBy: 'Month', format: 'MMMM yyyy'}, {groupBy: 'Day', format: 'd'}],
    eventDeleteHandling: 'Update',
    allowEventOverlap: false,
    cellWidthSpec: 'Auto',
    eventHeight: 80,
    rowHeaderColumns: [
      {title: 'Room', display: 'name'},
      {title: 'Capacity'},
      {title: 'Status', display: 'status'}
    ],
    resources: [],
    contextMenuResource: this.menuRoom,
    onBeforeRowHeaderRender: args => {
      const beds = (count: number) => {
        return count + ' bed' + (count > 1 ? 's' : '');
      };

      args.row.columns[1].html = beds(args.row.data.capacity);

      let color = '';
      switch (args.row.data.status) {
        case 'Ready':
          color = 'green';
          break;
        case 'Dirty':
          color = 'red';
          break;
        case 'Cleanup':
          color = 'orange';
          break;
      }

      // status
      args.row.columns[2].areas = [];
      args.row.columns[2].areas.push({
        right: 2,
        top: 2,
        bottom: 2,
        width: 3,
        backColor: color
      });

      // context menu icon
      args.row.columns[0].areas = [];
      args.row.columns[0].areas.push({
        top: 3,
        right: 4,
        visibility: 'Hover',
        style: 'font-size: 12px; background-color: #f9f9f9; border: 1px solid #ccc; padding: 2px 2px 0px 2px; cursor:pointer',
        icon: 'icon-triangle-down',
        action: 'ContextMenu'
      });
    },
    onEventMoved: args => {
      const params: MoveReservationParams = {
        id: args.e.id(),
        start: args.newStart,
        end: args.newEnd,
        room: args.newResource
      };
      this.ds.moveReservation(params).subscribe(result => this.scheduler.control.message('Reservation moved.'));
    },
    onEventResized: args => {
      const params: MoveReservationParams = {
        id: args.e.id(),
        start: args.newStart,
        end: args.newEnd,
        room: args.e.resource()
      };
      this.ds.moveReservation(params).subscribe(result => this.scheduler.control.message('Reservation moved.'));
    },
    onEventDeleted: args => {
      this.ds.deleteReservation(args.e.id()).subscribe(result => this.scheduler.control.message('Reservation deleted.'));
    },
    onTimeRangeSelected: async args => {

      const form: ModalFormItem[] = [
        {
          name: 'Guest name',
          id: 'name',
          type: 'text',
        },
        {
          type: 'select',
          id: 'room',
          name: 'Room',
          options: this.config.resources as ModalFormOption[],
        },
        {
          type: 'date',
          id: 'start',
          name: 'Start',
          dateFormat: 'd/M/yyyy',
        },
        {
          type: 'date',
          id: 'end',
          name: 'End',
          dateFormat: 'd/M/yyyy',
        },
      ];
      const data = {
        start: args.start,
        end: args.end,
        room: args.resource
      };

      const modal = await Modal.form(form, data);
      this.scheduler.control.clearSelection();
      if (modal.canceled) {
        return;
      }

      const result = await this.ds.createReservation(modal.result).toPromise();

      this.events.push(result);
      this.scheduler.control.message('Reservation created.');
    },
    onEventClick: async args => {

      const form: ModalFormItem[] = [
        {
          name: 'Guest name',
          id: 'text',
          type: 'text',
        },
        {
          type: 'select',
          id: 'resource',
          name: 'Room',
          options: this.config.resources as ModalFormOption[],
        },
        {
          type: 'date',
          id: 'start',
          name: 'Start',
          dateFormat: 'd/M/yyyy',
        },
        {
          type: 'date',
          id: 'end',
          name: 'End',
          dateFormat: 'd/M/yyyy',
        },
        {
          type: 'select',
          id: 'status',
          name: 'Status',
          options: [
            { name: "New", id: "New"},
            { name: "Confirmed", id: "Confirmed"},
            { name: "Arrived", id: "Arrived"},
            { name: "Checked Out", id: "CheckedOut"},
          ],
        },
        {
          type: 'select',
          id: 'paid',
          name: 'Paid',
          options: [
            { name: "0%", id: "0"},
            { name: "50%", id: "50"},
            { name: "100%", id: "100"},
          ],
        },
      ];

      const data = args.e.data;

      const modal = await Modal.form(form, data);

      if (modal.canceled) {
        return;
      }

      const result = await this.ds.updateReservation(modal.result).toPromise();
      args.e.data.text = result.text;
      args.e.data.start = result.start;
      args.e.data.end = result.end;
      args.e.data.status = result.status;
      args.e.data.paid = result.paid;
      args.e.data.resource = result.resource;

      this.scheduler.control.message('Reservation updated.');

    },
    onBeforeEventRender: args => {
      const start = new DayPilot.Date(args.data.start);
      const end = new DayPilot.Date(args.data.end);

      const now = new DayPilot.Date();
      const today = DayPilot.Date.today();
      let status = '';

      // customize the reservation bar color and tooltip depending on status
      switch (args.e.status) {
        case 'New':
          const in2days = today.addDays(1);

          if (start < in2days) {
            args.data.barColor = 'red';
            status = 'Expired (not confirmed in time)';
          } else {
            args.data.barColor = 'orange';
            status = 'New';
          }
          break;
        case 'Confirmed':
          const arrivalDeadline = today.addHours(18);

          if (start < today || (start === today && now > arrivalDeadline)) { // must arrive before 6 pm
            args.data.barColor = '#f41616';  // red
            status = 'Late arrival';
          } else {
            args.data.barColor = 'green';
            status = 'Confirmed';
          }
          break;
        case 'Arrived': // arrived
          const checkoutDeadline = today.addHours(10);

          if (end < today || (end === today && now > checkoutDeadline)) { // must checkout before 10 am
            args.data.barColor = '#f41616';  // red
            status = 'Late checkout';
          } else {
            args.data.barColor = '#1691f4';  // blue
            status = 'Arrived';
          }
          break;
        case 'CheckedOut': // checked out
          args.data.barColor = 'gray';
          status = 'Checked out';
          break;
        default:
          status = 'Unexpected state';
          break;
      }

      // customize the reservation HTML: text, start and end dates
      args.data.html = '<div>' + args.data.text + ' (' + start.toString('M/d/yyyy') + ' - ' + end.toString('M/d/yyyy') + ')' + '<br /><span style=\'color:gray\'>' + status + '</span></div>';

      // reservation tooltip that appears on hover - displays the status text
      args.e.toolTip = status;

      // add a bar highlighting how much has been paid already (using an "active area")
      const paid = args.e.paid;
      const paidColor = '#aaaaaa';
      args.data.areas = [
        {bottom: 10, right: 4, html: '<div style=\'color:' + paidColor + '; font-size: 8pt;\'>Paid: ' + paid + '%</div>', v: 'Visible'},
        {
          left: 4,
          bottom: 8,
          right: 4,
          height: 2,
          html: '<div style=\'background-color:' + paidColor + '; height: 100%; width:' + paid + '%\'></div>'
        }
      ];

    },
    heightSpec: 'Max100Pct',
    hideBorderFor100PctHeight: true
  };

  constructor(private ds: DataService, private router: Router) {
  }

  getTimeline(date?: DayPilot.Date | string): any[] {
    date = date || this.navigator.control.selectionDay;
    const start = new DayPilot.Date(date).firstDayOfMonth();
    const days = start.daysInMonth();

    const timeline = [];

    const checkin = 12;
    const checkout = 12;

    for (let i = 0; i < days; i++) {
      const day = start.addDays(i);
      timeline.push({start: day.addHours(checkin), end: day.addDays(1).addHours(checkout)});
    }

    return timeline;
  }

  ngAfterViewInit(): void {
    this.dateChange();
    this.ds.getRooms().subscribe(result => this.config.resources = result);
  }

  viewChange(args: any) {
    // quit if the date range hasn't changed
    if (!args.visibleRangeChanged) {
      return;
    }

    const from = this.scheduler.control.visibleStart();
    const to = this.scheduler.control.visibleEnd();

    this.ds.getReservations(from, to).subscribe(result => {
      this.events = result;
    });
  }

  dateChange() {
    this.config.timeline = this.getTimeline(this.navigator.control.selectionStart);
  }

  async createRoom() {

    const form = [
      {
        name: 'Name',
        id: 'name',
        type: 'text',
      },
      {
        type: 'select',
        id: 'capacity',
        name: 'Beds',
        options: [
          {name: '1 bed', id: 1,},
          {name: '2 beds', id: 2,},
          {name: '3 beds', id: 3,},
          {name: '4 beds', id: 4,},
        ],
      },
    ];
    const data = {
      capacity: 2
    };

    const modal = await Modal.form(form, data);
    if (modal.canceled) {
      return;
    }
    const room = await this.ds.createRoom(modal.result).toPromise();

    // @ts-ignore
    this.config.resources.push(room);
    this.scheduler.control.message('Room created.');

  }

  async editRoom(row: DayPilot.Row) {
    const form = [
      {
        name: 'Name',
        id: 'name',
        type: 'text',
      },
      {
        type: 'select',
        id: 'capacity',
        name: 'Beds',
        options: [
          {name: '1 bed', id: 1,},
          {name: '2 beds', id: 2,},
          {name: '3 beds', id: 3,},
          {name: '4 beds', id: 4,},
        ],
      },
      {
        type: 'select',
        id: 'status',
        name: 'Status',
        options: [
          {name: 'Ready', id: 'Ready',},
          {name: 'Cleanup', id: 'Cleanup',},
          {name: 'Dirty', id: 'Dirty',},
        ]
      }
    ];
    const data = row.data;

    const modal = await Modal.form(form, data);
    if (modal.canceled) {
      return;
    }

    const result = await this.ds.updateRoom(modal.result).toPromise();

    // update the client-side resource object
    row.data.name = result.name;
    row.data.capacity = result.capacity;
    row.data.status = result.status;

    this.scheduler.control.message('Room updated.');

  }

}

