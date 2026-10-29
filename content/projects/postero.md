---
title: 'Postero'
sort: 2
license: 'GPL-3.0'
description: 'A keyboard-driven terminal email client in a single binary. Read, triage, search and compose mail with vim-style keys, and draft replies with AI.'
image: '/images/projects/postero.gif'
link: 'https://github.com/kriuchkov/postero'
stack: ['Go', 'Bubble Tea', 'IMAP', 'SMTP', 'TUI', 'AI']
features:
  - "Vim-style keys for triage, search and compose"
  - "IMAP and SMTP with app passwords, keychain or OAuth2"
  - "Demo mode: a sample inbox, no account needed"
  - "AI drafts via Claude, OpenAI, Gemini or a local agent"
  - "Provider auto-detection in the first-run wizard"
install: "brew install kriuchkov/tap/postero"
---

# Postero

Postero (`pstr`) is a modern, open-source email client that lives in your terminal. Read, triage, search, compose and send mail with vim-style keys — no mouse, no browser, one static binary.

## Features

- **Keyboard-first TUI** - Bubble Tea based workflow for inboxes, drafts, attachments and focused reading
- **Modern authentication** - IMAP/SMTP accounts with app passwords, `password_cmd`, OS keychain storage and built-in OAuth2 login
- **First-run wizard** - Detects Gmail, Outlook, iCloud, Fastmail and others from the email domain and fills in hosts, ports and TLS
- **Demo mode** - Press `Ctrl+d` on first launch to explore a sample in-memory inbox, no account needed
- **AI drafting** - Generate replies with a hosted model (Claude, OpenAI, Gemini) or a local agent (OpenClaw, Claude Code) so content never leaves your machine
- **Fast search** - Keyboard-centric navigation with configurable HTML-to-text rendering

## Install

```bash
brew install kriuchkov/tap/postero
```

[View on GitHub](https://github.com/kriuchkov/postero)
