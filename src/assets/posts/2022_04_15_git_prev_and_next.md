# Git Prev & Next

---

I heard about these actions from a friend and got commands from [here](https://coderwall.com/p/ok-iyg/git-prev-next), 
but whenever I see something useful like this, I make sure to save it also in my blog, since it is likely I will often be needing 
this in the future, and other people sometimes close down their blogs:)

Anyhow, all you need to do is to set git aliases for the following to commands and et voilà - you can navigate your commits!

```
prev = checkout HEAD^1
next = "!sh -c 'git log --reverse --pretty=%H master | awk \"/$(git rev-parse HEAD)/{getline;print}\" | xargs git checkout'"
```
