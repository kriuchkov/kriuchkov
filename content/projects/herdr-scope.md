---
title: 'Herdr Scope'
sort: 4
license: 'MIT'
description: 'A sidebar for Herdr that shows which AI agent is working, which one waits on you, and which is done, grouped by project.'
image: '/images/projects/herdr-scope.gif'
logo: '/images/projects/logos/herdr-scope.svg'
link: 'https://github.com/kriuchkov/herdr-scope'
stack: ['Go', 'Herdr', 'TUI', 'AI Agents', 'Claude Code', 'Codex']
features:
  - "Spinner, ? and ✓ states at a glance"
  - "Grouped by project, busiest group first"
  - "Marks for 27 agent vendors"
  - "prefix+u jumps to the next agent waiting on you"
  - "Settings popup applied without a restart"
install: "herdr plugin install kriuchkov/herdr-scope --ref release"
---

# Herdr Scope

A sidebar for [Herdr](https://herdr.dev) that shows which agent is working, which one waits on you, and which finished while you were away. It only watches and paints: it never starts, prompts or stops an agent.

## Features

- **State at a glance** - A spinner while an agent works, a red `?` when it asks, a green `✓` held until you look, and idle rows that fade with age
- **Grouped by project** - Worktrees and nested folders hang under their repository, and the busiest group comes first
- **Vendor marks** - 27 agents, each with its own mark and colour, from the icon font or plain Unicode
- **Jump** - `prefix+u` goes to the next agent waiting on you
- **Fold and filter** - Fold a folder to one line, or show only the workspace you are in
- **Settings popup** - Every option is validated and applied without a restart
- **Light** - One Go binary and one daemon per session. Nothing goes over the network

## Install

```sh
herdr plugin install kriuchkov/herdr-scope --ref release
```

[View on GitHub](https://github.com/kriuchkov/herdr-scope)
