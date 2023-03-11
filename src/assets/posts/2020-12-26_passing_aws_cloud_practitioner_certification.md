# Passing AWS Cloud Practitioner Certification (83%)

---

This exam (you can schedule it https://aws.amazon.com/certification/) is quite easy if 
you have already played around with AWS and a great stepping stone to get yourself 
acquainted (at a very high level) with most AWS services.

I actually forgot all about my exam and started preparing only in the last 3 days. So for 
3 days I basically made a practice test in the morning, reviewed answers 
(explanations provided in the test review are really good), read all I could from the 
study guide book until the evening, went through another practice test in the evening, 
and in between enjoyed my breaks while watching Suits on Netflix. Ended up scoring 83%.

Now you might be thinking that the last part is not relevant, but I'm presenting you my 
schedule as is, so substitution of a TV show is at your own risk :)

## Resources Used
There are (unofficially, could change) 65 questions, and you need to score 70+% to pass. 
Quite a few questions are based on common sense but a lot do require knowledge of AWS. 
Here are the resources I used:

- [AWS Cloud Practitioner Study Guide](https://www.amazon.de/-/en/Piper/dp/1119490707/ref=sr_1_2?dchild=1&keywords=AWS+study+guide&qid=1609009978&sr=8-2)
- [Udemy practice tests](https://www.udemy.com/course/aws-certified-cloud-practitioner-practice-test/?utm_source=adwords&utm_medium=udemyads&utm_campaign=LongTail_la.EN_cc.ROWMTA-A&utm_content=deal4584&utm_term=_._ag_80979681994_._ad_438174746803_._kw__._de_c_._dm__._pl__._ti_dsa-1007766171032_._li_1030879_._pd__._&matchtype=b)

The book is pretty good and also is concise (only 300 pages or so). I managed to read 
about two-thirds of it before my exam.

Practice tests are great, but you have to go through the answers and explanations - that 
is the whole value of it. Also, write down things you are getting wrong and make sure you 
understand them.

## Important topics to know
IMHO these topics are VERY likely to come up:

- S3 and all of its storage classes
  - S3 Standard is the most expensive
  - S3 IA (Infrequent Access) is cheaper but is only there for not frequent access as the availability is not immediate
  - S3 Glacier is very cheap but can take hours to get prepared for download
- CloudWatch vs CloudTrail
  - CloudWatch is about logs of *what* has happened, CloudTrails is *who* did it - great explanation here
- Different support plans and differences between them
  - don't worry about exact pricing as long as you remember which one is more expensive than which, but you are very likely to get questions like which one has Concierge Support (correct answer would be: Enterprise) or response time differences to production/critical issues - memorize this table
- S3 Snowball
  - is a service where a hard drive disk is sent to you and you get to upload your data on this physical device locally in your premises after which you send it back to AWS to be uploaded to AWS. Created for huge amounts of data (like 50 terabytes for example)
- Shared responsibility model
  - AWS is responsible for physical issues but you are responsible for configuring your services and for the security configuration as well - this is a very general explanation, you should read more in the book.

This list is far from complete but will put at least 5-6 questions in your pocket so 
worth keeping in mind.

## Windows => choose Pearson Vue and NOT PSI

One last tip - you can either go with PSI or Pearson Vue for the exam. PSI, 
since recently, wants you to download their personal safe browser for a proctored exam. 
That browser had huge issues with some background processes in my Windows, and I was 
lucky to be able to switch to my wife's Mac where it worked fine. From what I've read 
online, I'm not the only one, so if you have Windows I would recommend trying your luck 
with Pearson Vue, as the PSI browser will simply not let you through to the exam until 
you close everything it wants you to, which in Windows is quite tricky.



<img src="assets/images/aws_cloud_practitioner_certification.png" width="50%"/>

<br/>
By the way, passing this has some neat benefits, like 50% discount on the next exam, 
discount on some AWS services, access to private LinkedIn group etc.
