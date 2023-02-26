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

1. After creating and connecting to AWS EC2 install nginx (commands are for Ubuntu): `sudo apt update && sudo apt install nginx`
2. Check nginx status `systemctl status nginx` - you should see status "active (running)"
3. Create directory for you application in static files `sudo mkdir /var/www/html/blog`
4. Change into your project directory (on ur machine) and build it for prod (the command is from Angular 14) `ng build --configuration production`
5. Scp contents of dist folder from your computer to ec2 `scp -r -i path/to/your/key.pem ./dist/* ubuntu@ec2-3-75-240-39.eu-central-1.compute.amazonaws.com:/home/ubuntu/`
6. Copy blog folder to `/var/www/html/blog` with: `cp -r ./blog /var/www/html/`
7. Update nginx default configuration: `sudo vim /etc/nginx/sites-enabled/default`
8. Update root to point at your blog `root /var/www/html/my-blog;`
9. Reload nginx `sudo systemctl reload nginx`

## Automating Deployment

## Adding Domain and SSL
to add SSL we first of all need a working domain. 
1. After you buy a domain name (doesn't matter where), go to Route 53 in AWS Console
2. Go to hosted zones
3. Create one for your domain
4. Add one simple record that points at your ec2's public ip (you can find the IP on EC2 page, by selecting your instance and going to network tab)
5. Add another one that is alias - to point at a previous record
6. Create records
7. Copy the Values from NS type of record and paste them by your domain's DNS Name Servers (it will take may be an hour or so for DNS to propogate)

Now we can use certbot to establish ssl with following commands:
- sudo snap install core; sudo snap refresh core
- sudo snap install --classic certbot
- sudo ln -s /snap/bin/certbot /usr/bin/certbot
- sudo certbot --nginx (just follow the steps)



