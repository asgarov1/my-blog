import {NgModule, SecurityContext} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlogViewComponent } from './blog-view/blog-view.component';
import { BlogPostViewComponent } from './blog-post-view/blog-post-view.component';
import {RouterModule} from "@angular/router";
import {MarkdownModule, MarkedOptions} from "ngx-markdown";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { PostsComponent } from './home/posts/posts.component';

@NgModule({
  declarations: [
    AppComponent,
    BlogViewComponent,
    BlogPostViewComponent,
    PostsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: BlogPostViewComponent},
        { path: 'posts/post/:article', component: PostsComponent },

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

