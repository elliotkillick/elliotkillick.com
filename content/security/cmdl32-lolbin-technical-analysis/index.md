+++
title="Cmdl32 Lolbin: Technical Analysis of a Downloader Baked into Windows"
description="How you could have found it yourself and how it went undetected for over a decade..."
date=2023-06-29
[taxonomies]
categories = ["lolbin"]
tags = ["windows", "technical"]

[extra]
cover_image="cover.png"
og_image="cover.png"
toc=true
+++

{{ alert_warning(message="<a href='https://github.com/LOLBAS-Project/LOLBAS/blob/master/README.md'>Lolbins</a> are not security threats in the sense that they have no threat model besides the cat-and-mouse game of detection by antivirus software* (e.g. Windows Defender). I enjoy searching for them in the default Windows installation mostly because it's fun, easy to do, and good reverse engineering practice. Even then, the quality of lolbins can vary drastically in terms of how practically useful they would be in a real-world attack (Personally, I prefer to only report some of the nicer ones I find). Other times, the term 'lolbin' is (ironically) completely misused. Antivirus software should only be used as part of a more holisitc defense-in-depth strategy. If 'real' security is what you want then have a look at my binary exploitation or Qubes OS content (upcoming).") }}

`C:\Windows\System32\cmdl32.exe` is a program that's existed since the release of Windows 7/Vista replacing `cmdln32.exe` (with an "n") which worked in its place up until Windows XP. It's an antiquated tool for downloading old phone book profiles back in the days of dial-up Internet and has this icon:

{{ img(file="cmdl32-icon.ico" alt="Cmdl32.exe program icon") }}

**Okay, looks boring... Why do we care again?**

## Misusing Cmdl32.exe

Sitting dormant for over a decade was a hidden feature of `Cmdl32.exe` that if misused would allow someone to download not just phone book profiles but absolutely anything they want such as a custom malicious executable. You've probably seen my Tweet by now:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Need to go under the radar downloading <a href="https://twitter.com/hashtag/mimikatz?src=hash&amp;ref_src=twsrc%5Etfw">#mimikatz</a> (and other suspect payloads)? Then newly discovered <a href="https://twitter.com/hashtag/lolbin?src=hash&amp;ref_src=twsrc%5Etfw">#lolbin</a> &quot;C:\Windows\System32\Cmdl32.exe&quot; (signed by MS) is for you. It&#39;s like a new certutil.exe but absolutely unheard of by any antivirus software! <a href="https://t.co/fzQLLHRDoM">pic.twitter.com/fzQLLHRDoM</a></p>&mdash; Elliot (@ElliotKillick) <a href="https://twitter.com/ElliotKillick/status/1455897435063074824?ref_src=twsrc%5Etfw">November 3, 2021</a></blockquote>

A lot of the technical details have already been covered well on [Adam's (Hexacorn's) blog post](https://www.hexacorn.com/blog/2017/04/30/the-archaeologologogology-3-downloading-stuff-with-cmdln32/) where he came incredibly close to discovering this [lolbin](https://github.com/LOLBAS-Project/LOLBAS/blob/master/README.md) himself. I won't repeat any of what he said there so make sure you go give that a read.

What I will be covering are the techniques I used to overcome the final three hurdles in reverse engineering and practical use of this lolbin so you can improve the caliber of your own reverse engineering skills and maybe help you find some lolbins yourself! The tool we will be using to do this reverse engineering is [IDA (Interactive Disassembler) Free](https://hex-rays.com/ida-free/).

### Hurdle 1: The Final Argument

Picking up where the last blog post left off, there was difficulty passing a "RAS Enumeration check" by the function [RasEnumConnectionsA](https://learn.microsoft.com/en-us/windows/win32/api/ras/nf-ras-rasenumconnectionsa). For Remote Access Service (RAS, a legacy Win32 API that "provides remote access capabilities to client applications" over dial-up) to successfully enumerate a connection, it's required that there be an existing phonebook profile *and* that the connection is active. In testing, I was able to satisfy the first condition by creating a new connection in the `C:\Windows\System32\rasphone.exe` GUI program. The connection gets stored as a PBK file (same format as an INI file) at `%APPDATA%\Microsoft\Network\Connections\Pbk\rasphone.pbk`. However, the second part didn't seem possible without having a real modem to create an actual dial-up connection which is a non-starter.

Luckily for us, there's another way. Simply skip the `RasEnumConnectionsA` check instead of passing it. After conducting some thorough analysis up the program's control flow, I saw that there indeed did look to be a pathway for bypassing this check. It was later found that the way to activate this pathway was by specifying the `/lan` argument to `Cmdl32.exe`.

But, in a sea full of assembly and arrows pointing to all different blocks of code, how might one go about figuring this (and more problems) out for themselves? To figure that out, we will have to start from the beginning to learn how `Cmdl32.exe` parses and stores arguments...

`Cmdl32.exe` starts by calling `GetCommandLineA` to find out how the program was called including all of its arguments. After that, it iterates through the entire command line one character at a time looking for the first space (`0x20` in ASCII; also taking into account quotes/`0x22` in case the image path itself contains spaces) in the command-line to determine where the image path (`C:\Windows\System32\Cmdl32.exe`) ends and the program arguments (`/vpn /lan`, etc. in our case) begin.

{{ img(file="parse-command-line.png") }}

After finding the index in the command line at which program arguments begin, `Cmdl32.exe` uses [lstrcmpiA](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lstrcmpia) to search for each of its supported command-line options. For each one that's found, it performs a bitwise `or` operation on a single "argument flags" variable that indicates the presence of each option.

{{ img(file="option-strcmp.png") }}

If you're unfamiliar with bitwise operations and how they can be used to store data in the most efficient way possible (in binary; a base two numbering system) then I recommend searching that up to fully grasp the concept. However, here's the quick rundown: A standard 32-bit integer is made up of 32 1s and/or 0s, each of these is a boolean (either true or false value) which when manipulated individually (e.g. with a bitwise `or` operation) can be used to indicate a state (a command-line option in our case). Each state (command-line option) is assigned some hex identifier (like 0x10, 0x20, etc.) which can be checked for by doing fast bitwise operations on that one variable. Bitwise operations are much more efficient than the alternative of having the presence of each state given its own boolean variable each of which would be promoted to utilize a full 32-bits due to padding reasons, not to mention storing all the extra references/pointers to each of those boolean variables.

By analyzing the running program, I was able to gather that the hex identifier used to represent the presence of the `/vpn` option was `0x40` and for `/lan` was `0x20`. When analyzing the disassembly and runtime operations (using static and dynamic analysis techniques) of `Cmdl32.exe`, it will be important to look for these hex identifiers being used as a condition for which branch of code to execute.

Sure enough, here we can see `/vpn` being used to branch to two different code paths (note that `40h` is another notation for hex `0x40`):

{{ img(file="vpn-option-branch.png") }}

In the above picture, `0x60` is in the `r9` register because we have both `/vpn` (`0x40`) and `/lan` (`0x20`) specified on the command-line (`0x40 | 0x20 = 0x60`). Because `/vpn` is specified, this condition succeeds and we go down our desired code path.

`/lan` (in the `r9` register) is converted from its hex identifier of `0x20` into a boolean value (false or `0x0`; in this case meaning that `/vpn` is not on its own but is used with `/lan`) by performing a [bit shift](https://en.wikipedia.org/wiki/Bitwise_operation#Logical_shift) (`shr` instruction in the image) operation. The `r9` register is then passed as the fourth argument to `UpdateVpnFileForProfile`:

Function signature (not including the return value): `UpdateVpnFileForProfile(char const *, char const *, CmLogFile *, int)`

{{ img(file="bit-shift-lan-argument.png") }}

If you don't understand the (application binary) interface (ABI, like an API if you're familiar but refering to low-level interfaces that the compiler usually handles for you) used for passing arguments through function `call`s then I recommend you read up on calling conventions and specifically the ["Microsoft x64 calling convention"](https://en.wikipedia.org/wiki/X86_calling_conventions#Microsoft_x64_calling_convention) used here. If you plan to do reverse engineering of any kind on Windows then knowing and being able to easily identify this calling convention through assembly code (like in the image above) is *absolutely* **crucial**.

Note that the test of `rcx` here is just making sure that a configuration file path (a string, i.e. `const char *`) has been passed in on the command-line as well (shown as `%cd%\settings.txt` in the Twitter demonstration). With that, we're sent down the left code path into the `UpdateVpnFileForProfile` function where all the main activity of this lolbin (including downloading) really begins!

When `UpdateVpnFileForProfile` is called, it will test the boolean value (shown as an `int`eger in the function signature but it's equivalent to a `bool`ean in this case; this is probably because the `bool` data type didn't exist as a bulit-in in [C99](https://en.wikipedia.org/wiki/C99) (also old versions of C++) when this very old program was written so `int` was commonly used in its place) and based on that determine whether it should download from a URL or alternatively the unwanted case that leads to a dial-up connection with `RasEnumConnectionsA`.

The settings file being present (and similarly later the `/lan` option) causes the branch on the right (out of frame here) to *not* be taken leading us closer to our target. By taking the correct (left) path we avoid a call to `IsConnectionAlive` (not shown in the above picture) which leads directly to the unwanted `RasEnumConnectionsA`. Recall that `RasEnumConnectionsA` is undesirable because it requires that we have an active dial-up connection which we do not have.

Looking further, there appears to be another path to bypassing `IsConnectionAlive` if `ServiceName` under `[Connection Manager]` is left unspecified in our `settings.txt` file (from the Twitter demo). This code definitely wasn't present when I first analyzed `Cmdl32.exe` (in late 2021) but it looks to be an impossible condition anyway (at least without racing the check) because `ServiceName` was already validated to exist in our `settings.txt` long before this (otherwise the program exits early).

{{ img(file="lan-option-branch.png") }}

Or is it? The `lpFileName` (file path string) being used for this check is currently is the same as `settings.txt`, but what if we could change the file path for this specific check to use its own file named `settings2.txt` where we simply delete the `ServiceName=<VALUE>` entry. Sure enough, this is possible! As it stands, we have `CMSFile` in `settings.txt` (see Twitter demo) pointing back into its own file (`CMSFile=settings.txt`) but if we change this to `CMSFile=settings2.txt` and delete `ServiceName` in only that second file then we will have found another way to successfully bypass the `IsConnectionAlive` check without specifying the `/lan` option!

For compatibility with older versions of `Cmdl32.exe`, you're still going to want to use the `/lan` variant. But, we will keep this new method for starting the download without the `/lan` option a secret between you and me to bypass some detections (e.g. [Sigma](https://github.com/SigmaHQ/sigma/blob/6c153bff3f3b5bc7f0edefe430b2a6f903fd98b2/rules/windows/process_creation/proc_creation_win_lolbin_cmdl32.yml) and existing antiviruses/EDRs as I've seen this lolbin already added to the database of quite a few of them). Treat this as a reward for reading real technical write-ups instead of *only* consuming short GIFs/Shorts/TikToks (at least until this method also gets flagged by signature databases).

Shortly after this point, `Cmdl32.exe` reads our attacker-controlled web address of `UpdateUrl` from our configuration file (in the demo this URL is set to download Mimikatz):

{{ img(file="update-url.png") }}

Next, `Cmdl32.exe` creates a temporary file that will store the downloaded file. Note that [GetTempFileNameA](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-gettempfilenamea) only gives us back a file path to a newly created temporary file so `Cmdl32.exe` then has to call [CreateFileA](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilea) (a misnomer in this context) with `dwCreationDisposition` set to `OPEN_EXISTING` to get a file handle on the already existing file.

{{ img(file="temp-file.png") }}

Another technical detail for those paying close attention - you may notice in the above screenshot that `GetTempFileNameA` gives us back a pointer to the path of the newly created file in the `rsi` register (not the usual return value register of `rax`). This is because `GetTempFileNameA` does not return the file path but instead gives it to us through a pointer that we as a developer (or `Cmdl32.exe` in this case) have to pass into it as an argument (see in the `GetTempFileNameA` Microsoft documentation: `[out] LPSTR  lpTempFileName` and "Return value")

Immediately after this, `Cmdl32.exe` proceeds to use the Microsoft WinHTTP API to download a file from our chosen website:

{{ img(file="winhttp.png") }}

This is the pragmatic approach that would have had to be employed to successfully reverse engineer this part of the `Cmdl32.exe` downloader.

Another approach would have just been to get all the program strings and try each one of them in an attempt to reach your desired code path (i.e. bruteforce). To do this, make sure you lower the "minimum string length" because the default of 5 in IDA would have hidden some of these options. This assumes that your configuration file (`settings.txt`) is already correct and you just need to figure out this last `/lan` option. Note that the strings approach will work with varying degress of success due to differences in how some programs store such data (e.g. some programs store the options as just `LAN` not `/LAN` making it more difficult to tell which strings in a binary are its potential arguments as opposed to just noise).

{{ img(file="strings.png") }}

### Hurdle 2: Surviving DeleteFileA

At this point, we have successfully used `Cmdl32.exe` to make an HTTP (or HTTPS) request to download a file from a website of our choosing. We can see proof of this success by looking for the HTTP request with a packet sniffer such as Wireshark (`UpdateUrl=http://example.com` in `settings.txt` here):

{{ img(file="packet-capture.png") }}

But, there's a problem... If `Cmdl32.exe` detects that our downloaded file does not contain the `[VPN Servers]` profile section (just that text prepended to the file) then it will immediately delete the file:

{{ img(file="detect-vpn-servers-profile.png") }}

Followed by the actual deletion not long after the file is detected to not be in the valid format:

{{ img(file="delete-file.png") }}

One way to solve this would be to simply add the text `[VPN Servers]` to the start of our downloaded file, however, this would limit what we can download to maybe only scripts and base 64 encoded content (no binary data such as EXEs or DLLs).

I haven't tested whether `GetPrivateProfileSectionA` allows for arbitrary binary data after seeing the `[VPN Servers]` header it's looking for. But, in the case that it's allowed we could use run `findstr /v "[VPN Servers]" <FILE_PATH>` after downloading to remove the `[VPN Servers]` header and leave everything else (like our EXE data) in the file. `findstr.exe` fully supports binary data and is a known trick for achieving some things in batch programming and with lolbins.

Another (very dicey) approach would be to simply race the deletion, if we kept downloading the file until we were able to move/copy it before `DeleteFileA` is called by `Cmdl32.exe` then that might work. File creation and writing of the downloaded contents to the file are done with two separate Win32 function calls, `GetTempFileNameA` and `WriteFile` respectively (the whole file is written from a memory buffer at once). This means we would also have to check to make sure the file size isn't zero (only just created, nothing downloaded and written yet) before moving/copying. While I think this method is certainly possible, it's very noisy (not stealth) and would be a very dirty way of accomplishing our goal.

I briefly considered the former two approaches but quickly dismissed them after remembering that NTFS (the default filesystem used by Windows) supports denying deletion permissions on files/directories using [ACLs](https://en.wikipedia.org/wiki/Access-control_list) (as do the filesystems on Linux and MacOS). Furthermore, there is a command-line tool for granting and denying even advanced ACLs called `icacls.exe` that's been available since Windows Vista. Using `icacls.exe` to remove deletion permissions from the temporary directory (`%tmp%` or `%temp%`) for the current user is as simple as as running `icacls %tmp% /deny %username%:(OI)(CI)(DE,DC)` where `DE` = `delete` and `DC` = `delete child`. `(OI)(CI)` enables the inheritance of these permissions for new files as they are created in the directory. See the Twitter demo (or try it yourself) to see what this looks like.

### Hurdle 3: Controlling the Call to GetTempFileNameA

This is a bonus step which isn't technically required but adds that final touch to make this entire lolbin super clean. Right now, using this lolbin requires temporarily altering the permissions of the temporary folder (`C:\Users\%USERNAME%\AppData\Local\Temp` by default) which could lead to undesirable side effects in other programs also using that folder. So, is the `GetTempFileNameA` function possible to control in a way that would allow us to set an arbitrary "temporary" directory? Let's read the official [GetTempPathA Microsoft documentation](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-gettemppatha) to find out. Note that this documentation is stored under `GetTempPathA` but this part also applies to `GetTempFileNameA`. Looking at the "Remarks" section we immediately find the search path used by this Win32 function to determine where to store temporary files:

> The GetTempPath function checks for the existence of environment variables in the following order and uses the first path found:
>
> 1. The path specified by the TMP environment variable.
> 2. The path specified by the TEMP environment variable.
> 3. The path specified by the USERPROFILE environment variable.
> 4. The Windows directory.

Fantastic, we can easily control each of those first three environment variables in CMD! Let's go with the simplest option and set `TMP` (case-insensitive) to the current working directory (CWD):

```bat
set tmp=%cd%
```

To clarify for readers who aren't aware, the current working directory (CWD, or `%cd%` in CMD) is the directory shown at the prompt when you first open CMD. Every process has one and for CMD it will change as you navigate around with the `cd` command. For example, mine looks like this:

```bat
C:\Users\user>echo %cd%
C:\Users\user
C:\Users\user>cd Desktop
C:\Users\user\Desktop>echo %cd%
C:\Users\user\Desktop
```

Fantastic, now we can download straight to any diretory of our choosing with no chance of side effects for other programs!

### Putting it all together

With all of these tactics combined, we (red teamers, pentesters, or security researchers/fanatics) can utilize `Cmdl32.exe` as a [dropper](https://wikipedia.org/wiki/Dropper_(malware)) to download any file we want (with a program that's existed in Windows for a very long time even before `certutil.exe`!) in a super clean way that bypasses the detection that comes with using other utilities (e.g. `certutil.exe` which is detected & blocked by Windows Defender and many other cases) or PowerShell.

In regards to any use of PowerShell, detection (or failure) could very well be unavoidable even in the case that you have access to `PowerShell -Version 2` where Antimalware Scan Interface (AMSI) isn't supported. First of all, PowerShell version 2 requires .NET Framework version 3.5 (includes .NET 2.0 and 3.0) which no longer comes preinstalled on Windows 10. Also, I've personally seen multiple enterprise endpoint detection and response (EDR) systems silently disable certain dangerous functionalities such as `Invoke-WebRequest` *only* when using PowerShell version 2. Defenders weren't born yesterday and are well-aware of the simple PowerShell version 2 blindspot (as well as other techniques like `bitsadmin.exe` for which protection/detection may only be activated if the EDR detects it's deployed in a genuine enterprise environment) which is why attackers need new lolbins like this to stay ahead. Not to mention other PowerShell security features such as PS command-line logging (enabled by default), PS `ScriptBlock.CheckSuspiciousContent` (enabled by default in PS 5.0+), PS ScriptBlockLogging, PS Constrained Language Mode (CLM), and so on (sometimes enterprises even disable PS outright for high risk users/endpoints). Remember, it only takes one strong indicator of compromise (IoC) for a security operatons center (SOC) team to detect a threat and quarantine it from the network right at the point of initial compromise — thus foiling an entire attack before it could even take hold.

Additionally, by bringing the existence of this lolbin to light it's helped to make detection mechanisms (e.g. antivirus) for potentially malicious programs built into Windows a bit more robust thus making everyone (at least who uses Windows) a tiny bit more secure ("security through obscurity" = no security). This is the most important objective to ensure we don't accidentally help anyone with nefarious intentions.

If you haven't already, make sure to follow me on Twitter to see more great content, thanks!

## Is Cmdln32.exe affected?

As far as I can tell (I haven't tested), Cmdl**n**32.exe (included with Windows XP and Windows Server 2003) is mostly the same program as `Cmdl32.exe` at its core, just renamed. So, yes it should be. This question may appear to be irrelevant given how long those OSs have been out of support for but you would be surprised (or maybe not depending on your background) how many *very* legacy (not to mention vulnerable) systems exist in organizations (I see and hear about it all the time).

However, before Windows Vista `icacls.exe` didn't exist meaning there's no way you could have changed the folder permissions to prevent Cmdln32.exe from deleting the newly downloaded file upon realizing it's of incorrect type. Attempting one of the other methods mentioned in detail earlier to either pass the file validation check (`findstr.exe` has existed since Windows 2000) or race `DeleteFileA` may still yield favourable results here.

## Why did finding ths lolbin take over a decade?

This lolbin was certainly harder to crack than others because of the lack of a "help" (`/?`) option meaning actual reverse engineering is required. As well, it's pretty easy to overlook a single binary in a sea of programs placed in System32. But, there's also just not a whole lot of security researchers doing in-depth analysis on a ton of areas right now.

There's also the chance that some people were going to look into it but first saw Adam's post on `cmdln32.exe` and the newer `cmdl32.exe`, and decided that if someone has already looked into it then there's probably nothing more to be found. Luckily, this wasn't much of a factor for me because my research was mostly independent and I was stuck on the same `/lan` argument as Adam before searching the Internet for info about the binary.

Given enough time, I think anyone could have found this interesting usecase for `cmdl32.exe`. It just so happened that I had enough time available and decided to allocate the amount required to fully investigating this program (as there was a point early in the RE process where I considered if this program was worth looking into with so many other interesting targets).

I still do find it somewhat surprising that this one has survived as long as it has seeing as most other downloaders in Windows have been found quite quickly.

## Remarks

While writing this blog post, I was unsure of how much technical knowledge to assume the reader had as a prerequisite. I tried to err on the side of assuming a less knowledgeable reader so more people can understand and people who already know can skip ahead. But, feel free to provide feedback on this (the GitHub Issues of this website would work well) or even add what I missed yourself with a pull request. Since this is my first blog post, some feedback on my writing/editorial style would also be welcome.

2023 Update: Microsoft has now made the PDB (including function debug symbols) for `Cmdl32.exe` public which would have made it considerably easier to find this lolbin. Also, there have been changes to how it works since initial discovery (namely I notice that the `/vpn` (`0x40`) and `/lan` (`0x20`) are no longer checked at the same time as `0x60` but instead in two parts (additionally, I think the hex identifiers changed). Also, `RasEnumConnectionsA` is now only ever called from one function in `Cmdl32.exe` named `IsConnectionAlive` where before `RasEnumConnectionsA` was directly called all over the place (leading to code duplication). To me it looks like `Cmdl32.exe` has undergone a large refactoring. This analysis covers the 2023 version of [Cmdl32.exe](cmdl32.exe). This lolbin is still 100% working.

\*There have been a few cases where Microsoft removed potentially dangerous functionality (e.g. `MpCmdRun.exe` downloader, Mandiant's `rasautou.exe` DLL runner, and occasionally built-in UAC bypasses) but these are the exception not the rule.
