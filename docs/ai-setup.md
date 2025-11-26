---
sidebar_position: 0
---

# AI Assisted Setup ✨

Set up Noesis Vision for your .NET repository in minutes using an AI agent like Claude Code. This approach is perfect for getting started quickly without manually following all configuration steps.

## Prerequisites

- **Docker** installed and running
- **Noesis license file** (`.jwt`) - [obtain from customer portal](https://portal.noesis-vision.com)
- **AI coding assistant** (e.g., [Claude Code](https://www.claude.com/product/claude-code), Codex, etc.)
- **.NET repository** you want to analyze

## Setup in 4 Steps

### Step 1: Get Your License

Download your `license.jwt` file from the [Noesis Customer Portal](https://portal.noesis-vision.com).

### Step 2: Create a Setup Directory

Create a new directory anywhere on your system and place the `license.jwt` file there:

```bash
mkdir noesis-setup
cd noesis-setup
# Place your license.jwt file here
```

### Step 3: Download AI Setup Instructions

Download the AI agent instructions:

```bash
curl -o noesis-setup.md https://raw.githubusercontent.com/NoesisVision/noesis-docs/main/agentic-setup/noesis-ai-setup.md
```

Or download directly from: [noesis-ai-setup.md](https://raw.githubusercontent.com/NoesisVision/noesis-docs/main/agentic-setup/noesis-ai-setup.md)

### Step 4: Run AI Agent Setup

Open your AI coding assistant (e.g., Claude Code) in the `noesis-setup` directory and use this prompt:

```
Set up Noesis Vision for the repository: [YOUR_GIT_REPO_URL]

Use the setup instructions from noesis-setup.md
```

**Example:**
```
Set up Noesis Vision for the repository: https://github.com/nopSolutions/nopCommerce.git

Use the setup instructions from noesis-setup.md
```

The AI agent will:
- Clone your repository
- Analyze its architecture and detect patterns (Controllers, Handlers, Services, etc.)
- Create customized Noesis configuration matching your actual code structure
- Generate a ready-to-run Docker script
- Provide you with complete setup documentation

## What the AI Does

The AI agent performs intelligent analysis and configuration:

1. **Repository Analysis:**
   - Clones the target repository
   - Detects the default branch name
   - Identifies .NET project structure

2. **Architecture Discovery:**
   - Finds entry points (Controllers, CommandHandlers, QueryHandlers, etc.)
   - Detects services and business components
   - Identifies repositories, entities, commands, queries
   - Analyzes namespace organization

3. **Configuration Generation:**
   - Creates `noesis-config` .NET project
   - Generates `ArchitectureConventions.cs` tailored to your codebase
   - Configures domain modules based on namespace hierarchy
   - Sets up entry point detection rules
   - Configures service and repository detection

4. **Setup Completion:**
   - Builds and validates the configuration
   - Creates Docker run script
   - Generates README with usage instructions

## After Setup

Once the AI completes the setup, you'll have:

```
noesis-setup/
├── license.jwt           # Your license file
├── data/                 # Noesis analysis data (created on first run)
├── [your-repo]/          # Cloned repository
├── noesis-config/        # Generated Noesis configuration
├── run-noesis.sh         # Docker run script
└── README.md             # Usage instructions
```

### Start Noesis

Run the generated script:

```bash
./run-noesis.sh
```

Or use the Docker command from the README.

### Access the UI

Open your browser and navigate to:
```
http://localhost:8088
```

### Run Your First Analysis

1. Click **"Analyze"** in the Noesis UI
2. Wait for the analysis to complete (check terminal logs)
3. Click **"Basic mode"** to view results
4. Explore:
   - **Modules** - Your system's domain structure
   - **Entry Points** - Business logic entry points
   - **Services** - Components and their relationships

## Customizing Configuration

The AI generates configuration based on detected patterns, but you can customize it further:

1. **Edit configuration:**
   ```bash
   cd noesis-config
   # Edit ArchitectureConventions.cs
   ```

2. **Rebuild:**
   ```bash
   dotnet build
   ```

3. **Restart Noesis** and run a new analysis

For advanced configuration options, see the [Configuration Guide](/docs/configure).

### Verifying and Improving Conventions

After the initial scan, if you notice that important architectural elements were not detected:

1. **Open the noesis-setup folder** in your code editor (e.g., VS Code)
2. **Review the detected conventions** in `noesis-config/ArchitectureConventions.cs`
3. **Work with your AI coding assistant** to improve the conventions:
   - Point out missing patterns you observe in your codebase
   - Ask the agent to add detection rules for those patterns
   - Iterate until all important elements are properly detected

This collaborative approach ensures your Noesis configuration accurately reflects your architecture.

## Troubleshooting

### AI agent can't find patterns

If the AI doesn't detect your architectural patterns:
- Manually review the generated `ArchitectureConventions.cs`
- Check the [Configuration Guide](/docs/configure) for additional pattern examples
- Look at [example configurations](https://github.com/NoesisVision/noesis-config) for similar projects

### License file issues

Ensure `license.jwt` is:
- In the correct location (root of setup directory)
- Readable (check file permissions)
- Valid (not expired)

### Configuration doesn't compile

If `noesis-config` continously fails to build and agent is not able to fix that by itself:
- Check for typos in `ArchitectureConventions.cs`
- Ensure `NoesisVision.Configuration` package is installed
- Verify .NET SDK version compatibility

## Manual Setup Alternative

If you prefer step-by-step manual setup or don't have access to an AI assistant, follow the [Getting Started Guide](/docs/quick-start).

## Next Steps

- **[Explore the UI](/docs/explore)** - Learn all Noesis features
- **[Configure Advanced Patterns](/docs/configure)** - Add more architectural conventions
- **[Add AI Descriptions](/docs/setup#optional-llm-integration)** - Enable component description generation
- **[Join our Discord](https://discord.gg/QF5PMX4Dqg)** - Get help and share feedback

## Why AI-Assisted Setup?

**Traditional setup** requires manually:
- Understanding Noesis DSL
- Analyzing your codebase structure
- Writing configuration matching your patterns
- Trial and error to get it right

**AI-assisted setup:**
- ✅ Analyzes your codebase automatically
- ✅ Generates tailored configuration
- ✅ Detects patterns you might miss
- ✅ Completes setup in minutes
- ✅ Provides explanations and documentation

Perfect for rapid prototyping, trying Noesis on multiple projects, or getting started without deep DSL knowledge!