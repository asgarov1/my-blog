# Installing sdkMan on Windows

---

1. Install GitBash
2. Install 7zip
3. Open Gitbash in Administrator Mode
4. Create Symbolic link to 7zip: `ln -s /c/Program\ Files/7-Zip/7z.exe /c/Program\ Files/Git/mingw64/bin/zip.exe`
5. Run the commands to install sdk:
```
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
```

that's it.
