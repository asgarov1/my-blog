# GitLab Server Hooks (pre-receive hook)

---

### Intro

We had an issue at work where we wanted to prohibit developers to commit without referencing a Jira Ticket in
the commit message. The problem with the general solutions (pre-commit hook locally, a custom IDE plugin that doesn't allow it) is that these are not enforceable - each developer would have to set it up locally themselves.

Enter [Server Side Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) which allow to reject a push based on whatever kind of logic. In this article I will show how to set it up in GitLab (available for all tiers).

**Cause this question has been asked before:** 
difference between `pre-commit` and `pre-receive` is that:
- `pre-commit` happens before the commit, so naturally you can only set it locally to happen **BEFORE** the commit
- `pre-receive` happens on the server, at this point the change has already been committed locally, however 
the server can decide to **REJECT** the push because of some criteria

---

## Following this article along

If you want to follow along, you can easily start your own GitLab locally with docker

1. Set GITLAB_HOME: `export GITLAB_HOME=/srv/gitlab`
2. Start docker: 
```bash
sudo docker run --detach \
--hostname localhost --publish 443:443 \
--publish 80:80 --publish 22:22 \
--name gitlab --restart always \
--volume $GITLAB_HOME/config:/etc/gitlab \
--volume $GITLAB_HOME/logs:/var/log/gitlab \
--volume $GITLAB_HOME/data:/var/opt/gitlab \
--shm-size 256m gitlab/gitlab-ee:latest
```
3. To login just navigate to `localhost`, default username is `root`, generate password can be found at
`$GITLAB_HOME/config/initial_root_password` (so in our case `sudo cat /srv/gitlab/config/initial_root_password`
4. To connect to the Docker container with GitLab server `docker exec -it gitlab /bin/bash`

For more info see [documentation](https://docs.gitlab.com/ee/install/docker.html)

---

## Option 1: Central Configuration

There are 2 options to configure a `pre-receive` - we can either set it for individual project, or globally for
all the projects (central configuration). We will first look at central configuration for all projects since
this option is the one that makes more sense for our example:

1. You have to define `custom_hooks_dir` in the GitLab config. For docker, you can define this at `$GITLAB_HOME/config/gitlab.rb` or directly at the server in `/etc/gitlab/gitlab.rb` - uncomment and set `custom_hooks_dir` setting.
  In my example I set it to `/var/opt/gitlab/gitaly/custom_hooks` For more info see [here](https://docs.gitlab.com/ee/administration/server_hooks.html#choose-a-server-hook-directory )
2. Once you have updated the GitLab config, reload it (it will also warn you if there is a mistake in config):
`gitlab-ctl reconfigure`
3. In this directory you have defined, create `pre-receive.d` directory
4. `vi pre-receive.d/pre-receive`

Paste the following:
```bash
#!/bin/bash

echo 'Running GLOBAL pre-receive hook on the server to check that commit message has ticket number'

set -e

zero_commit='0000000000000000000000000000000000000000'
msg_regex='\b[A-z]+-[0-9]+\b'

while read -r oldrev newrev refname; do

	# Branch or tag got deleted, ignore the push
    [ "$newrev" = "$zero_commit" ] && continue

    # Calculate range for new branch/updated branch
    [ "$oldrev" = "$zero_commit" ] && range="$newrev" || range="$oldrev..$newrev"

	for commit in $(git rev-list "$range" --not --all); do
		commit_message=$(git log --max-count=1 --format=%B $commit) 
		if ! echo "$commit_message" | grep -iqE "$msg_regex"; then
			echo "ERROR:"
			echo "ERROR: Your push was rejected because"
			echo "ERROR: the commit message '$commit_message' has to start with JIRA Issue e.g. 'JIRA-1234'."
			echo "ERROR: for commit $commit in ${refname#refs/heads/}"
			echo "ERROR:"
			echo "ERROR: Please fix the commit message and push again."
			echo "ERROR: You can replace last commit message with \"git commit --amend -m 'JIRA-1234 ...'\""
			echo "ERROR: https://help.github.com/en/articles/changing-a-commit-message"
			echo "ERROR"
			exit 1
		fi
	done
done
```
5. Save (`:wq`) and set the file as executable (`chmod +x pre-receive.d/pre-receive`)

Now if you try to commit a commit message without ticket number and push it, it will get rejected:

<img src="assets/images/gitlab/central_conf_1.png" width="50%" height="50%">
<br/>

Once you fix the commit it works:

<img src="assets/images/gitlab/central_conf_1.png" width="50%" height="50%">

---
## Option 2: Project Specific Configuration

1. On the left sidebar, select **Search or go to**.
2. Select **Admin Area**.
3. Go to **Overview > Projects** and select the project you want to add a server hook to.
4. On the page that appears, locate the value of **Relative path**. This path is where server hooks must be located.

<img src="assets/images/gitlab/relative_path_to_repo.png" width="25%" height="25%">
<br/>

5. Connect to GitLab Server, and navigate to the relative path, starting from `/var/opt/gitlab/git-data/repositories/`. So in my example you need to navigate to: `/var/opt/gitlab/git-data/repositories/@hashed/6b/86/6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b.git`
6. There if the folder doesn't exist yet, create a `custom_hooks` directory. 
7. Inside of the `custom_hooks` folder, create `pre-receive` file without extension 
8. `vi custom_hooks/pre-receive`

Paste the following:
```bash
#!/bin/bash

echo 'Running project-specific pre-receive hook on the server to check that commit message has ticket number'

set -e

zero_commit='0000000000000000000000000000000000000000'
msg_regex='\b[A-z]+-[0-9]+\b'

while read -r oldrev newrev refname; do

	# Branch or tag got deleted, ignore the push
    [ "$newrev" = "$zero_commit" ] && continue

    # Calculate range for new branch/updated branch
    [ "$oldrev" = "$zero_commit" ] && range="$newrev" || range="$oldrev..$newrev"

	for commit in $(git rev-list "$range" --not --all); do
		commit_message=$(git log --max-count=1 --format=%B $commit) 
		if ! echo "$commit_message" | grep -iqE "$msg_regex"; then
			echo "ERROR:"
			echo "ERROR: Your push was rejected because"
			echo "ERROR: the commit message '$commit_message' has to start with JIRA Issue e.g. 'JIRA-1234'."
			echo "ERROR: for commit $commit in ${refname#refs/heads/}"
			echo "ERROR:"
			echo "ERROR: Please fix the commit message and push again."
			echo "ERROR: You can replace last commit message with \"git commit --amend -m 'JIRA-1234 ...'\""
			echo "ERROR: https://help.github.com/en/articles/changing-a-commit-message"
			echo "ERROR"
			exit 1
		fi
	done
done
```
9. Save (`:wq`) and set the file as executable (`chmod +x custom_hooks/pre-receive`)

Now if you try to push commit without commit message starting with jira num your push will be rejected:

<img src="assets/images/gitlab/repo_specific_1.png" width="50%" height="50%">
<br/>
<br/>
Once you fix the commit it works:

<br/>
<img src="assets/images/gitlab/repo_specific_2.png" width="50%" height="50%">
<br/>
<br/>

---
You can read more on Server Hooks for GitLab [here](https://docs.gitlab.com/ee/administration/server_hooks.html)
