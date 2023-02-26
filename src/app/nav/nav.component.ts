import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit{

  readonly HOME = {path: '', tabIndex: 1};
  readonly ABOUT_PATH = {path: '/about', tabIndex: 2} ;

  activeTabIndex = 1;

  ngOnInit(): void {
    // necessary, because otherwise on refresh the activeTabIndex shows tab one as active, even when tab 2 is being refreshed
    this.activeTabIndex = this.getActiveTabId();
  }

  private getActiveTabId(): number {
    if (window.location.pathname.startsWith(this.ABOUT_PATH.path)) {
      return this.ABOUT_PATH.tabIndex;
    }
    return this.HOME.tabIndex;
  }
}
