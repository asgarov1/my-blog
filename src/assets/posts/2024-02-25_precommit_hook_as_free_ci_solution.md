# Precommit hook as free CI solution

---

## Background

For my personal projects I like to ensure (just like at work) that no commits / merge requests break the build.
A proper CI solution however (like Jenkins or GitHub actions for private repos) costs money and not something
I want to spend money/time on for projects that don't bring any money in.

Simple solution - a `precommit` hook that will prevent commits if tests fail

## Instructions

So I usually work on fullstack projects following structure

```
.
├── .git
│   ├── branches
│   ├── description
│   ├── FETCH_HEAD
│   ├── HEAD
│   ├── hooks
│   ├── ...
├── backend
│   ├── pom.xml
│   ├── src
├── frontend
│   ├── angular.json
│   ├── package.json
│   ├── package-lock.json
│   ├── src
│   ├── ...
```

So I go to the `.git/hooks` and there create a `precommit` file (without any extension) with following content:

```bash
#!/bin/bash

# Execute Maven clean verify command
mvn clean verify -f ./backend/pom.xml

# Execute npm test command
npm run test-single-run --prefix ./frontend

# If either command fails, exit with a non-zero status code to prevent the commit
if [ $? -ne 0 ]; then
echo "Pre-commit checks failed. Please fix the issues before committing."
exit 1
fi

exit 0
```

Afterward I make the file executable (`chmod +x precommit`) and it will automatically run tests before each commit
and cancel commit if any test doesn't pass.

Make sure to adjust the paths in precommit file if your project structure is different:
- instead of `-f ./backend/pom.xml` specify path to your pom.xml 
- instead of `--prefix ./frontend` specify path to npm project 
