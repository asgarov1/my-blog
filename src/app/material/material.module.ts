import { NgModule } from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";

const MATERIAL_COMPONENTS = [
  MatButtonModule,
  MatTabsModule,
  MatToolbarModule,
  MatIconModule,
]

@NgModule({
  imports: [
    MATERIAL_COMPONENTS
  ], exports: [
    MATERIAL_COMPONENTS
  ]
})
export class MaterialModule { }
