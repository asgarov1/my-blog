# Passing Oracle Java SE 11 Developer (1Z0-819-J)

---

## Study Materials

Most of the material is very well covered in my favorite book for Oracle Java exams by Boyarsky and Selikoff [OCP Oracle 
Certified Professional Java SE 11 Programmer II](https://www.amazon.de/-/en/Scott-Selikoff/dp/1119617626/ref=sr_1_1?crid=30KYXF25798EO&dchild=1&keywords=ocp+oracle+certified+professional+java+se+11+2&qid=1618513594&sprefix=OCP+o%2Caps%2C203&sr=8-1).

One thing the book is lacking though are the security guidelines - you should read those [here](https://www.oracle.com/java/technologies/javase/seccodeguide.html).

Regarding the mock exams, I always recommend going with [enthuware](https://enthuware.com/). They have always had a good 
quality of questions and explanations. Whizlabs is also popular, but I was very disappointed in the quality of their questions 
for Java 8 certifications, so I stayed away from them ever since.

I must notice that for Java 11 [enthuware](https://enthuware.com/) questions are considerably harder than the actual exam so 
don't get discouraged because your score at the exam is likely to be 10-20 % higher than your enthuware average.

## For people who have Passed OCP Java 8

In general, the exam is a bit harder than passing Java 8 OCP. One of the authors of the preparation book also thinks so, 
you can read his review of passing the exam [here](https://www.selikoff.net/2019/03/17/my-experience-taking-the-new-java-se-11-programmer-i-1z0-815-exam/). 
At the same time having exams from both OCA and OCP spread out into 50 questions makes topics more random and less predictable - 
you could get 4+ questions on modules or just 1 or 2.

The number of questions has gone down to 50, and you now need to score 68%+. The exam will be easier for you, obviously, 
since you know 60%+ of the material.

What are the missing 30%+?

- Annotations
- JPMS (No this is not Java having PMS, I am talking about modules - shame on you!)
- [Java Security Guidelines](https://www.oracle.com/java/technologies/javase/seccodeguide.html)
- var (good resource - [this video](https://www.youtube.com/watch?v=rJUid3A5_JA))
- Diverse little changes that came with Java 9+
- Now the var is relatively simple (but there are a couple of tricky parts like for example you can't use var with shorthand 
array declaration like `var ints = {1,2,3};` but you can use for full version `var ints = new int[] {1,2,3};`).

But the questions on annotation, modules, and security you won't be able to answer without preparation, so I would recommend taking time to learn these well. You should be able to prepare with Boyarsky & Selikoff's book for all of those.

### Preparation
Since I have already passed OCP for Java 8 in 2019 I was pretty confident and ended up not spending too much time on preparation. 
I just read the book once and did a bunch of mock tests in the last month.

I think it is very important to do plenty of mocks and identify your own weak areas. I tried to always pay attention to where 
I needed more practice and address them through a mix of reading more about that area, practicing it in code, and maybe writing 
a blog post about it - helps!

At the point of this exam, I have had 2 years of Java experience. As I was passing OCP I had 0 Java work experience and still 
managed to pass it with 86%. This time I spent about 3 times as little time and effort and score 76% which I was think was a fair 
reflection of preparation level.

### Advice
You essentially have 1 minute and 48 seconds per question. I would aim to spend about a minute on each question and mark the ones 
that take too much time for later. Following this plan, you will have 30+ minutes to review your answers which almost always helps 
identify 1-2 mistakes that happen due to missing some small detail.

I also found Pearson online proctored exams to be more relaxed - I have had online certification where a proctor kept instructing 
me to not move too much, not put my hands around my face, etc... which was distracting and limiting because I can't sit for 
90 minutes without moving because... I am alive and not a robot.

You can check the requirements and register for the exam https://education.oracle.com/java-se-11-developer/pexam_1Z0-819 - good luck!

<img src="assets/images/oracle_certification_java_11.png" width="50%" height="50%">
