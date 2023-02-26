import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {NgbAlertModule, NgbNavModule} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'JavaMondays';
  active = 1;
}
