# Create your own Chrome extension in 5 mins

---

In this example, I will create an extension to provide me ready to copy/paste comments for StackOverflow. 
Often there are questions from newbies who don't know how to ask questions on the site, so it would be 
nice to have a nice expanded comment that can help them ask better questions:)

An example of such comment:

> Welcome to Stack Overflow! You seem to be asking for someone to write some code for you. 
> Stack Overflow is a question and answer site, not a code-writing service. Please 
> [see here](http://stackoverflow.com/help/how-to-ask) to learn how to write effective questions.;
> credit to https://sopython.com/wiki/Useful_Comments

As you can see this is a useful comment to have handy, but I wouldn't want to type this out so really good to 
have it easily retrieved from an extension. Let's make this happen:

## 1. Create a project
Just create a directory and open it in your favorite IDE :)

## 2. Create manifest.json
```
{
  "manifest_version": 2,
  "name": "SO plugin",
  "description": "This extension has commonly used SO answers",
  "version": "1.0",
  "browser_action": {
    "default_icon": "icon.png",
    "default_popup": "index.html"
  },
  "permissions": [
    "activeTab"
  ]
}
```
Chrome will be looking at this file to find out certain things about your extension. Most stuff is 
self-explanatory, you can see that we have default_popup page specified to index.html and given permissions 
for our plugin only for the tab that is currently active.

Also, this manifest says to look for the icon file icon.png in the project folder - I will leave it up to 
you to download and use the icon you like - good resources are [jam-icons](https://jam-icons.com/) and 
[feathericons](https://feathericons.com/). I also used [svgtopng](https://svgtopng.com/) to convert svg 
icons as needed.

## 3. Create index.html
```
<!doctype html>
<html>
<head>
    <title>SO ready answers</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

    <script src="index.js"></script>

    <style>
        h6 {
            color: #F48125;
            text-align: center;
        }

        .list-group a {
            font-size: 0.5rem;
            white-space: nowrap;
        }
    </style>
</head>
<body>
<div class="pb-4 bg-light rounded-3">
<div class="container container-fluid py-5">
    <h6>StackOverflow answers</h6>
    <div class="list-group">
        <a class="list-group-item list-group-item-action" id="code_writing_service" href="#">Not a code writing
            service</a>
        <a class="list-group-item list-group-item-action" id="bad_formatting" href="#">Bad formatting</a>
        <a class="list-group-item-sm list-group-item list-group-item-action" id="should_accept_answer" href="#">Should
            accept answer</a>
    </div>
</div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
        crossorigin="anonymous"></script>
</body>
</html>
```

This is just a normal HTML page - you can see imports for styling and js from Bootstrap. The important bit 
is the section "Stackoverflow answers" with 3 <a> elements with ids. We will use these ids to add event 
listeners so that when they are pressed we copy the predefined answer to the user's clipboard 
(defined in `index.js` the import for which you see on line 8)

## 4. Create index.js
```
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('code_writing_service').addEventListener('click', () => copyText(notACodeWritingService), false);
  document.getElementById('should_accept_answer').addEventListener('click', () => copyText(youShouldAcceptAnswer), false);
  document.getElementById('bad_formatting').addEventListener('click', () => copyText(badFormatting), false);
}, false);


function copyText(text) {
  navigator.clipboard.writeText(text)
    .then(() => console.log('Copied!'));
}

// Answers
let notACodeWritingService = 'Welcome to Stack Overflow! You seem to be asking for someone to write some code for you. Stack Overflow is a question and answer site, not a code-writing service. Please [see here](http://stackoverflow.com/help/how-to-ask) to learn how to write effective questions.';
let youShouldAcceptAnswer = 'If one of the answers below fixes your issue, you should accept it (click the check mark next to the appropriate answer). That does two things. It lets everyone know your issue has been resolved to your satisfaction, and it gives the person that helps you credit for the assist. [See here](http://meta.stackexchange.com/a/5235) for a full explanation.';
let badFormatting = "Please consider revising the code sample you posted in this question. As it currently stands, its formatting and scope make it hard for us to help you; here is a [great resource](http://stackoverflow.com/help/mcve) to get you started on that. -1, don't take it the wrong way. A down vote is how we indicate a content problem around here; improve your formatting and code sample and I (or someone will) gladly revert it. Good luck with your code!";
```
As you can see, this is a very simple vanilla js where we wait for the document to be loaded and then 
define event listeners for each element. The event listener copies the answer in case of a click to 
clipboard - easy!

## 5. Load the extension to chrome
- Open Chrome
- type chrome://extensions/
- click Developer mode toggle 
- and press the appeared Load unpacked button. 
- There just select the folder of your project and that is all there to it.

[GitHub Link](https://github.com/asgarov1/soChromeExtension)
