import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {SidebarMainComponent} from "./components/sidebar-main.component";
import {SidebarExpandedComponent} from "./components/sidebar-expanded.component";
import {SidebarContainerComponent} from "./components/sidebar-container.component";
import {SidebarCollapsedComponent} from "./components/sidebar-collapsed.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  imports:      [
  ],
  declarations: [
    SidebarContainerComponent,
    SidebarExpandedComponent,
    SidebarCollapsedComponent,
    SidebarMainComponent
  ],
  exports:      [
    SidebarContainerComponent,
    SidebarExpandedComponent,
    SidebarCollapsedComponent,
    SidebarMainComponent ],
  providers:    [  ]
})
export class SidebarModule { }
