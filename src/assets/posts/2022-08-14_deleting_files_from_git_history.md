# Deleting files from git history (remote)

---

I recently had this issue where I committed a sensitive .txt file. Here is an easy solution

## 1. Download bfg tool
You can download the bfg tool from [here](https://rtyley.github.io/bfg-repo-cleaner/) as jar

## 2. Run it and tell it which files to delete
`java -jar bfg-1.14.0.jar ./path/to/your/local/repository --delete-files *.txt`

After that just finalize changes and push to remote:

```
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push -f origin
```

Of course git push with a force flag is usually not a good idea due to the fact that 
it overwrites git history but in this case that is exactly what we are trying to achieve.
