import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NgbNavChangeEvent} from "@ng-bootstrap/ng-bootstrap/nav/nav";
import {StringUtil} from "../util/string-util";
import completeListOfPosts from "../../../posts"

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  posts = [...completeListOfPosts]

  active = this.posts[0];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    const postParam = this.activatedRoute.snapshot.queryParamMap.get('post');
    if (postParam) {
      if (postParam.includes("#")) {
        // hash is not part of the markdown file name we need to load (hashes are used to create links within the page)
        this.active = postParam.substring(0, postParam.indexOf("#"));
      }
      this.active = postParam;
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

  getPostLinkName(postPath: string): string {
    return StringUtil.capitalizeFirstLetter(this.getPostName(postPath))
  }

  getPostToolTip(postPath: string): string {
    return this.getPostDate(postPath) + ' ' + this.getPostLinkName(postPath)
  }

  filter(filterInput: string) {
    this.posts = [...completeListOfPosts]
      .filter(post => this.getPostName(post).toLowerCase().includes(filterInput.toLowerCase()));
    this.updateUrl({nextId: this.posts[0]} as NgbNavChangeEvent);
    this.active = this.posts[0];
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

  private getPostDate(postPath: string): string {
    let firstLetterIndex = postPath.indexOf("_");
    return postPath.substring(0, firstLetterIndex);
  }

  /**
   * Our markdown posts sometimes have links within the page. These foot-note links will
   * have class 'foot-note' and should add the `#foot-note-[textContent]` to the current URL
   *
   * That way an element `<span class='foot-note'>abc</span>`
   * will navigate to an element with id `foot-note-abc`
   *
   * I couldn't achieve this functionality in Markdown directly, therefore it is implemented here, after
   * markdown is loaded (on `ready`)
   */
  protected addEventListenersToFootNoteLinks() {
    // @ts-ignore
    for (const footNoteElement of document.getElementsByClassName("foot-note")) {
      footNoteElement.addEventListener('click', () => {
        console.log("clicked")
        const endIndex = window.location.href.includes("#") ?
          window.location.href.indexOf("#") :
          window.location.href.length

        const locationWithoutHash = window.location.href.substring(0,endIndex)
        window.location.href = locationWithoutHash + '#foot-note-' + footNoteElement.textContent
      });
    }
  }
}
