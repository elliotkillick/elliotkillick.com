+++
title="Website Demo"
description="Let's take this website out for a spin!"
date=2022-01-01

[taxonomies]
categories = ["test"]
tags = ["rust"]

[extra]
cover_image="cover.png"
og_image="cover.png"
toc=true
+++

Here's a general demo of elliotonsecurity.com as rendered by Zola (a Rust powered static site generator) and how things look.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

# Header I

Inline code: `println!("EOS!");`

Zola has built in syntax highlighting. If there's not a theme you like, you can
easily add more.

elliotonsecurity.com has Fira Code fonts, which means we get ligatures in addition to
Zola's powerful syntax highlighting ✨.

```rs
fn foo(arg: String) -> Result<u32, Io::Error> {
    println!("Nice!"); // TODO: More ligatures
    if 1 != 0 {
        println!("How many ligatures can I contrive??");
        println!("Turns out a lot! ==> -/-> <!-- <$> >>=");
    }
    Ok(42)
}
```

Here's lots of code:

```python
# pylint: disable=invalid-name

import os
from typing import List, NamedTuple, Optional
# pylint: disable=import-error
import gdb

class DumpMemory(gdb.Command):
    """
    Dump raw contents of all process memory mappings.

    Optionally, filter on *minimum* mapping permissions
    (for example searching for "rw" will also search for "rwx")
    by inputing one of these as the first argument:
    r, rw, rx, rwx

    All output is placed in the CWD.
    Folder names are based on the program name with
    "-dump" appended and iteratively count up from one.
    File output format is: <START_ADDRESS>-<OBJFILE>.img
    """

    def __init__(self) -> None:
        super().__init__("dump-memory", gdb.COMMAND_USER)
        try:
            gdb.execute('alias -a dm = dump-memory')
        except gdb.error:
            # Alias already exists
            pass

    # pylint: disable=unused-argument
    def invoke(self, args: str, from_tty: bool) -> None:
        """Get and dump contents of all process mappings"""

        if not self.is_gdb_running():
            print("[!] The target process must be running")
            return

        perms = ""

        if args:
            args = args.split()

            perms = args[0].lower()

            # Technically there are also "p" (private) and "s" (shared)
            # permissions but we don't care about those
            for perm in perms:
                if perm not in ('r', 'w', 'x'):
                    print("[!] Invalid permissions filter")
                    return

        gdb.execute('set dump-excluded-mappings on')
        self.dump_mappings(self.get_memory_mappings(), perms)

    def is_gdb_running(self) -> bool:
        """Detect if GDB is running"""

        try:
            gdb.selected_inferior().threads()[0]
        except IndexError:
            return False

        return True

    # Necessary for correct typing information
    class Section(NamedTuple):
        """Memory mapping"""

        start_addr: int
        end_addr: int
        perms: str
        size: int
        offset: int
        name: str

    def get_memory_mappings(self) -> List[Section]:
        """Get list of all the memory mappings in the process"""

        maps = gdb.execute('info proc mappings', to_string=True).splitlines()
        # GDB unfortunately doesn't directly expose mapping
        # permissions so manually get it from procfs
        try:
            with open(f'/proc/{gdb.selected_inferior().pid}/maps', encoding='utf-8') as f:
                procfs_maps = f.readlines()
        except FileNotFoundError:
            # FIXME: This can happen if procfs isn't mounted or isn't supported (true on some BSDs)
            # Also, rr debugger doesn't create a procfs entry for the debugged process
            # Look into how GEF does this as using "vmmap" shows permissions just fine there
            print("WARNING: Failed to open procfs entry for target process")
            procfs_maps = ""

        # Remove header
        maps = maps[4:]

        sections = []
        for i, line in enumerate(maps):
            line = line.split()

            section = self.Section(start_addr=int(line[0], 16),
                                   end_addr=int(line[1], 16),
                                   perms=procfs_maps[i].split()[1] if procfs_maps != "" else "",
                                   size=int(line[2], 16),
                                   offset=int(line[3], 16),
                                   name=' '.join(line[4:]))
            sections.append(section)

        return sections

    def dump_mappings(self, sections: List[Section], perms: str) -> None:
        """
        Dump all memory mappings unless excluded by permissions filter (if specified)

        Log dump destination to the terminal.
        """

        dump_folder_name = self.generate_iterative_filename('dump', is_directory=True)
        print(f"Dumping memory mappings to '{os.getcwd()}/{dump_folder_name}'...")

        inferior = gdb.selected_inferior()
        for section in sections:
            # [vvar] is a memory mapping internal to the Linux kernel which cannot be dumped
            # This is true even with "set dump-excluded-mappings on" and GDB running as root
            # https://lkml.iu.edu/hypermail/linux/kernel/1503.1/03969.html
            if section.name == '[vvar]':
                continue

            if not self.filter_permissions(perms, section.perms):
                continue

            dump_filename = (f"{hex(section.start_addr)}"
                             f"{'-' if section.name != '' else ''}"
                             f"{section.name.replace('/', '!')}.img")

            # "dump" command doesn't support spaces in the "filename" parameter.
            # If speed matters most, then simply replace any spaces in
            # "dump_folder_name" and "dump_filename" with underscores.
            #dump_folder_name = dump_folder_name.replace(' ', '_')
            #dump_filename = dump_filename.replace(' ', '_')
            #gdb.execute((f"dump memory"
            #             f"{dump_folder_name}/{dump_filename}"
            #             f"{section.start_addr} {section.end_addr}"))

            # Use read_memory() then open() approach to retain filename
            # spaces although this is unfortunately a bit slower.
            memory = inferior.read_memory(section.start_addr,
                                          section.end_addr - section.start_addr)
            with open(f"{dump_folder_name}/{dump_filename}", 'wb') as f:
                f.write(memory)

    def filter_permissions(self, perms: str, perms_filter: str):
        """
        Filter for mappings with minimum specified permissions
        For example, filtering for RX permissions will include
        RWX mappings but not R (read-only) mappings
        """

        for perm in perms:
            if perm not in perms_filter:
                return False

        return True

    def generate_iterative_filename(self, name: str, is_directory: Optional[bool] = False) -> str:
        """
        Filenames are based on the program name with a dash and the given name
        appended, and iteratively count up from one if the file already exists.

        A file or directory is created in the CWD with the generated name.
        """

        # Preferred option is to not rely on procfs
        program = gdb.current_progspace().filename
        if program is None:
            # Get program filename using this method because the former returns
            # "None" when GDB has a core file open. Seems to be a GDB bug...
            program = ' '.join(gdb.execute('info proc exe', to_string=True)
                               .splitlines()[-1].split()[2:])[1:-1]
        program = os.path.basename(program)

        n = 1
        while True:
            try:
                filename = f"{program}-{name}{n}"
                if not is_directory:
                    # pylint: disable=consider-using-with
                    open(filename, 'xb').close()
                else:
                    os.mkdir(filename)
            except FileExistsError:
                n += 1
            else:
                return filename

DumpMemory()
```

### Screenshot

{{ img(file="screenshot.png" alt="IDA screenshot") }}

## Header II

Block quote sample:

> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
>
> -- "Lorem Ipsum", _2000_

{{ alert_info(message="Here's a small titbit of information for you.") }}
{{ alert_warning(message="Hey! Be careful of what you're doing over there!") }}
{{ alert_success(message="Wow! Great job! Whatever you were doing works!") }}
{{ alert_danger(message="Oh dear. You just broke the internet.") }}

### Header III

OpenBSD mitigation tier table:

| Name                 | Description                                                                               | Tier   | Remarks                                                                                                                                                                                                   |
|----------------------|-------------------------------------------------------------------------------------------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| KARL                 | Randomly relinks kernel objects every boot                                                | A-     | Stronger than standard ASLR. Can only protect against small leaks (e.g. uninitialized variable) and make some relative write bugs more difficult to exploit                                               |
| Otto Malloc          | Seriously hardened heap implementation                                                    | A      | Makes inter-chunk heap corruption and use-after-frees much more difficult to reliably exploit (more so than other hardened mallocs). A tad bit slow                                                       |
| RETGAURD             | Function prologue combines return address + random cookie - value validated before return | C      | Guards against return address overwrite in a stack buffer overflow. Also a CFI mechanism, backward-edge RETGAURD can be bypassed by arbitrary read and forward-edge protection is non-existent on OpenBSD |
| Pledge               | Simple and effective system call filtering                                                | A      | Part of an effective sandbox; like seccomp on Linux but easier to implement. Also, OpenBSD only has ~230 (all archs) syscalls and no procfs compared to ~335 (only x86-64) or 400+ (arm64) on Linux       |
| TRAPSLED             | Converts NOP -> INT3 instructions during compilation                                      | **/S** | True successor to ASLR. Next-gen pointer authentication.                                                                                                                                                  |
| doas                 | Secure privilege escalation                                                               | A+     | Only ~400 lines of code in one file compared to sudo with 20K+ lines of C code                                                                                                                            |
| Attack Surface       | How many lines of code overall                                                            | S      | OpenBSD is at least 20 million lines of code lighter than Linux. Note that a lot of this is in drivers that nobody will be using all at once. However, OpenBSD still easily prevails here                 |

#### Header IV

Here's an embedded video:

{{ youtube(id="cCi2MOUwS_Q") }}

How epic.

# Last Header

- Point 0x1
- Point 0x2
- Point 0x3
