import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {DayPilot, DayPilotSchedulerComponent} from 'daypilot-pro-angular';
import { DataService } from './data.service';

@Component({
  selector: 'scheduler-component',
  template: `<daypilot-scheduler [config]="config" [events]="events" #scheduler></daypilot-scheduler>`,
  styles: [``]
})
export class SchedulerComponent implements AfterViewInit {

  @ViewChild('scheduler')
  scheduler!: DayPilotSchedulerComponent;

  events: DayPilot.EventData[] = [];

  config: DayPilot.SchedulerConfig = {
    timeHeaders: [
      {groupBy: "Month"},
      {groupBy: "Day", format: "d"}
    ],
    scale: "Day",
    days: 31,
    startDate: "2023-10-01",
    rowHeaderColumns: [
      {text: "Name", display: "name", sort: "name"},
      {text: "Capacity", display: "capacity", sort: "capacity"}
    ],
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: async (args) => {
      const dp = args.control;
      const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
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
        { text: "Edit...",
          onClick: async args => {
            const e = args.source;
            this.editEvent(e);
          }
        },
        { text: "Delete",
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
      args.control.message("Event moved: " + args.e.text());
    },
    eventResizeHandling: "Update",
    onEventResized: (args) => {
      args.control.message("Event resized: " + args.e.text());
    },
    treeEnabled: true,
  };

  constructor(private ds: DataService) {
  }

  async editEvent(e: DayPilot.Event): Promise<void> {
    const form = [
      { name: "Name", id: "text", type: "text"},
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

