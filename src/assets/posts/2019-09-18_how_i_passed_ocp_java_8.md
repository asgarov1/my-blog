# How I passed Oracle Certified Professional Java SE 8 Programmer II (86%)

---

Right after I passed OCA (88%) in April 2019, I had my eyes set on OCP Java 8 as the 
next target. I knew that OCP is supposed to be much harder, so I wanted to make sure 
I prepare myself well.

## PREPARATION (MAY 1 – AUG 30)
### BOOKS READ:

So for the 4 months I read daily between 30-50 pages of one of the following 3 books 
([first one](https://www.amazon.com/gp/product/B0191U2H8C/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B0191U2H8C&linkCode=as2&tag=programmerpap-20&linkId=4d10444cafbb6be9a10df2800b112cd9) more than once). 

1. [OCP: Oracle Certified Professional Java SE 8 Programmer II Study Guide](https://www.amazon.com/gp/product/B0191U2H8C/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B0191U2H8C&linkCode=as2&tag=programmerpap-20&linkId=0bf0eda407962aa2867ec3fd5417f7c4)
2. [OCP Java SE 8 Programmer II Exam Guide (Exam 1Z0-809) 7th Edition](https://www.amazon.com/gp/product/B07C8BJ9TG/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07C8BJ9TG&linkCode=as2&tag=programmerpap-20&linkId=d90ed0e4b4f53eca0497ecbe54cefdb9)
3. [Oracle Certified Professional Java SE 8 Programmer Exam 1Z0-809: A Comprehensive OCPJP 8 Certification Guide](https://www.amazon.com/gp/product/1484218353/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1484218353&linkCode=as2&tag=programmerpap-20&linkId=e4b476a18bc3f55137475dfe29830ff1)

The [first book](https://amzn.to/2ZZZmKG) – is a must read, the good thing about Sybex is that they only give you 
as much as you need to know, no less but also no more, and that is important when you 
have so much material. It also helps to know where the boundaries are.

[Second book](https://amzn.to/30aBMKq) is a GREAT addition as it explains many concepts in better detail. 
Boyarsky and Selikoff (first book) tend to keep things short and to the point. This book 
is 1400 pages though, pretty much double as big as the previous one, so a bigger 
time investment. That being said, if sizes of books over 1000 pages scare you, then 
maybe programing isn’t for you:)

[Third book](https://amzn.to/2O80x3E) – just skip it. It is a bare 400-500 page read, 
and it has absolutely nothing that wasn’t covered better in previous books.

… additionally I have read most of the [Java 8 in Action](https://amzn.to/32QLnEe) book.

It is definitely a great read, one of those books that make you think about things. 
It is especially good in case you (like me), needed a bit of an extra explanation of 
Lambdas and Streams – this book leaves no stone unturned and after reading it you will 
really feel like you are at home with functional programming in Java.

RECAP: you should read daily, 30 pages from any of the above recommended books. 
If you have had more experience with Java already, 1-2 books might be enough for you, 
[Boyarsky and Selikoff](https://amzn.to/2ZZZmKG) is a must.

---

### PRACTICE TESTS:

1. [Enthuware](https://enthuware.com/): Great investment (only $10 or so), I tried to do 
daily tests, just don’t start with them early as you will run out of the questions 
you haven’t answered in a month. So save it for the last month.
2. [Practice tests from Boyarsky and Selikoff](https://amzn.to/306XaB9):
   great resource, especially cause questions are harder
   to memorise than on the Enthuware website, so
   you can keep redoing them, essentially using them
   like flashcards.
3. WhizLabs: stay away, outdated questions, sometimes not even in the scope of the exam, meh.

#### RECAP

Try to solve at least some amount of questions (like 20-30) daily to install in yourself 
this willingness to dive into complicated problems and be able to solve them relatively 
fast and precise (you will have 1.5 min per question on the exam). 
Questions from Boyarsky and Selikoff are harder than on the real exam, so don’t get 
discouraged.

You will also need to train your mental stamina as the first time I have tried doing 
85 questions in one go I found myself getting very tired in the first half and making 
more mistakes in the second half (questions are not ordered, so they are equally 
difficult throughout). So every 1-2 weeks make an 85 question session, keeping to 
the exam’s time limit (2 and a half hours).

---

### HARD TOPICS

There are none. Seriously.
All topics are equally likely to come up throughout the 85 questions (about 5-7 questions 
per topic), and the topics you would expect to be hard (like concurrency), end up being 
the easiest – there is always one question on deadlocks (actually easy to identify), one 
more on race coniditions, and one more about correct implementation of RecursiveTask.

What you really need to do is be very comfortable with lambdas and streams. If you don’t 
have enough experience (like I didn’t), I really recommend [Java 8 in Action](https://amzn.to/32QLnEe) book.

With the rest of the topics, it is enough to understand them. Boyarsky and Selikoff say 
that you need to memorize plenty of classes/interfaces and their functions but what I 
did is to try to understand and read same topics from different sources – worked for me.

P.S. make sure you now what resolve() and relativize() methods do from Path interface 
(you can read about these here). These 2 come up LITERALLY in every mocktest and have 
come up in my real test as well.

<img src="assets/images/java_ocp_8_certification.png" width="50%">
