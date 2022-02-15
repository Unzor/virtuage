# virtuage
Virtuage - QEMU (Linux loaded) running through VNC in a browser, display showed using Data URLs and &lt;img&gt; tags.

### [Demo (way slower than actual Virtuage)](https://qvnc.seven7four4.repl.co/)
# Notes
- You do not have to download QEMU (on Windows) as it is included in this repo.
- Keys are delayed a few MS, so when you type something, it will take less than a second for the keys to show up.
- Some keys (such as arrow keys) will not work because the keysym list kinda sucks
- Mouse support is not added because moving the mouse programmatically simply does not work.

# How to run
Clone this repo, run `npm install`, and change the settings.json file so you can run a different CDROM, hard disk image or floppy disk.
