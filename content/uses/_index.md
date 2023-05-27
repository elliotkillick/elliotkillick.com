+++
title = "Uses"
path = "uses"

[extra]
date = 2022-06-24
+++

This is a living document of the software and tools I use — maybe you find one of them helpful for use in your own life. I use a desktop to run Qubes OS, and a lightweight laptop to run OpenBSD (sometimes dual booting with Kali Linux). I've been running Qubes OS as my primary operating system ever since switching from Windows 10 in Janurary 2019.

All of the below software is open source (with minor noted exceptions) which accounts for the majority of software I use. When I have to use closed source software, usually for work purposes, I run it isolated in its own virtual machine.

## Editor & Terminal

- VSCodium (open source Visual Studio Code)
- Ghostwriter markdown editor for maintaining some notes
  - Minimal, works offline, and available in the official Debian repoisitories
- wxHexEditor (built from source w/ patches) for viewing, editing and diffing binary data
- Meld for diffing text files
- diff for testing if files differ between folders
- ZSH + custom dotfile w/ plugins from the official Debian/Fedora repositories
  - See my dotfiles repo (coming soon)
- IPython as a Python REPL
- Tilix as a tiling terminal emulator
- tmux as a terminal multiplexer (usually over SSH) + custom dotfile
- ShellCheck, Pylint, and Mypy for source code linting
- GNU coreutils and GNU/LLVM binutils for all kinds of data introspection and alteration
- htop for performance/process monitoring
- progress for keeping track of long running (and I/O bound) coreutil commands
  - It works by monitoring file descriptors in `/proc`
- Gedit
- Vim (on Linux and Windows, the latter through MSYS2)
  - Run `vimtutor` to learn how to efficiently edit files with Vim shortcuts
- Notepad++ on Windows

## Software

- Firefox
- KeePassXC as a password manager on desktop
- KeePassDX (Android) or Strongbox (iOS)
- Signal as a private and secure messaging client
  - Also, as a secure SMS/MMS client for Android
- Wire as a private and secure messaing client
  - Works without giving away your phone number
- Materialistic (Android) or Hackers (iOS) for mobile Hacker News clients
- GIMP or Krita for photo editing
  - Occasionally, Photoshop (proprietary) in its own air-gapped Windows VM to use their selection algorithms for background removal
- Kdenlive for video editing
- ScreenToGif for recording GIFs on Windows
- Byzanz for recording GIFs on Linux
  - Minimal (doesn't use FFmpeg; just X) and works
- Exodus for quickly relocating (dynamically linked) Linux binaries and all of its library/data dependencies across machines
  - Effectively makes Linux (ELF) executables as portable (or "backwards compatible") between OS versions as Windows (PE) executables tend to be so you can have the best of both designs
- Docker or Podman for containerization
- LibreOffice
- Thunderbird
- Wireshark (and TShark)
- ssdeep for quickly finding out how approximately related multiple files are (using a fuzzy hash)
- Diffoscope for zooming in on the differences of complex data structures between files
- Dash/Posh/nsh shell for writing secure shell scripts that handle untrusted data
- strace for debugging program errors
  - Often my next step after increasing verbosity, checking logs, searching up the error message, and trying ideas fail
  - Reading/grepping source code or binary strings may come after this
- Git
- QDirStat
- WinDirStat on Windows
- MSYS2 Bash shell (and Mintty terminal) on Windows as a CMD replacement and for coreutils (also prefer this over long object-oriented PowerShell commands IMO)
  - Better auto-complete plus support for transparency and color (e.g. PowerShell has no colored `ls`)
  - Many basic things like directory listings are noticeably faster with Bash `ls` than CMD `dir` (PowerShell `ls` is even slower than CMD `dir`!)
  - With a minimal dotfile that improves Windows integration (among other things)
  - Also, nice that the same commands work across my Linux and Windows VMs
  - It even comes with a real package manager (`pacman`) for installing packaged Windows binaries
- 7-Zip on Windows for compressing/archiving and file hashing
- Rufus for creating bootable USB drives on Windows (e.g. from an ISO file or disk image in `dd` mode)
- PE Tree and PEStudio for initial analysis of a PE (e.g. EXE or DLL) file (the latter is closed source and Windows-only)
- Sysinternals Suite (closed source) on Windows
  - Particularly Process Explorer and Process Monitor
- Visual Studio (closed source) on Windows
  - Some of the tools that ship with VS such as `dumpbin.exe` for dumping in-depth COFF/PE info
- GDB w/ GEF and rr for debugging (and reverse debugging) on Linux
- IDA for reverse engineering some Windows binaries (closed)
- WinDbg (Preview) for debugging on Windows (these are not open source)
  - SOS debugging extension (closed, by Microsoft) for managed code (e.g. mixed CLR programs or fully managed .NET programs)
  - Mona extension to aid in exploit development
- Ghidra as a decompiler on Linux and Windows
- Radare2 utilities
- NASM as an x86 assembler and disassembler
- Tetrane REVEN (closed source) based on open source Platform for Architecture-Neutral Dynamic Analysis (PANDA)
- Address Sanatizer to detect memory corruption (for when source code is available)
- Valgrind (and the wider suite of tools) to detect memory corruption (for when no source is available)
- TCMalloc minimal debug library for very fast and modern heap debug tools (including flexible allocation tracing and page fencing)
- OpenSSH for remoting and file sharing
  - With a minimal and secure configuration
- rEFInd boot manager to intelligentlly scan (even non-FAT drives) for UEFI boot entires and present them graphically
  - The boot manager that comes with my Gigabyte motherboard is very poor not even providing an option to boot from a custom EFI file
  - Tiny and generally solves all my booting problems (it's saved me from malformed/corrupted boot partitions)
- Qubes OS for all general purpose computing
  - [Qvm-Create-Windows-Qube](https://github.com/ElliotKillick/qvm-create-windows-qube) for automating the creation of Windows VMs for hacking labs (shameless plug)
  - [Qubes Video Companion](https://github.com/ElliotKillick/qubes-video-companion) for secure inter-VM webcam use in virtual meetings (\*shamelessness intensifies\*)
- OpenBSD for remoting into my Qubes OS machine from anywhere in the world
  - Securely set up SSH tunnel to Dom0 with TigerVNC inside
  - cwm window manager
  - Many custom dotfiles for the terminal, logon screen, lock screen (1337), window manager, X, and more
- Kali Linux for pentesting

## Websites

- https://grep.app for searching tons of GitHub repos all at once
  - Usually to find out the best common practice for doing something
  - Not open source but it's a website and the most valuable thing here is the data
- https://regexr.com for building and testing regexs
- https://godbolt.org for seeing how source code maps to assembly code
- https://cppinsights.io for finding out what C++ syntactical sugar compiles down to (in terms of more low-level language primitves)
- https://send.vis.ee (Send) for fast, secure, and lightweight file sharing (based on Firefox Send before it was shutdown)
- https://dpaste.org as a minimal and ephemeral pastebin (with very short URLs)
- https://newsblur.com (and its mobile apps) for RSS subscriptions
- ChatGPT (closed source) as an assistant
- Replit (closed) for temporarily deploying small projects with their convenient hosting
- Fast.com (closed) for running Internet speed tests
- VirusTotal (closed) for running preliminary virus scans on files, URLs, etc.
- Trello (**Absolutely Proprietary**) kanban boards for keeping track of my todo list and content creation pipeline

## Hardware

- Intel i5 4590 CPU
- Corsair Vengeance DDR3 32GB RAM (since upgrading from 12GB at the end of 2021)
- Crucial MX500 1TB SSD (main system and VMs drive), WD Black 750GB HDD (VMs drive), Samsung 970 EVO Plus 2TB M.2 SSD (VMs drive, another recent addition), WD Black 2TB HDD (bulk storage drive), and a Seagate Portable 4TB external USB HDD (Qubes backup drive)
- GeForce GTX 1050 Ti (for passing through to VMs)
- Audio-Technica ATH M50X headphones w/ Antlion ModMic 4 microphone
- Logitech C922 Pro Stream Webcam
- HyperX Alloy Core RGB Keyboard
- Edimax N150 Wi-Fi 4 Nano USB Adapter for OpenBSD (supported by urtwn(4) driver in base)
- SentrySafe Fire/Water Chest for securing encrypted backup drive (UL Classified and ETL Verifed)

<br />

---

To learn what this page looked like in the past, check out [its file history on GitHub](https://github.com/ElliotKillick/elliotkillick.com/commits/master/content/uses/_index.md).
