# My Amazon Interview Experience - passed

---

I got contacted by a recruiter from Amazon that found me on LinkedIn - which is one 
good reason to have your LinkedIn account always well updated, since that is how 
recruiters will find you, including FAANG companies.

My interview process consisted of the following stages:

1. Online Assessment (90 mins for 2 coding questions, a section of system design kind 
of survey questions, and general survey questions about habits)
2. Phone (Screening) Interview
3. Preparation call for Onsight interview
4. Onsight Interview (4 interviews, about 50 mins each, with 10-15 mins breaks in between. 
First 2 were coding questions, 3rd interview was System Design and last interview started 
with simple requirement but progressively added more requirements with focus on solution 
being flexible)

## 1. Online Assessment

To be honest I wasn't expecting to pass it since at this point I solved maybe 5 
questions in leetcode ever, and nothing in the last year. And due to heavy load in my 
current job and online masters program I had no time to prepare, so I pretty much went 
for the online assessment without any preparation.

Nevertheless I passed, I had 90 minutes divided between 2 coding question at my discretion. 
Looking back I managed to pass without preparation due to a mixture of luck (some more 
specialized questions around graphs for example would have been harder to solve without 
prep) and thanks to naturally grabbing a useful approach when not knowing how to solve a 
question which is: break the problem down into high level functions without implementation 
and add specific implementations one at a time.

The coding questions are done on a hackerrank website, and while Hackerrank warns you when 
you navigate away (switch windows) that "the interviewer will be notified of such activity", 
Amazon's instructions did say that I am allowed to work in my IDE, so I solved the 
questions in my IntelliJ and pasted solutions to test them in hackerrank. That being said, 
it must have been obvious from natural progression of the solutions and multiple tries 
until I got it right, that it was an honest implementation. (IF they did manually review 
it, which I don't think they did).

I finished 30 minutes earlier and didn't take time to clean up my code (usually I am very 
diligent regarding that, but here I was a bit thrown off by how new the whole process was 
to me). I passed nonetheless, so I guess that wasn't a requirement in the online assessment 
(makes me also think that online assessments are completely automated, and humans don't 
review them - so it is binary - either you pass to the next stage or you don't). In the 
coding interview with an actual interviewer writing clean code is obviously something they 
look out for but still allow for some wiggle room because of the time limit.

I am not allowed to disclose the specifics of the questions, so I am not going to, but they 
would be on the medium level of difficulty in Leetcode which is also what the recruiter 
told me the difficulty level would be for questions throughout all stages of the interview.

Also, you can choose pretty much any programming language you like in hackerrank, I chose 
Java but was surprised to find out that I only could choose Java 8 as highest Java version 
and would have preferred to have Java 11 or 17 available (Leetcode has Java 17 at the time 
of me writing this - 01.10.2022). But Java 8 is obviously fine as well.

### System design section

This section had a bunch of questions like you are planning to launch an application 
where up to a million people can send read and write requests (not the actual question as 
I am not allowed to share details). Which of the following make sense - and then you 
would rate which one makes "Strong Difference" all the way to "Little or no difference".

So for example which database would it make sense to you and short explanation, and 
you would rate each option as to how effective it would be.

### Survey questions

Lastly there was a section where I was presented with 2 options (like "I always look for 
something new to learn" vs "Delivering on time is my strength") and I would have to choose 
which one out of the 2 options is most fitting for me. And it didn't look like there were 
any wrong choices, but it seemed like some answers were a bit more in line with [leadership 
principles](https://www.amazon.jobs/en/principles) than others. In general throughout 
Amazon interview process, leadership principles are a must-read, since they place a lot 
of value on them.


I should also mention that for my first online assessment Amazon instructions were to 
take it within a week, and that would be by Friday in my case, but I asked my recruiter 
if it would be ok if I could do it on the weekend, and she told me that it is totally fine. 
So you should feel comfortable rescheduling things with Amazon - throughout the whole 
process they were very forthcoming in that regard.

## 2. Phone Interview

The phone interview was only with the recruiter - which surprised me, I thought there 
would be some developer joining in for the technical questions. But the recruiter had 
herself a list of technical questions, and it seemed like she understood things well 
enough to conduct the interview by herself.

She started by asking me questions about basic data structures such as hash table, [BST](https://en.wikipedia.org/wiki/Binary_search_tree) 
and what tripped me a bit were different caching algorithms - I just completely forgot 
about these and needed some hints before I understood what she meant with [LRU and LFU](https://dev.to/satrobit/cache-replacement-algorithms-how-to-efficiently-manage-the-cache-storage-2ne1) :). 
In general, I felt like I did the technical section fairly well, questions were relatively 
easy and I had no issue explaining [spatial and time complexities](https://www.geeksforgeeks.org/time-complexity-and-space-complexity/). 
Besides the different data structures, recruiter asked me about Singleton design pattern 
and some OOP principles.

The section where I felt like I didn't do so well was when she started asking me about 
projects where I contributed to system design in scalable systems. I didn't work much 
with scalable systems and haven't often been part of the projects from the start and even 
then we often had architects to handle the system design questions. Nonetheless, it was 
very important for the recruiter to get any information on me working in this kind of 
systems, and I wasn't confident if my answers provided the depth she was looking for.

Lastly she asked me a question or two from [leadership principles](https://www.amazon.jobs/en/principles), 
if I remember correctly it was "having a backbone" leadership question - I felt like 
I answered this part well. She promised to get back to me by the end of the week 
(phone interview was on Monday) and indeed she did, letting me know that I passed, 
and will be moving to the onsite interview :-)

## 3. Prep call before onsite interview

It was a bit under half an hour and during the call the interviewer just explained more 
about the interview process. There were going to be 4 Interviews:

1. Interview on data structures - it is important to consider many approaches, to compare 
cons and pros of all before selecting one (specifying time and space complexity).
2. Interview on logical and maintainable code (writing clean, production level code that 
is easily extensible and adaptable to new requirements)
3. Interview on problem-solving - specifically in this interview the solution will be a 
bit less obvious, it is important to disambiguate the problem, break it down before 
arriving to a solution. For all interviews, when choosing an algorithm, it is important 
to speak out loud so that the interviewer can follow your thought process because that 
is as important as the solution itself.
4. System design interview - this interview asks intentionally ambiguous questions, 
looking for the candidate to ask clarifying questions, figure out function and 
non-function requirements, dependencies within the system and outside, keeping in mind 
scalability.

One of the interviews was going to be with the bar raiser (a person who judges whether 
your addition to the company is raising the bar aka average talent of the firm) and in 
all the interviews the first half would be leadership principles. That means each 
interviewer would pick 2 Leadership principles (LPs), and ask 1-2 questions on each LP. 
Afterwards the interviewers are going to get together and share their notes with each 
other, so it is not a good idea to reuse the same story between interviewers.

She also told me, that even though most candidates worry about System Design and 
Behavioral Questions (LPs), most of the time they end up failing at coding part, so it 
is very important to brush up on data structures and algorithms.

I am based in Europe (Vienna, Austria) and she told me they had one last event this 
year in Amsterdam and asked me if I could (at the same time advising that I should:) 
go to this hiring event in 3 weeks. Alternative would be to try to schedule the whole 
onsite interview kind of online, but they preferred personal interviews if possible. 
I chose to travel to Amsterdam.

### 4. Onsite interview

Amazon Travel assisted me with the flights and the booking of hotel and covered my 
expenses (flights to Amsterdam and back and 2 nights stay, one extra night to explore 
the city - I found this very nice of them:). I arrived at the night before and the 
interviews started next day at 8:00.

There were four interviews. All the interviews started with behavioral questions, 
in my case they seemed to focus on a lot on dive deep and deliver results principles, 
but there were also questions on simplify and invent, as well as bias for action. Also 
in one interview I finished with technical task early so the interviewer added another 
behavioral question at the end since we had the time.

The first 2 interviews had normal Leetcode medium difficulty coding problems. In both 
cases the correct solution was BFS with me getting extra points on one of the questions 
for considering A* which interviewer told me is the most optimal solution for the problem 
but he spared me the implementation since it would take a bit longer, and he was happy 
with me just explaining it and coding a BFS. Takeaway from this - if you are going to 
learn one data structure for Amazon it should be graphs with BFS being a must
([BFS provides the shortest path in an unweighted graph](https://www.geeksforgeeks.org/applications-of-breadth-first-traversal/)).

Also with onsite interviews there is no version of Java you need to worry about, you can 
just code it in any version and if interviewers are not sure about something they will 
ask. They won't try to compile it, interviewers are just very experienced with questions 
they are asking and can just tell if it is going to work, and they don't care about minor 
syntax mistakes. But they do care about you considering edge cases (input null, empty 
array, etc).

Btw for coding interview I was given a choice of using my own laptop to code the 
solutions in the online shared tool which is the option I opted for. Alternatively I 
could have used the whiteboard but I figured typing on a laptop is faster, and you don't 
have to worry about fitting into the limited whiteboard space.

Third interview was on System Design. This one was the only one I felt like I didn't 
do well. I stumbled with my solution and here is where I thought I could have really 
used some more preparation on common system design questions which would have saved me 
a lot of time that I spent thinking. The interviewer was helpful and helped me make some 
time saving assumptions as we were running low on time.

Last interview was that one interview that Amazon does where they start with simple 
requirements and then keep expanding on it. So you should from the very beginning have 
flexible solution to avoid having to rewrite a lot of code. I did right away implement 
it in a flexible way and did well in this one.

## Preparation

Essentially you need to prepare for 3 things: coding questions, system design and [LPs](https://www.amazon.jobs/en/principles) 
(Behavioral Questions). In one sentence:
1. for coding go through [leetcode explore](https://leetcode.com/explore/) (especially 
[graphs](https://leetcode.com/explore/learn/card/graph/)) and read a chapter on Big O 
notation - it really is just a chapter in any book that covers it
2. for system design (and this is what I should have done) make sure you do a lot of 
examples and have ready designs in your head for common scenarios, so you can just 
adjust your ready to go designs as necessary to the example
3. and for LPs prepare 2 stories for each.

I tried a lot of different resources, but I will focus on the ones I consider the 
most useful. So buying [leetcode](https://leetcode.com/) membership to access the 
solutions/their explanations has totally paid off, I felt very good about answering 
the coding questions (mind you I have done very little algorithmic questions before). 
Also, the ["explore" section](https://leetcode.com/explore/) in leetcode, that has 
detailed explanations/courses on data structures, was a blessing. I explored most of 
their ["Interview Crash Course"](https://leetcode.com/explore/interview/card/leetcodes-interview-crash-course-data-structures-and-algorithms/?vacRef=problembanner) 
and ["Graph"](https://leetcode.com/explore/learn/card/graph/) explore cards and did 
something like 120-150 questions in those 3 weeks (a bit overkill and at the expense of 
System Design preparation that I could have used more of).

For system design I can recommend the following YouTube video - 
[System Design Interview – Step By Step Guide](https://www.youtube.com/watch?v=bUHFg8CZFws). 
I also bought same guy`s course, and I think it is really good, but at least in my case 
simply doing online course was just not enough, one should really read books and practice 
a lot of examples to do System Design well and I just wasn't able to do that in 3 weeks.

Also a really good investment is to buy a whiteboard, and practice on it the questions 
and system design - it is really helpful to get some experience with that since actual 
interview uses whiteboard, and I used whiteboard to explain my approach before coding 
it for every interview.

And the following articles are great reads:

- [Get That Job at Google](https://steve-yegge.blogspot.com/2008/03/get-that-job-at-google.html)
- [Ace The Coding Interview Every Time](https://medium.com/@nick.ciubotariu/ace-the-coding-interview-every-time-d169ce1fd3fc)
- [Anatomy of System Design](https://hackernoon.com/anatomy-of-a-system-design-interview-4cb57d75a53f)

### Behavioral Questions / LPs

Regarding behavioral questions - I know these might seem intimidating at first, but it is 
really not going to be anything hard, you should just prepare 2-3 stories for most 
popular Leadership Principles (you should google which ones these are - I am not sure 
if I am allowed to share) and 1 story just in case for each of the less popular ones. 
If you want to be extra prepared google "Behavioral questions Amazon" and prepare for 
the specific question examples you will find - chances are you will be asked almost the 
same question.

I know it might seem like you don't have any stories for some LPs, that is exactly how 
I felt, you just have to put the time into it, sit down for hours if necessary, and 
calmly keep going through your experiences as a developer starting from most recent. 
Try to go into a lot of details, search for your implemented tickets in Jira if needed, 
this process will help you recover a lot more stories than you thought you had. 
The stories also don't have to be some extraordinary events, most often they are almost 
normal, just happen to display the corresponding LP.

Also, my recommendation is to NOT prepare the same story for multiple LPs - it is often 
the case that one story displays more than one, but if you start mapping one story to 
many LPs you will end up preparing less than 2 per LP and that will really backfire if 
interviewers ask enough questions for you to need 2 stories per LP (which is very likely 
to be the case, and it is very hard to come up with unprepared stories on the spot).

Also, another useful thing I found out - while interviewers on site will share their 
notes between each other and would prefer you not to reuse same LP story during that day, 
they don't know the ones you have used on your prior phone screening interview, so you 
should feel free to reuse those. And it is not tragic if you end up reusing one 
story between interviews, just better not to.

## General Tips
Grab couple of snacks/chocolate bars as the interviews take from 08:00 till almost 
13:00, and you have 10-15 mins break in-between, so it is good idea to have something 
to keep your sugar levels high from going low.

Confidence is important - even if you are not sure yet where are you going with the
solution, just confidently keep asking questions and think out loud, it makes a 
difference in how your interviewers are going to perceive you and whether they are going 
to recommend hiring you.

I found the advice of bringing my own whiteboard markers helpful - the normal markers 
are thicker and the thinner markers really do help save space on the whiteboard - 
which in my case was a 90x60cm whiteboard like [this one](https://www.amazon.de/-/en/gp/product/B07QGFD52S/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1) 
and space was running out fast.  I used [the following 1mm markers](https://www.amazon.de/-/en/gp/product/B0013NAZCG/ref=ppx_yo_dt_b_asin_title_o09_s00?ie=UTF8&psc=1) 
instead of the regular ones (2-3mm line width)

Graphs and BFS are very likely to be the key to the coding questions, so just go to 
leetcode and use the explore section, specifically ["Graphs"](https://leetcode.com/explore/learn/card/graph/) 
and ["Interview crash course"](https://leetcode.com/explore/interview/card/leetcodes-interview-crash-course-data-structures-and-algorithms/?vacRef=problembanner) 
courses.

## Useful Resources
 - [LeetCode](https://leetcode.com/)
 - [Amazon Interview Preparation Course](https://www.amazon.jobs/en/software-development-interview-prep?INTCMPID=OAAJAZ100028B#/)
 - Obviously [Leadership Principles](https://www.amazon.jobs/en/principles) are a big must
 - I found all of the videos from Amazon on [this page](https://www.amazon.jobs/en/landing_pages/software-development-topics) very helpful.
 - [System Design Interview – Step By Step Guide](https://www.youtube.com/watch?v=bUHFg8CZFws)

## Interview Result
My interview was on Friday and already on Monday evening I got the email from my recruiter 
congratulating me that I have passed the interviews and am now "inclined". 
What that means is that the interviewers have cleared me from the "required skills" 
point of view, and it is now only the question of finding the right team/Hiring Manager 
that is happy to take me in regard to needing someone in their team with similar skills.

I encourage everyone reading this to try themselves out given the chance, because I've 
found the whole experience extremely rewarding in itself and was surprised how much 
broadening my knowledge for all the 3 topics (Data Structures, System Design and LPs) 
helped me in writing better, more optimized code as well as in making better decisions 
as a developer. In other words my teammates now get to raise their eyebrows when I start 
explaining inside javadoc why I went with certain data structure as opposed to another 
one in terms of big O notation.
