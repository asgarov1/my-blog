import {NgModule, SecurityContext} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {RouterModule} from "@angular/router";
import {MarkdownModule, MarkedOptions} from "ngx-markdown";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { PostsComponent } from './posts/posts.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from "./material/material.module";
import {MatTabsModule} from "@angular/material/tabs";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import { NavComponent } from './nav/nav.component';

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    NavComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path: 'posts/post/:article', component: PostsComponent},
    ]),
    MarkdownModule.forRoot({
      loader: HttpClient, // optional, only if you use [src] attribute
      sanitize: SecurityContext.NONE,
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          gfm: true,
          breaks: false,
          pedantic: false,
          smartLists: true,
          smartypants: false,
        },
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

