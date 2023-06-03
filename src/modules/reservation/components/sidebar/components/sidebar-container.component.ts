import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ContentChild,
  DoCheck
} from "@angular/core";
import {
  style,
  state,
  animate,
  transition,
  trigger,
} from "@angular/animations";
import {SidebarExpandedComponent} from "./sidebar-expanded.component";
import {SidebarMainComponent} from "./sidebar-main.component";

@Component({
  selector: 'sidebar-container',
  styles: [`
  .sidebar-container {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
    flex-direction: row;
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
  }
  .sidebar-main {
    -webkit-flex: auto;
    flex: auto;
    height: 100%;
    overflow: hidden;
    position: relative;
    overflow-y: auto;
  }
  .sidebar-collapsed {
    overflow:hidden;
    position: relative;
    height: 100%;
    xbackground-color: #e0e0e0;
    box-shadow: 5px 0px 10px -2px rgba(0,0,0,0.2);
    z-index: 10;
  }
  .sidebar-expanded {
    overflow:hidden;
    position: relative;
    height: 100%;
    xbackground-color: #e0e0e0;
    /*overflow-y:auto;*/
    box-shadow: 5px 0px 10px -2px rgba(0,0,0,0.2);
    z-index: 10;
  }
  .sidebar-expanded-full {
    height: calc(100% - 30px);
    overflow-y: auto;
    overflow-x: hidden;
    width:100%;
  }
  .sidebar-separator {
    width: 1px;
    background-color: #c0c0c0;
    height: 100%;
  }
  .sidebar-icon-action {
    padding: 5px 8px;
    cursor: pointer;
    font-size: 16px;
    width: 30px;
    box-sizing: border-box;
    text-align: center;
  }
  .sidebar-icon-action:hover {
    xbackground-color: #c0c0c0;
  }
  .sidebar-header {
    white-space: nowrap;
    height: 30px;
    xbackground-color: #d0d0d0;
  }
  .sidebar-header .sidebar-icon-action {
    float:right;
  }
  `],
  template: `
  <div class="sidebar-container">
    <div class="sidebar-expanded" [@slideExpanded]="state">
      <div class="sidebar-header"><span class="sidebar-icon-action" (click)="toggle()">&laquo;</span></div>
      <div class="sidebar-expanded-full">
        <ng-content select="sidebar-expanded"></ng-content>
      </div>
    </div>
    <div class="sidebar-collapsed" [@slideCollapsed]="state">
      <div class="sidebar-header"><span class="sidebar-icon-action" (click)="toggle()">&raquo;</span></div>
      <ng-content select="sidebar-collapsed"></ng-content>
    </div>
    <div class="sidebar-separator"></div>
    <div class="sidebar-main">
      <ng-content select="sidebar-main"></ng-content>
    </div>
  </div>`,
  animations: [
    trigger('slideExpanded', [
      state('visible', style({ width: '*', display: 'block' })),
      state('hidden', style({ width: '0px', display: 'none'})),
      transition('hidden <=> visible', animate('200ms ease'))
    ]),
    trigger('slideCollapsed', [
      state('visible', style({ width: '0px', display: 'none' })),
      state('hidden', style({ width: '*', display: 'block'})),
      transition('hidden <=> visible', animate('200ms ease'))
    ]),
  ],
})
export class SidebarContainerComponent implements OnInit, DoCheck {
  @ContentChild(SidebarExpandedComponent) left!: SidebarExpandedComponent;
  @ContentChild(SidebarMainComponent) main!: SidebarMainComponent;

  state: "visible" | "hidden" = "visible";

  @Input()
  expanded: boolean = true;

  @Output()
  expandedChange: EventEmitter<boolean> = new EventEmitter();

  ngOnInit() {}

  ngDoCheck() {
    this.state = this.expanded ? "visible" : "hidden";
  }

  toggle() {
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
  }


}
