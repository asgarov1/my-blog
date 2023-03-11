# Deploying to Azure Web Apps

---

Amazon Web Apps is PaaS and is incredibly easy to deploy an application to. It is actually so easy 
that it is almost not worth writing about it, but I would like to cover it since I've covered 
Elastic Beanstalk in a [previous article](/?post=2021-05-02_deploying_spring_boot_to_aws_beanstalk.md) and point some differences/advantages of Azure.

Both Azure Webapps and AWS Elastic Beanstalk are PaaS, meaning they both provide the platform for 
your code to run on, and you just need to provide the code. But Azure allows for a very easy 
integration where you don't even have to produce and upload a jar, but it is enough to simply 
provide a GitHub link to your project and Azure takes care of the rest.

But enough talk - let's get to it!

## Create webapp in Azure Portal

Go to Azure Portal and press create by Web App
<img src="assets/images/azure/azure_1.png">

Pick a resource group (or create a new one), give a unique name to your webapp and press Review+create, and after that press Create
<img src="assets/images/azure/azure_2.png">

Go to your newly created web app and click deployment center
<img src="assets/images/azure/azure_3.png">

Set up your Github account, select repository and press save - it is that easy!
<img src="assets/images/azure/azure_4.png">

Your application will automatically deploy in a few mins :) So just wait for a few minutes and 
then press Browse on top.

Best of all, you can go to Deployment slots and add another deployment slot, then connect a 
different branch to that slot, and then you will have that branch deployed as well. This allows 
you to easily test your branches before deploying them.

Go to Deployment slots and press Add Slot. Give it a name and save (don't clone settings)
<img src="assets/images/azure/azure_5.png">

Click on the new slot to change to its settings
<img src="assets/images/azure/azure_6.png">

Now again go to Deployment center and again connect a GitHub project and a different branch like for example dev
<img src="assets/images/azure/azure_7.png">


Press Save and voilà! Your dev branch is deployed as well.

So in case if you connect a dev branch your URL will be [wepapp-name]-[branch-name].azurewebsites.net. 
In my case, it was javidwebapp-dev.azurewebsites.net for the dev branch and javidwebapp.azurewebsites.net for the default master branch.

As you can see I have simultaneously deployed master branch version of my app and a slightly different dev version available at different endpoints:
<img src="assets/images/azure/azure_8.png">

You can find the ChuckNorris Joke app repository [here](https://github.com/asgarov1/chuckNorrisJokesApp). 
You can fork it and use it for your own demos (you have to have the repository under your GitHub 
account for Azure to be able to push workflows on it and automate deployment).
