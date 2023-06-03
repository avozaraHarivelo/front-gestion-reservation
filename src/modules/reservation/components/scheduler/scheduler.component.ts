import {Component, ViewChild, AfterViewInit, ChangeDetectorRef} from "@angular/core";
import {DayPilot, DayPilotNavigatorComponent, DayPilotSchedulerComponent} from "daypilot-pro-angular";
import {DataService} from "./data.service";

@Component({
  selector: 'scheduler-component',
  template: `
  <sidebar-container #sidebar [(expanded)]="expanded">
    <sidebar-expanded >
      <label class="row"><input type="checkbox" (change)="changeAutoCellWidth($event)"> Largeur automatique</label>
      <div style="padding: 3px;">
      <daypilot-navigator [config]="navigatorConfig" [date]="navigatorDate" (dateChange)="dateChange()" #navigator></daypilot-navigator>
      </div>
    </sidebar-expanded>
    <sidebar-collapsed></sidebar-collapsed>
    <sidebar-main>
      <div class="main-body">
        <daypilot-scheduler [config]="config" [events]="events" (viewChange)="viewChange()" #scheduler></daypilot-scheduler>
        <div class="main-bottom"></div>
      </div>
    </sidebar-main>
  </sidebar-container>
`,
  styles: [`
  .fullscreen { 
    position: absolute; top:90px; left: 0px; right: 0px; bottom: 0px;
  }
  h2 {
    padding-left: 5px;
    margin: 0;
  }

  input[type=checkbox] {
    vertical-align: middle;
    position: relative;
    bottom: 1px;
  }

  .main-header {
    white-space: nowrap;
    display: block;
    height: 30px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
  }
  .main-body {
    position:absolute; left: 0px; right: 0px; top: 0px; bottom: 0px; overflow:hidden;
  }
  .main-bottom {
    border-top: 1px solid #ccc;
  }
  .row {
    margin-top: 2px;
    white-space: nowrap;
    display: block;
    margin-left: auto;
  }

`]
})
export class SchedulerComponent implements AfterViewInit {

  @ViewChild("scheduler") scheduler!: DayPilotSchedulerComponent;
  @ViewChild("navigator") navigator!: DayPilotNavigatorComponent;

  events: DayPilot.EventData[] = [];

  expanded: boolean = true;

  navigatorDate: DayPilot.Date = new DayPilot.Date("2023-06-01");

  navigatorConfig: DayPilot.NavigatorConfig = {
    showMonths: 1,
    skipMonths: 1,
    selectMode: "Month",
    cellHeight: 30,
    cellWidth: 30,
    dayHeaderHeight: 30,
    titleHeight: 30
  };

  config: DayPilot.SchedulerConfig = {
    timeHeaders: [
      {groupBy: "Month"},
      {groupBy: "Day", format: "d"}
    ],
    scale: "Day",
    days: 31,
    startDate: "2023-10-01",
    rowHeaderColumns: [
      {text: "Chambre", display: "chambre", sort: "chambre"},
      {text: "Catégorie", display: "category", sort: "category"},
      {text: "Etat", display: "etat", sort: "etat"}
    ],
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: async (args) => {
      const dp = args.control;
      const modal = await DayPilot.Modal.prompt("Créer un nouvel réservation", "Evenement 1");
      dp.clearSelection();
      if (modal.canceled) { return; }
      dp.events.add({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        resource: args.resource,
        text: modal.result
      });
    },
    contextMenu: new DayPilot.Menu({
      items: [
        { text: "Modifier...",
          onClick: async args => {
            const e = args.source;
            this.editEvent(e);
          }
        },
        { text: "Supprimer",
          onClick: args => {
            const e = args.source;
            this.scheduler.control.events.remove(e);
          }
        }
      ]
    }),
    onBeforeEventRender: args => {
      args.data.areas = [
        {
          right: 5,
          top: 10,
          width: 16,
          height: 16,
          symbol: "assets/daypilot.svg#minichevron-down-2",
          fontColor: "#aaa",
          backColor: "#fff",
          action: "ContextMenu",
          style: "border: 1px solid #aaa",
          visibility: "Hover"
        }
      ];
    },
    // bubble: new DayPilot.Bubble({
    //   onLoad: args => {
    //     args.html = DayPilot.Util.escapeHtml(args.source.data.description || "");
    //   }
    // }),
    onEventClick: args => {
      this.editEvent(args.e);
    },
    eventMoveHandling: "Update",
    onEventMoved: (args) => {
      args.control.message("Réservation déplacé: " + args.e.text());
    },
    eventResizeHandling: "Update",
    onEventResized: (args) => {
      args.control.message("Réservation redimensionné: " + args.e.text());
    },
    treeEnabled: true,
  };

  constructor(private ds: DataService, private cdr: ChangeDetectorRef) {}


  viewChange() {
    const from = this.scheduler.control.visibleStart();
    const to = this.scheduler.control.visibleEnd();
    this.ds.getEvents(from, to).subscribe(result => {
      this.events = result;
    });
  }

  dateChange() {
    this.config.startDate = this.navigator.control.selectionStart;
    this.config.days = new DayPilot.Duration(<DayPilot.Date>this.navigator.control.selectionStart, <DayPilot.Date>this.navigator.control.selectionEnd).totalDays() + 1;
  }

  changeAutoCellWidth(event: Event) {
    const target = <HTMLInputElement>event.target;
    if (target.checked) {
      this.config.cellWidthSpec = "Auto";
    }
    else {
      this.config.cellWidthSpec = "Fixed";
      this.config.cellWidth = 40;
    }
  }



  async editEvent(e: DayPilot.Event): Promise<void> {
    const form = [
      { name: "Nom", id: "text", type: "text"},
      { name: "Description", id: "description", type: "textarea"}
    ];
    const modal = await DayPilot.Modal.form(form, e.data);
    if (modal.canceled) {
      return;
    }
    const updated = modal.result;
    this.scheduler.control.events.update(updated);
  }

  ngAfterViewInit(): void {
    console.log(this.ds.getResources())
    this.ds.getResources().subscribe(result => this.config.resources = result);

    const from = this.scheduler.control.visibleStart();
    const to = this.scheduler.control.visibleEnd();
    this.ds.getEvents(from, to).subscribe(result => {
      this.events = result;
    });
  }


}

