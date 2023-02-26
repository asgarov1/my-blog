# Angular Blog with Markdown

___

## FrontEnd

In this post I will show you how to create an Angular blog with markdown. For that:

1. Generate your Angular app `ng new blog-app`
2. Install ngx-markdown dependency (for detailed steps
   see [here](https://www.npmjs.com/package/ngx-markdown#installation))

```
npm install ngx-markdown marked --save
npm install @types/marked --save-dev
```

3. Add the Markdown module to your imports:

```
imports: [
   MarkdownModule.forRoot({
   loader: HttpClient, // optional, only if you use [src] attribute
   sanitize: SecurityContext.NONE,
   markedOptions: {
   provide: MarkedOptions,
   useValue: {
A   pedantic: false,
   smartLists: true,
   smartypants: false,
   },
   },
   }),
...
]
```
4. Create your Markdown blog post for example under `src/assets/posts`
<img src="assets/images/markdown_post_structure.png" width="40%" height="40%">

5. Populate it with some Markdown text
6. Create a router link for it
```
<a routerLink="/assets/posts/1_some_post.md" style="margin-bottom:24px">My first blog post</a>
```
7. That's it for the front side, now lets move to deployment.
Feel free to check out my blogs code [here](https://github.com/asgarov1/my-blog)

___

## Deployment to AWS
