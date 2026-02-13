---
title: 'Master Your Time with Tock: The TUI Time Tracker'
date: '2026-02-02'
description: 'Tock is a powerful CLI tool to track time, visualize productivity in a TUI calendar, and keep data open and accessible.'
---

# Efficiency in the Terminal

Finding a time tracker that fits a developer's workflow can be challenging. Many tools are either complex SaaS products with clunky interfaces or simple command-line utilities that lack visualization. [**Tock**](https://github.com/kriuchkov/tock) bridges this gap. It lives in your terminal, is lightning fast, and provides a clear picture of your day without requiring you to leave the keyboard.

Tock is a free, open-source application written in Go that helps you track activties and visualize where your time goes via beautiful interactive reports. It saves everything in a simple, human-readable plain text file—no databases to manage, no vendor lock-in.

## Installation

Installation is comprehensive across platforms.

### Method 1: Homebrew (macOS/Linux)

The easiest method for macOS or Linux users with Homebrew:

```bash
    brew install tock # Official Homebrew
    brew install kriuchkov/tap/tock # latest from tap
```

### Method 2: Shell Script (Linux/macOS)

For a quick setup without Homebrew:

```bash
curl -sS https://raw.githubusercontent.com/kriuchkov/tock/master/install.sh | sh
```

### Method 3: Go Install

If you have the Go toolchain installed:

```bash
go install github.com/kriuchkov/tock/cmd/tock@latest
```

## Organizing Your Time

The core philosophy of Tock is speed and simplicity. It removes friction from the tracking process.

### Flexible Configuration

Tock supports a flexible configuration system using YAML files (typically `~/.config/tock/tock.yaml`) or environment variables for overrides.

Here is an example `tock.yaml` setup:

```yaml
backend: file
file:
    path: ~/tock.txt
time_format: "24"
weekly_target: "40h"
theme:
    name: custom
    primary: '#FF00FF'
```

You can also use environment variables to override settings:

```bash
# Override backend effectively
export TOCK_BACKEND="timewarrior"
export TOCK_THEME_NAME="light"
```

## Basic Usage

<img src="https://github.com/kriuchkov/tock/raw/master/assets/demo.gif"
    style="width: 820px; display: inline-block;"
    data-target="animated-image.originalImage"
 />

### Start Tracking Instantly

To start tracking a task, simply run:

```bash
tock start -d 'Fix javascript bug #345' -p 'Application Front End'
```

If you prefer an interactive guide, running `tock start` without arguments opens a wizard.

To stop tracking:

```bash
tock stop
```

### Context Switching

Jumping between tasks—meetings, code reviews, deep work—is frequent. Typing the full project name every time is inefficient. `tock continue` solves this.

First, view recent activities:

```bash
tock last
```

Then resume a task by its index:

```bash
tock continue 1
```

## Visualizing Productivity

Tock goes beyond logging; it helps you **see** your day.

### The Interactive Calendar

<a target="_blank"
    href="https://github.com/kriuchkov/tock/blob/master/assets/demo.png">
      <img
        src="https://github.com/kriuchkov/tock/raw/master/assets/demo.png" width="820px" style="max-width: 100%;"
        alt="Tock Time Tracker Demo Screenshot" />
</a>

Running `tock calendar` opens a full Terminal User Interface (TUI). It displays a monthly calendar grid and a daily timeline. Navigation is intuitive, supporting `h, j, k, l` (Vim style) or arrow keys.

### Flexible Reporting

Generate text summaries for standups or invoices easily:

```bash
tock report --today
tock report --summary  # Shows only project totals
```

## Advanced Features

### iCal Export

Sync tracked work with external calendars like Google Calendar or Apple Calendar using `.ics` export:

```bash
tock ical --path ./export
```

### Customizable Themes

Tock supports multiple themes (Dark, Light) and fully custom color schemes defined via environment variables, ensuring it fits perfectly into any terminal aesthetic.

Check out the project on GitHub: [kriuchkov/tock](https://github.com/kriuchkov/tock)
