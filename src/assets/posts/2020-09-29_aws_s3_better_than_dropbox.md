# AWS S3 - better (and cheaper) than Dropbox

---

Once you register in AWS you will have access to so many services (1st year free) 
and among them S3 storage service about which we will talk today.

I think it should be enough to say that last time I checked 1 GB on S3 will cost you 
about $0.023 (prices are subject to change, but I doubt that they will change a lot). 
Considering that most services out there like Dropbox like charging you much higher 
prices it should be a no-brainer. And great integration among other AWS services is 
really nice bonus as well. And did I mention AWS CLI?

OK lets go 1 step at a time

## 1. Create S3 Storage Bucket
Once you have signed up and logged in into your AWS management console 
(I am not gonna cover that, you are a programmer for Steve Job's sake!)

- navigate to S3.
- press create bucket
- And choose a bucket name - has to be absolutely unique among all the S3 buckets in AWS. 
Therefore, avoid popular choices like java-is-the-best and choose something unique -
guidelines dictate to use all small letters and don't use dots (dashes are ok).
- Also, you should choose the region you want your bucket to be available at - just choose 
any you like.

## 2. Upload stuff
Once that's done you can just press on your bucket and feel free to create folders, 
press upload and drag and drop. By default, you S3 bucket would be closed to the public 
and therefore only available to you via AWS Console or CLI (and to cover all bases 
also through SDK of some popular language like Java:).

Like I said you are welcome to just use your S3 bucket via simply drag and drop but 
since that is kinda lame I'll show you how to do that using AWS CLI so that you can
get some cool points. And it actually saves time.

## 3. AWS CLI

So first you will need to install AWS CLI - just follow [the instructions](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) 
pretty simple whether you are using Windows or Linux/Mac

Once you have done that you need to configure your CLI by opening cmd/terminal and 
typing `aws configure`

*Example:*

```
$ aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-west-2
Default output format [None]: json
```

No you need to provide AWS CLI your ACCESS ID and KEY. Where do you find this info 
you might ask? In your IAM service if you will please find it in your AWS management 
console. There in the dashboard you should be able to find Manage Security Credentials 
and there you can either find an existing security key or just create a new one. 
You can also create new keys for different users/groups. So regardless of how you 
choose to process you should be able to provide your AWS CLI with Access ID, Password 
and once you get to region make sure your provide the region in which you have created 
your bucket. (If you don't remember just go to S3 and check in which region is it located). 
And make sure to enter the region using AWS notation for it, so for example for N.Virginia 
you would enter `us-east-1`

The last parameter is not important for us. So now that you have it set up move to the 
folder that contains the file you want to upload to S3, and in cmd type:

`aws s3 cp file.txt s3://my-bucket-name/new-name-of-the-file.txt`

And there you have it:) Make sure to change file.txt to the file you have locally to 
copy and replace my-bucket-name to your bucket's names.
