# Passed [Oracle Certified Professional: Java SE 17 Developer 1Z0-829](https://education.oracle.com/java-se-17-developer/pexam_1Z0-829) (80%)

___

## About the exam

The exam had 50 questions to answer in 90 minutes. I felt like the time was adequate.
Exam was not much different than [Java SE 11 Developer 1Z0-819](https://education.oracle.com/produktkatalog-ouexam-pexam_1z0-819/pexam_1Z0-819).

The main differences were:
- Records (Java 14, [JEP 359](https://openjdk.org/jeps/359))
- Sealed classes (Java 15, [JEP 360](https://openjdk.org/jeps/360))
- Switch expressions (Java 13, [JEP 354](https://openjdk.org/jeps/354))
- Pattern matching (Java 15, [JEP 375](https://openjdk.org/jeps/375))
- Text blocks (Java 13, [JEP 355](https://openjdk.org/jeps/355))

## Preparation

As I still remembered most of the things from [Java SE 11 Developer 1Z0-819](https://education.oracle.com/produktkatalog-ouexam-pexam_1z0-819/pexam_1Z0-819)
I only read the [Boyarsky and Selikoffs book](https://www.selikoff.net/ocp17/) and felt like that is the only book that one needs to read.

I also did some mock exams on [enthuware](https://enthuware.com/java-certification-mock-exams/oracle-certified-professional/ocp-java-17-exam-1z0-829) - they
have always been my preferred choice of mock exams but they seem to have become a bit more difficult over the years - 
as in for java 8 and 11 I felt like the mock exams were a bit easier or the same level as on the real exam
and for Java 17 the mock questions were noticeably harder than real ones.

## Exam registration

Oracle's new exam registration UI is extremely annoying and unintuitive. I think a lot of people
end up opening support tickets for Oracle to help them through, but generally there are 3 steps to process:

1. Buy the exam attempt from Oracle - this part is straightforward
2. Assign this attempt to someone (most probably yourself) from Oracle Exam Attempt Administrator - 
this is the unintuitive part that gets everyone tripped up. This part is also not found in any confirmation 
emails after purchase, so you might have to open a support ticket. For me the following [link](https://mylearn.oracle.com/ords/r/c/ecd) 
worked, but it might be region specific.
3. After you have assigned yourself the attempt, you navigate to the Oracle University's [Java 17 exam page](https://mylearn.oracle.com/ou/exam/java-se-17-developer-1z0-829/105037/110649/170355)
and you should now be able to see the button "Register for an exam". You press it and choose the date and time

When I was registering there was only the option to take proctored exam online (there was no option for test center)

## Examination day
You can check in for the exam up to 30 mins before the scheduled time, and I recommend doing it early in case of technical difficulties
You need to download a Safe Browser from Oracle after checking in

*BEWARE* Oracle's Safe Browser gives a lot of trouble on Windows - keeps demanding that you turn off some background processes that are 
impossible to find and doesn't let you get to the exam until you do. I was lucky to be able to switch to mac where this problem doesn't 
appear, but if you have windows I would suggest borrowing a Mac from a friend for the exam to avoid the hassle, otherwise you might 
end up missing the exam (which you then should be able to reschedule but that doesn't solve the original issue).

After you have cleared the Safe Browser's checks, you will end up in kind of a zoom call with other people who are taking the exam 
on the same day and 3 supervisors that are supervising. Your supervisor will send you the exam access code in the direct chat message.
You enter it on the next tab (the zoom call has 2 tabs) and start your exam.

There were minor mistakes in couple of questions, which is very annoying because one of the mistakes left no definitive way
of being able to determine the correct answer. My advice for such situations is to not get rattled, analyse which place
is the most likely mistake, and take the best guess.

## Tips

- You have 90 minutes to finish 50 questions. Ideally you want to finish the exam 30 mins early to have time to go over difficult quesitons.
That means 60 mins for 50 questions, so a little over a minute per question. That means strive to solve each question in a minute and if not
take your best guess (any guess) and flag it for review. Unanswered questions could otherwise stay on the back of one's mind, and
distract. Marking any kind of answer and flagging for review solves this issue.
- If you have to guess, and there is a "won't compile" option, that is usually your best bet.
- If you see a long piece of code, before spending a lot of time on understanding it, check for a "won't compile" option, and if it is
there, first go over the code checking if it compiles. The last thing you want is to spend one or two minutes counting incremented
value of some nested loop variable just to get to the last line and see that the whole thing doesn't compile
- Keep track of time with kind of time milestones. 60 planned minutes for 50 questions means 12 minutes for 10 questions, so keep track
of being on time each time you cover another 10 questions
- Always go over the questions even if you are sure of you answers - everytime 
I took a certification exam, whenever I reviewed the questions
I found one that was some silly mistake of mine.

<img src="assets/images/oracle_certification_java_17.png" width="50%"/>
