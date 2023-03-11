import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NgbNavChangeEvent} from "@ng-bootstrap/ng-bootstrap/nav/nav";
import {StringUtil} from "../util/string-util";
import posts from "../../../posts"
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  originalPosts = posts;

  postsCopy = [...this.originalPosts]

  active = this.originalPosts[0];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    const postParam = this.activatedRoute.snapshot.queryParamMap.get('post');
    if (postParam) {
      this.active = postParam
    } else {
      this.updateUrl({nextId: this.originalPosts[0]} as NgbNavChangeEvent)
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

  getPostLinkName(postPath: string): string {
    return StringUtil.capitalizeFirstLetter(this.getPostName(postPath))
  }

  getPostToolTip(postPath: string): string {
    return this.getPostDate(postPath) + ' ' + this.getPostLinkName(postPath)
  }

  /**
   * This updates the url params without navigating
   *
   * The idea is that when a user switches blogposts we want to update url so that the user can copy this url or refresh
   * page
   *
   * @param event
   */
  updateUrl(event: NgbNavChangeEvent) {
    const queryParams: Params = {post: event.nextId};

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }

  filter(filterInput: string) {
    this.postsCopy = [...this.originalPosts].filter(post => post.includes(filterInput) || post === this.active)
  }

  validateAll(word = "apple") {
    const result = [
      (input: string) => input.length != 5,
      (input: string) => input !== "some word",
      (input: string) => {throw new Error("will get thrown no matter which input!")}
    ]
      .find(validator => validator(word)) || false;
    console.log(result)
  }
}
