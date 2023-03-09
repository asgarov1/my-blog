import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NgbNavChangeEvent} from "@ng-bootstrap/ng-bootstrap/nav/nav";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  posts = [
    "2023-03-01_passing_oracle_java_17_certification.md",
    "2023-02-15_angular_blog_with_markdown_hosted_on_aws.md",
  ];

  postsCopy = [...this.posts]

  active = this.posts[0];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    const postParam = this.activatedRoute.snapshot.queryParamMap.get('post');
    if (postParam) {
      this.active = this.posts[+postParam]
    } else {
      this.updateUrl({nextId: this.posts[0]} as NgbNavChangeEvent)
    }
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
    return postPath.substring(0, firstLetterIndex);
  }

  getPostLinkName(postPath: string) {
    return `(${this.getPostDate(postPath)}) ${this.getPostName(postPath)}`
  }

  /**
   * This updates the url params without navigating
   *
   * The idea is that when a user switches blogposts we want to update url so that the user can copy this url or refresh
   * page
   *
   * TODO need to switch from ids to actual post name to avoid problems that urls will change if I ever reorder the array
   * @param event
   */
  updateUrl(event: NgbNavChangeEvent) {
    const queryParams: Params = {post: this.posts.indexOf(event.nextId)};

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }

  filter(filterInput: string) {
    this.postsCopy = [...this.posts].filter(post => post.includes(filterInput) || post === this.active)
  }
}
