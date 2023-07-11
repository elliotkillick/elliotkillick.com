+++
title = "CVEs"
path = "cves"

[extra]
date = 2022-06-24
+++

This page documents all of my public significant security findings, primarily CVEs. Software I've helped secure includes the Valve Source Engine (with 1 **upcoming** CVE) and Microsoft Windows (security research, no public CVEs).

<br />

<div style="text-align: center">
<svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 653 200" style="width: 50%" role="img" aria-label="Source Engine logo">
    <path id="s" d="M 23.174265,127.30566 C 23.345105,137.94646 32.27447,142.24012 41.88716,142.24012 C 48.92322,142.24012 57.8499,139.49325 57.8499,130.90581 C 57.8499,123.52736 47.72124,120.94769 30.2108,117.17352 C 16.133057,114.08151 2.060007,109.10464 2.060007,93.48307 C 2.060007,70.82524 21.630313,64.98736 40.68434,64.98736 C 60.08379,64.98736 77.93614,71.50813 79.82515,93.30914 L 56.65161,93.30914 C 55.96491,83.87105 48.753,81.2952 40.00173,81.2952 C 34.50521,81.2952 26.436292,82.32298 26.436292,89.5344 C 26.436292,98.28964 40.17258,99.48842 54.07397,102.75448 C 68.32343,106.01322 82.22987,111.16441 82.22987,127.64689 C 82.22987,150.99197 61.97311,158.54419 41.71635,158.54419 C 21.118209,158.54419 1.035796,150.8209 4.3e-05,127.30186 L 23.174265,127.30186 L 23.174265,127.30566 z" style="fill: rgb(102, 102, 102);"/>
    <path id="o" d="M 132.69797,64.98736 C 160.68195,64.98736 178.7042,83.52898 178.7042,111.85131 C 178.7042,140.00617 160.68195,158.54419 132.69797,158.54419 C 104.88737,158.54419 86.86166,140.00617 86.86166,111.85131 C 86.86166,83.52898 104.88737,64.98736 132.69797,64.98736 z M 132.69797,140.17662 C 149.34735,140.17662 154.32479,125.92849 154.32479,111.85131 C 154.32479,97.60298 149.34735,83.3551 132.69797,83.3551 C 116.2153,83.3551 111.23876,97.60298 111.23876,111.85131 C 111.23876,125.93216 116.2153,140.17662 132.69797,140.17662 z" style="fill: rgb(102, 102, 102);"/>
    <path id="u" d="M 267.84154,156.14328 L 244.66767,156.14328 L 244.66767,143.78059 L 244.15131,143.78059 C 237.96839,153.73819 227.32763,158.54815 217.02867,158.54815 C 191.1083,158.54815 184.58362,143.95479 184.58362,121.97947 L 184.58362,67.39206 L 208.96356,67.39206 L 208.96356,117.51847 C 208.96356,132.11209 213.25432,139.31944 224.58498,139.31944 C 237.80126,139.31944 243.46864,131.94129 243.46864,113.91114 L 243.46864,67.39206 L 267.84154,67.39206 L 267.84154,156.14328 L 267.84154,156.14328 z" style="fill: rgb(102, 102, 102);"/>
    <path id="r" d="M 275.22786,67.39206 L 298.39747,67.39206 L 298.39747,83.87105 L 298.7416,83.87105 C 303.20385,72.71455 315.22169,64.98736 327.06856,64.98736 C 328.78706,64.98736 330.8462,65.33205 332.39067,65.84498 L 332.39067,88.50642 C 330.15639,87.98681 326.55232,87.6451 323.6388,87.6451 C 305.78507,87.6451 299.60366,100.52025 299.60366,116.14082 L 299.60366,156.1391 L 275.22786,156.1391 L 275.22786,67.39206 z" style="fill: rgb(102, 102, 102);"/>
    <path id="c" d="M 392.47327,98.63502 C 390.92679,88.6801 384.57304,83.35851 374.45166,83.35851 C 358.82678,83.35851 353.67558,99.15056 353.67558,112.19991 C 353.67558,124.90097 358.6564,140.18042 373.93237,140.18042 C 385.26317,140.18042 391.78737,132.97255 393.33148,122.15782 L 416.85081,122.15782 C 413.75902,145.67354 397.45188,158.55188 374.1068,158.55188 C 347.32518,158.55188 329.30293,139.66816 329.30293,113.06111 C 329.30293,85.42197 345.78127,64.99115 374.619,64.99115 C 395.56619,64.99115 414.79105,75.97666 416.33537,98.63502 L 392.47327,98.63502 z" style="fill: rgb(102, 102, 102);"/>
    <path id="e" d="M 443.79962,117.68941 C 444.48616,133.13991 452.0427,140.18042 465.60017,140.18042 C 475.38724,140.18042 483.28518,134.17174 484.82548,128.67838 L 506.28515,128.67838 C 499.41554,149.62227 484.82548,158.54815 464.74427,158.54815 C 436.76234,158.54815 419.42302,139.31944 419.42302,111.85547 C 419.42302,85.24769 437.79073,64.99115 464.74427,64.99115 C 494.95796,64.99115 509.5473,90.39921 507.83286,117.69291 L 443.79962,117.69291 L 443.79962,117.68941 z M 483.45611,102.23889 C 481.22199,89.87977 475.89886,83.35851 464.05292,83.35851 C 448.60601,83.35851 444.14078,95.37624 443.79962,102.23889 L 483.45611,102.23889 z" style="fill: rgb(102, 102, 102);"/>
    <path id="corner" d="M 591.62121,2.48665 C 586.04697,0.20065 580.89574,-0.06695 574.63446,0.012 L 468.52148,0.59412 C 446.62403,-0.51914 425.03851,4.84361 406.38084,15.58449 L 406.40013,15.60658 C 403.06302,17.42549 400.7921,20.97147 400.7921,25.03796 C 400.7921,30.96488 405.60191,35.77118 411.52499,35.77118 C 414.61665,35.77118 417.39203,34.45692 419.35228,32.36755 C 442.68249,19.86338 471.19737,17.45883 497.53351,28.27442 C 544.31211,47.47641 566.74725,101.1626 547.54083,147.93767 C 542.38953,160.48173 534.74005,171.25589 525.42489,179.97016 L 525.50673,180.08542 C 522.31888,181.94514 520.16635,185.39693 520.16635,189.35703 C 520.16635,195.28371 524.97935,200.08631 530.90695,200.08631 C 534.71807,200.08631 538.0654,198.08609 539.96975,195.07581 C 551.31929,184.40553 560.6238,171.2154 566.91837,155.88718 C 567.35224,154.84047 610.8282,48.94267 610.93937,48.65997 C 618.36201,30.58633 609.69577,9.90597 591.62121,2.48665 z" style="fill: rgb(247, 154, 16);"/>
	<path id="T" d="M 634.54004,24.17623 L 634.54004,35.70814 L 632.51721,35.70814 L 632.51721,24.17623 L 628.84345,24.17623 L 628.84345,22.36905 L 638.21448,22.36905 L 638.21448,24.17623 L 634.54004,24.17623 L 634.54004,24.17623 z"/>
    <path id="M" d="M 650.25347,35.70814 L 650.25347,26.78928 L 647.17375,33.28807 L 645.67809,33.28807 L 642.52743,26.78928 L 642.52743,35.70814 L 640.50472,35.70814 L 640.50472,22.36905 L 642.52743,22.36905 L 646.42458,30.66779 L 650.25347,22.36905 L 652.27327,22.36905 L 652.27327,35.70814 L 650.25347,35.70814 L 650.25347,35.70814 z"/>
</svg>

## Remote Code Execution in the Valve Source Engine (CVE-2023-XXXX)

</div>

The Source Engine is a game engine which powers many of the big name titles with daily user counts in the hundreds of thousands.

A bug in the the parsing of map (.BSP) files when connecting to an attacker-controlled server (e.g. through a malicious website, Steam invite, or spoofing high player count on the community server list) could lead to arbitrary code execution on a victim's computer. The result is a full compromise of the remote computer at which point an attacker could install malware, move laterally through out the network to infect more hosts, and more.

The bug (not disclosing details for now) causes a pointer to be tainted with data from an attacker-controlled BSP file. This pointer is later used as part of a virtual call thus allowing the attacker to redirect execution flow and eventually execute arbitrary code.

Affects: Windows, Mac OSX, and Linux</br>
CVSS: <span style="font-weight: 800">* <span style="color: red; text-decoration: underline">10.0</span> *</span>

<br />

**This bug (while confirmed) is currently still being fixed by Valve.**

**Once it's been patched, expect to see a blog post on the vulnerability and exploit. It will cover a lot of things such as why this vulnerability has existed for so long in such a common part of the code despite large efforts in fuzzing the Source Engine, previously unseen techniques I used which made exploit creation and hacking around with the Source Engine 1000x easier, touch on this bug's exploitability even under next-gen exploit mitigations (e.g. Intel CET and memory tagging), and more.**

**Lastly, I'll talk about how I created my first RCE exploit from practically no prior binary exploitation experience and give some ideas on how you could easily do the same thing. Additionally, all the tools I created along the way to assist exploitation efforts and greatly increase debugging productivity will be open sourced on GitHub.**

{{ img(file="h1-valve-screenshot.png") }}

<br />
<br />

<a href="https://hackerone.com/elliotkillick" target="_blank">HackerOne Report</a> (pending release)

<br />

<div style="text-align: center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 476 88" style="width: 60%" fill="#0078d6" role="img" aria-label="Microsoft Windows 10 logo"><path d="M0 12.5l35.7-4.9v34.5H0M40 6.9L87.3 0v41.8H40M0 45.74h35.7v34.6l-35.7-5M40 46.2h47.3v41.4L40 80.9M114 17l6.76.04 10.5 38.1c.75 2.66 1.3 5.38 1.64 8.14 3.66-15.6 8.66-30.8 12.9-46.2l5.85.02 9.04 33c1.13 4.38 2.6 8.7 3.05 13.2 3.3-15.6 8.03-30.8 11.8-46.2l6.66-.03-14.8 53h-7.2l-10.7-38.1c-.6-2.05-.85-4.17-1.04-6.3-.28 1.83-.54 3.68-1 5.47l-10.8 38.8c-2.4.13-4.8.14-7.2.12l-15.4-53m71.94.34a4 4 0 1 1 0 1m.9 13.6h6v38h-6m22.16-31.88c3.43-6.1 11.43-8.92 17.88-6.1 5.13 2 7.04 7.94 7.2 13 .28 8.32.05 16.65.12 24.97-2 0-4 0-6-.01-.1-8 .2-16-.14-24-.16-3.96-1.84-8.72-6.15-9.73-6.3-1.9-12.57 3.77-12.77 10-.18 7.9-.01 15.83-.07 23.74h-6V32h6l-.08 6.12M270 14h6v56h-5.98l-.17-6.1c-4.33 7.78-15.9 9.5-22.5 3.73-4.73-4.07-6.17-10.7-5.92-16.7.05-6.08 2.05-12.5 6.9-16.5 6.3-5.18 17.4-4.88 21.8 2.73l-.04-23.2m-12.9 22.1c-4.8.76-8.05 5.14-8.95 9.67-1.18 5.46-.97 11.8 2.47 16.4 3.72 4.94 11.9 5.05 15.9.38 2.7-2.82 3.48-6.86 3.5-10.6.03-4 .37-8.5-2.28-11.8-2.34-3.33-6.7-4.83-10.6-4m41.77-5c5.35-.47 11.3.37 15.3 4.24 4.54 4.2 5.9 10.7 5.64 16.6-.07 5.35-2.05 10.8-5.97 14.5-8.18 7.44-23.4 5.8-28.6-4.42-4.08-8.57-3.26-20.4 4.2-26.9 2.67-2.26 6.05-3.3 9.4-4.04m-1.08 5.44c-8.8 2.7-10.3 14.2-7.55 21.8 2.2 6.72 10.7 9.7 16.9 6.56 4.15-1.9 6.04-6.6 6.44-10.9.45-5 .05-10.7-3.5-14.6-3-3.38-8.08-4.1-12.3-2.87M323 32h6.26l7.4 27.2c.5 1.7.7 3.46.88 5.22 2.83-10.9 6.4-21.6 9.62-32.4l5.47.03c2.75 10.8 6.17 21.4 8.45 32.4 2.35-10.8 5.7-21.5 8.3-32.2 2-.1 4.02-.13 6.04-.15l-11.3 38h-6.22c-2.7-10.3-6.2-20.4-8.4-30.8-2.6 10.4-6.23 20.5-9.2 30.8h-6l-11.3-38m67-1.1c3.75-.26 7.57.1 11.1 1.48.98 1.86.22 4.3.45 6.4-4.2-2.63-10-4.3-14.6-1.63-3.13 1.7-3.28 6.73-.23 8.6 4.37 2.83 9.92 3.57 13.8 7.2 4.28 4.12 3.24 12-1.77 15.1-6.1 3.88-14.1 3.5-20.5.54l-.05-6.72c4.54 3.46 10.9 5.38 16.4 2.92 3.17-1.6 3.33-6.46.54-8.5-4.37-3.22-10.4-3.73-14.2-7.75-3.83-3.86-3.14-11 1.13-14.2 2.2-2.03 5.2-2.64 8-3.43M432 16.2l2.1-.3V70h-5.92l.07-45.1c-3.77 2.6-7.84 4.84-12.3 6.08l.07-6c5.8-1.97 11.1-5.15 15.9-8.86M456 16.1c5.2-.87 11 1.03 14.1 5.45 4.4 6.2 4.8 14.2 5.02 21.5-.15 7.74-1 16.1-5.94 22.4-4.55 5.97-13.9 7.37-20 2.98-4.95-3.57-6.9-9.8-7.77-15.6-1-8.57-.9-17.6 2.07-25.7 1.88-5.55 6.52-10.3 12.5-11m-.92 5.37c-5.33 2.16-6.86 8.46-7.6 13.6-.78 7.14-.96 14.5.74 21.5.85 3.46 2.64 7.13 6.07 8.65 3.9 1.96 9.1.27 11.1-3.57 3.27-5.65 3.35-12.4 3.4-18.8-.13-6.2-.38-12.8-3.8-18.2-2.03-3.28-6.4-4.6-9.94-3.18"/></svg>

## Microsoft Windows Security Findings

</div>

- Windows Defender Tamper Protection is yet another piece of security theater by Microsoft which poses no real security barrier
  - To my knowledge, I was the first to come out with a <a href="https://github.com/ElliotKillick/qvm-create-windows-qube/blob/2cad79d6da933254663beebe03022d5a5dd3cc7b/post/optimize.bat#L49-L63" target="_blank">clean 'bypass'</a> for disabling Tamper Protection which works by editing a registry key ACL (also reporting it to the MSRC)
  - This is a universal technique that works to defeat the tamper protection mechanisms of any antivirus program on Windows
- LOLBin findings in the default Windows installation
  - Demonstrates how misuse of programs built into the latest versions of Windows can pose a security threat
  - These are especially helpful for bypassing detection in early post-exploitation phases before loading a custom implant
    - Some of them also work well as hidden persistence mechanisms
- A couple currently undisclosed remote zero day bugs

<br />

I've also made multiple contributions directly to defensive security by solving problems with secure design and code (see my GitHub).

<br />

*More coming soon...*
