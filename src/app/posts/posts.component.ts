import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit{

  post = "";
  href = "";
  constructor(private route: ActivatedRoute) { }
  ngOnInit(): void {
    let articleName = this.route.snapshot.paramMap.get('article');
    this.href = window.location.href;
    this.post = './assets/posts/' + articleName + '.md';
  }
}
