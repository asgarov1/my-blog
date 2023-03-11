# Angular reading static files at build time

---

So for this blog actually, I had the issue that I wanted to read the static blog posts
(the .md files under src/assets/posts/) dynamically so that I can just add a new blog post
and not have to worry about remembering to add it to some json/ts file.

The issue was that Angular, being client side framework, doesn't have the ability to read 
static folders at runtime. Therefore I incorporated the reading of the static blog files 
into build:

1. First I added the `pre-build` command that lists and saved all the .md files into `posts.ts`
as an exported array
```
  "scripts": {
     ...
    "pre-build": "echo 'export default [' > posts.ts; ls src/assets/posts/ | tac | awk '{ print \"\\\"\"$0\"\\\",\"}' >> posts.ts; echo ']' >> posts.ts;",
    "build": "npm run pre-build && ng build",
  },
```
2. And then in Angular I read from posts.ts:
```
import posts from "../../../posts"

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  originalPosts = posts;
  
  // rest of the class
}
```
3. And lastly I included my posts.ts file in tsconfig.app.json:
```
  ...
  "files": [
    "src/main.ts",
    "posts.ts"
  ],
  ...
```

---

To explain the pre-build command: it consists of 3 bash commands:

1. `echo 'export default [' > posts.ts;` Clears the file and writes export default `[` to the `posts.ts`
2. `ls src/assets/posts/ | tac | awk '{ print "\""$0"\","}' >> posts.ts;` Lists all filenames in `src/assets/posts/`, 
reverse sorts them (with `tac`), surrounds them with quotes (with `awk`) and appends to 
`posts.ts`
3. `echo ']' >> posts.ts;` appends closing `]` to the file.


