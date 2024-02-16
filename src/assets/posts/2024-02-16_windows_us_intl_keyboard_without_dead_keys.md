# Windows US International Keyboard Without Dead Keys

## Background
So dead keys are a stupid waste of time for programmers like me, therefore I always try to select 
a keyboard layout without them. Unfortunately, Windows doesn't come with one preinstalled, therefore I had
to search for a workaround. All credits to the [original author](https://webcodr.io/2023/05/us-international-keyboard-layout-without-dead-keys/), 
but whenever I see something this useful, I write my own blog post to eliminate the risks of:
- me not being able to find the blog again in couple of years when I need it again
- the original blog getting taken down (most blogs close after some years)

So here are the instructions:

1. Download the [Microsoft Keyboard Layout Creator](https://www.microsoft.com/en-us/download/details.aspx?id=102134) 
from Microsoft’s website
   - It might require .NET Framework 3.5 if you don't have it installed - you can download and install it from [here](https://learn.microsoft.com/en-us/dotnet/framework/install/dotnet-35-windows)
2. Open the now installed Keyboard Layout creator and load the US international layout via 
`File` -> `Load Existing Keyboard...`
3. All dead keys are shown with a light grey background. You can remove their dead key status via the context menu
Don’t forget to activate the shift layer via the corresponding checkbox and disable the dead keys there as well
4. Save your config
5. Build the layout via Project -> Build DLL and Setup Package
6. After the build finished, a dialog will ask you to open the build directory. 
Open it and run `setup.exe` to install the new layout
7. Restart Windows. This should not be necessary, but unfortunately Windows is Windows …
8. Go to `Settings` -> `Time and Language` -> `Language and Region`
9. Select your preferred language and click the three dots and choose `Language options`
10. Use `Add a keyboard` and select `United States International - No Dead Keys`. I recommend to remove all other keyboard layouts, so they can’t interfere

That is all :)
