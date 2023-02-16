import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-blog-post-view',
  templateUrl: './blog-post-view.component.html',
  styleUrls: ['./blog-post-view.component.css']
})
export class BlogPostViewComponent implements OnInit, OnDestroy {

  private sub: any = null;

  post = "";

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    console.log("Got called!!!")
    this.sub = this.route.params.subscribe(params => {
      this.post = './assets/blog/post/' +  params['id'] + '.md';
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
