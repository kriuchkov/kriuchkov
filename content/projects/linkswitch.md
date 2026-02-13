---
title: "LinkSwitch"
sort: 3
license: 'GPL-3.0'
description: "LinkSwitch is an ultra-lightweight native link router for macOS, written in C/Objective-C."
image: '/images/projects/linkswith_black.png'
link: "https://github.com/kriuchkov/linkswitch"
stack: ["C", "Objective-C", "macOS", "YAML"]
---

# LinkSwitch

LinkSwitch is an ultra-lightweight native link router for macOS, written in C/Objective-C. It replaces the default browser and allows you to open links in different browsers based on rules or via a selection menu.

## Features

- **Instant Launch**: Written in native code, consumes 20MB RAM.
- **Zero Background Usage**: The app runs only when a link is clicked and exits immediately after.
- **Rules**: Flexible configuration via YAML (`~/.config/linkswitch/config.yaml`).
- **Selection Menu**: If no rule is matched, shows a system window with a list of installed browsers.
