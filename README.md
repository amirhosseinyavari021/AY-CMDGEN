# CMDGEN - Your Intelligent Command-Line Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

Generate, analyze, script, and debug command-line instructions with an AI-powered assistant, right in your terminal.

CMDGEN is a smart, cross-platform tool that bridges the gap between natural language and the command line. Whether you're a seasoned sysadmin, a developer, or just starting out, CMDGEN helps you master the terminal with ease. This project features both a powerful Command-Line Tool (CLI) and a user-friendly Web Application.

## ✨ Key Features

- **AI-Powered Generation:** Describe what you want to do, and get the exact command you need.
- **Intelligent Scripting:** Turn multi-step tasks into ready-to-run scripts for PowerShell, Bash, and more.
- **In-depth Analysis:** Paste any command to get a detailed, expert-level explanation of what it does.
- **Error Debugging:** Got an error? CMDGEN analyzes it and gives you a step-by-step solution.
- **Command History:** Access your 20 most recently generated commands with the `history` command.
- **Cross-Platform Support:** Natively works on Windows, macOS, and Linux for seamless compatibility.
- **Multi-Language Support:** Available in both English and Persian to cater to a wider audience.
- **Interactive Mode:** After generating commands in the CLI, execute them directly, request more suggestions, or exit effortlessly.
- **Configuration Management:** Easily manage default settings (like OS and shell) using the intuitive `config` command.
- **Self-Update Mechanism:** Automatically upgrade to the latest version with a simple `update` command.

## 🚀 Quick Install (Recommended)

The installation script automatically detects your OS, downloads the correct version, and sets it up for you.

⚠️ Administrator Privileges Required

cmdgen requires administrator/root privileges for global installation.  
Global installations write files into system directories (e.g., /usr/local/bin on macOS/Linux or Program Files on Windows). These locations are protected, so elevated permissions are needed.

Why it matters:  
Without admin privileges, installation may fail with “permission denied” errors or the program may not be accessible globally.

How to Install

**For macOS / Linux:**

Using NPM (recommended for Node.js users):

```bash
sudo npm install -g @amirhosseinyavari/ay-cmdgen
```

Using the installation script (requires sudo):

```bash
sudo curl -fsSL https://raw.githubusercontent.com/amirhosseinyavari021/ay-cmdgen/main/install.sh | bash
```

**For Windows:**

1. Open PowerShell as Administrator (right-click → Run as Administrator).

2. Install via NPM:

```powershell
npm install -g @amirhosseinyavari/ay-cmdgen
```

3. Or using the installation script:

```powershell
iwr https://raw.githubusercontent.com/amirhosseinyavari021/ay-cmdgen/main/install.ps1 | iex
```

✅ Tip for Users Without Admin Rights

If you cannot run commands with sudo (macOS/Linux) or as Administrator (Windows), you can still use cmdgen without installing it globally by using npx.  
npx is included with Node.js and allows you to run npm packages temporarily, without writing files to system directories, so admin privileges are not required.

Example:

```bash
npx @amirhosseinyavari/ay-cmdgen generate "list all files in system"
```

This runs the command directly without a global installation.

After Installation

- Open a new terminal window to start using cmdgen.

- Verify the installation by running:

```bash
cmdgen 
```

## ⚙️ How to Use

### Command Summary

Here's a quick reference table for all available commands:

| Command              | Alias | Description                                      |
|----------------------|-------|--------------------------------------------------|
| `generate <request>` | `g`   | Generate a single command                        |
| `script <request>`   | `s`   | Generate a full script                           |
| `analyze <command>`  | `a`   | Understand what a command does                   |
| `error <message>`    | `e`   | Help with an error message                       |
| `history`            |       | Show recently generated commands                 |
| `config [action]`    |       | Manage saved settings (show, set, wizard)        |
| `update`             |       | Update cmdgen to the latest version              |

### 1. First-Time Setup

The first time you run a command, CMDGEN will launch a quick setup wizard to learn about your OS and preferred shell. This ensures all future suggestions are perfectly tailored for your system.

```bash
# Just run any command to start the wizard
cmdgen g "list files"
```

### 2. Generate Commands (g)

Stuck? Just ask.

```powershell
# Get the top 5 processes by memory usage on Windows
cmdgen g "list the top 5 processes by memory usage in MB" --os windows --shell powershell
```

```bash
# Find large files on Linux
cmdgen g "find all files larger than 1GB in my home directory" --os linux --shell bash
```

### 3. Create Scripts (s)

Automate complex tasks instantly.

```bash
# Create a PowerShell script to clean up the temp folder
cmdgen s "delete all files in my temp folder older than 7 days and report the space freed"
```

```bash
# Create a Bash script to back up a directory
cmdgen s "create a backup of /etc/nginx and save it as nginx-backup.tar.gz in /opt/backups"
```

### 4. Analyze a Command (a)

Understand what a command does before you run it.

```bash
cmdgen a 'Get-CimInstance -ClassName Win32_BIOS | Format-List -Property *'
```

### 5. Debug an Error (e)

Turn confusing error messages into clear solutions.

```bash
# Get help with a common PowerShell error
cmdgen e "execution of scripts is disabled on this system."
```

```bash
# Figure out a "command not found" error on Linux
cmdgen e "bash: docker: command not found"
```

### 6. View Your History (history)

Quickly access your recently generated commands.

```bash
cmdgen history
```

### 7. Manage Configuration (config)

Run the setup wizard or view/manage your settings.

```bash
# Run the setup wizard to configure default OS and shell
cmdgen config wizard

# View current saved settings
cmdgen config show
```

### 8. Update the Tool (update)

Keep CMDGEN up-to-date with the latest features and fixes.

```bash
# Update cmdgen to the latest version
cmdgen update
```

## 💻 Web Version

Prefer a graphical interface? Use the web version instantly without any installation.

- https://cmdgen.onrender.com

## 👨‍💻 For Developers

Want to contribute or build from the source?

1. Clone the project: `git clone https://github.com/amirhosseinyavari021/ay-cmdgen.git`
2. Install dependencies: `cd ay-cmdgen && npm install`
3. Build all executables: `npm run release`

   The output files will be in the `dist` folder.

## Configuration

User settings are stored in a configuration file at `~/.cmdgen/config.json`. Advanced users can manually edit this file if needed to customize their default OS, shell, or other preferences.

## Contributing

Contributions are welcome! If you'd like to help improve CMDGEN, please feel free to fork the repository and submit a pull request.

## 📜 License

This project is dual-licensed under the [MIT License](https://opensource.org/licenses/MIT) and the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). See the LICENSE file for details.
