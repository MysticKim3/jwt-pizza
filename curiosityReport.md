# Shell Scripting
## Overview (And interesting uses)
It appears that shell scripting is really helpful for frequently repeated and/or long command chains executed in the shell. By putting tedious commands in a script, the script can be executed instead of writing all the commands in the terminal every time.

### Languages
- Bash: This seems to be the most common way to write it, but this does not run natively in windows.
- Python: I saw some examples of people using python for some os commands but much less than bash. 
> [!NOTE]
> There are other options such as C shell but I did not really look into them and will focus on bash syntax.

### Interesting possible scripts
- Disk Space Checker
- Service Status Checker
- Backup files or directory or database
- Encrypt or decrypt file
- Compare files
- Convert file type


## Fun small script I tried
```
#!/bin/bash

echo "New Script Yay!"
echo "Little game. Pick a num in 0-3 to play, 4 or greater to stop."
read randNum
coins=0
while [ $randNum -lt 4 ]; do
        echo "Yay you're still playing!"
        if [ $randNum -eq 3 ]; then
                echo "Muahaha you've fallen into a trap! No coins for you!"
                coins=0
        elif [ $randNum -eq 2 ]; then
                echo "Cha-ching"
                coins=$((coins+10))
        else
                echo "HMMMMMM"
                coins=$((coins+1))
        fi
        read randNum
done
echo "Money: $coins"
echo "Thanks for playing! BYEEEE!"
```
### Commands
- echo: Print to console
- read: Gets input from command line
- lt, eq: Comparators for bash, lt == < and eq == ==
- Variables: use $ before to use, var=value to set or can read to them
- while: different from other languages by using square brackets and done to finish
- if: different from other languages by using square brackets and fi to finish