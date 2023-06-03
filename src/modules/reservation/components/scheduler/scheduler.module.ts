import {DataService} from "./data.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {SchedulerComponent} from "./scheduler.component";
import {DayPilotModule} from "daypilot-pro-angular";
import {SidebarModule} from "../sidebar/sidebar.module";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  imports:      [  ReactiveFormsModule, FormsModule, HttpClientModule, SidebarModule, DayPilotModule ],
  declarations: [
    SchedulerComponent
  ],
  exports:      [ SchedulerComponent ],
  providers:    [ DataService ]
})
export class SchedulerModule { }
