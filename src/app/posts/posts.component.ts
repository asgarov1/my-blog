import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Post} from "../domain/post";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  active = "one";

  posts = [
    "2023-02-15_angular_blog_with_aws.md",
    "2022-11-02_three.md",
    "2022-10-18_two.md",
    "2022-10-01_one.md",
  ];

  constructor() {

  }

  ngOnInit(): void {
  }

  getPath(postPath: string): string {
    return `./assets/posts/${postPath}`
  }

  getPostName(postPath: string) {
    let firstLetterIndex = postPath.indexOf("_") + 1;
    let fileExtensionIndex = postPath.indexOf(".md");
    return postPath.substring(firstLetterIndex, fileExtensionIndex).replaceAll("_", " ");
  }

  getPostDate(postPath: string) {
    let firstLetterIndex = postPath.indexOf("_");
    return postPath.substring(0,firstLetterIndex);
  }

  getPostLinkName(postPath: string) {
    return `(${this.getPostDate(postPath)}) ${this.getPostName(postPath)}`
  }
}
