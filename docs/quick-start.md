---
sidebar_position: 1
---

# Quick Start

Get up and running with Noesis in just a few simple steps! This guide will walk you through basic configuration and running your first scan of your .NET repository.

## Prerequisites

Before you begin, make sure you have:

- **Docker** installed on your system
- **Docker access token** obtained from Noesis team
- **Noesis license file** (`.jwt`) obtained from Noesis team
- **A .NET 5+ repository** to analyze
- **Basic knowledge** of Docker and .NET project structure



## Step 1: Prepare Directory Structure

We recommend to create the following directory structure on your system:

```
noesis-workspace/
├── data/           # Noesis data (cache, results)
└── license.jwt     # License file
```

```bash
mkdir -p noesis-workspace/{data}
# Copy your license file to noesis-workspace/license.jwt
```

## Step 2: Run Noesis with zero config 

As a first step you should just start Noesis container without any individual config to check if you are able to access the UI and browse through the example repositories shipped together with Noesis distribution. 

You need to: 
1. Login to docker using Docker access token obtained from noesis team 
1. Mount the license.jwt 

Here is the sample command: 

TBD


## Step 3: Configure Basic Architecture Convention

In the `config/` directory, create a .NET project with basic DSL configuration:

```bash
cd noesis-workspace/config
dotnet new classlib -n NoesisConfig
cd NoesisConfig
```

Create the `ArchitectureConventions.cs` file:

```csharp
using Noesis.Parser;

namespace NoesisConfig
{
    //TODO
}
```

## Step 4: Run Noeis with your sources and configuration

Run the Docker container with basic configuration:

```bash
cd noesis-workspace

docker run \
  -v $(pwd)/config:/externalConfig:ro \
  -v $(pwd)/sources:/externalSources:ro \
  -v $(pwd)/data:/data \
  -v $(pwd)/license.jwt:/license.jwt:ro \
  -p 3000:8080 \
  --rm \
  ghcr.io/noesisvision/vision:latest
```

## Step 5: Open the User Interface

After starting the container, open your browser and navigate to:

```
http://localhost:3000
```

## Step 6: Run Your First Scan

1. In the Noesis interface, click **"Start Scan"**
2. Select your repository from the list of available projects
3. Wait for the analysis to complete (may take a few minutes)

## Step 7: Explore Results

After the scan completes, you can:

- **Browse modules** - see how Noesis identified your project structure
- **Analyze diagrams** - visualize relationships between components
- **Export documentation** - generate Markdown files with results

## Next Steps

Congratulations! You've successfully run your first scan in Noesis. Now you can:

- **[Configure advanced conventions](/docs/configure)** - customize architectural rules to your needs
- **[Explore the interface](/docs/explore)** - learn to use all Noesis UI features
- **[Add AI integration](/docs/setup#optional-llm-integration)** - enable component description generation

## Troubleshooting

### Issue: Container won't start
- Check if all volumes are properly mounted
- Ensure the license file is accessible
- Check container logs: `docker logs <container_id>`

## Need Help?

TBD Discord link

- Check the [full installation guide](/docs/setup)
- Review [configuration examples](/docs/configure)
- Visit our [GitHub repository](https://github.com/noesisvision/noesis)
- Join our [Discord community](https://discord.gg/noesis)
