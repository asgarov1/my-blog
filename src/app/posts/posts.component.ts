import {Component} from '@angular/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent {

  posts = [
    "2023-03-01_passing_oracle_java_17_certification.md",
    "2023-02-15_angular_blog_with_markdown_hosted_on_aws.md",
  ];

  active = this.posts[0];

  constructor() {
  }

  getPath(postPath: string): string {
    return `./assets/posts/${postPath}`
  }

  getPostName(postPath: string) {
    let firstLetterIndex = postPath.indexOf("_") + 1;
    let fileExtensionIndex = postPath.indexOf(".md");
    return postPath
      .substring(firstLetterIndex, fileExtensionIndex)
      .replaceAll("_", " ");
  }

  getPostDate(postPath: string) {
    let firstLetterIndex = postPath.indexOf("_");
    return postPath.substring(0,firstLetterIndex);
  }

  getPostLinkName(postPath: string) {
    return `(${this.getPostDate(postPath)}) ${this.getPostName(postPath)}`
  }
}
