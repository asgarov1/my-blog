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
    '2023-03-01_passing_oracle_java_17_certification.md',
    '2023-02-15_angular_blog_with_markdown_hosted_on_aws.md',
    '2023-02-08_vim_cheatsheet.md',
    '2022-11-05_my_amazon_interview_experience_passed.md',
    '2022-08-25_multistage_docker_builds.md',
    '2022-08-17_logging_filter_that_reads_and_passes_request_further.md',
    '2022-08-16_extending_junit5_with_custom_annotations.md',
    '2022-08-14_deleting_files_from_git_history.md',
    '2022-08-05_jackson_bean_deserializer_modifier.md',
    '2022-07-08_angular_recipes.md',
    '2022_04_15_git_prev_and_next.md',
    '2022-04-07_rest_call_with_vanilla_java_11_and_8.md',
    '2022-04-03_remote_debugging.md',
    '2021-04-24_passing_oracle_java_se_11_developer_1z0-819-J.md',
    '2021-04-11_java_8_map_methods_compute_and_merge.md',
    '2020-12-27_docker_101.md',
    '2020-12-26_passing_aws_cloud_practitioner_certification.md',
    '2020-09-29_aws_s3_better_than_dropbox.md',
    '2020-08-22_letting_gradle_and_google_jib_create_docker_images_for_you.md',
    '2020-08-15_passing_pivotals_spring_certified_professional.md',
    '2020-08-10_running_spring_boot_app_inside_of_docker.md',
    '2020-07-28_testing_spring_boot.md',
    '2020-07-11_spring_transactions_explained.md',
    '2019-09-18_how_i_passed_ocp_java_8.md',
  ];

  postsCopy = [...this.posts]

  active = this.posts[0];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    const postParam = this.activatedRoute.snapshot.queryParamMap.get('post');
    if (postParam) {
      this.active = postParam
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
    this.postsCopy = [...this.posts].filter(post => post.includes(filterInput) || post === this.active)
  }
}
