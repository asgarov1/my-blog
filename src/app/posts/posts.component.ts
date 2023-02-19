import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  active = "one";

  // TODO: change to include dates written as well
  posts = ["one", "two", "three"];

  constructor() {
  }

  ngOnInit(): void {
  }

  getPath(post: string): string {
    return `./assets/posts/${post}.md`
  }
}
