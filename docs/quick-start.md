---
sidebar_position: 1
---

# Quick Start

This practical tutorial will walk you through configuring Noesis step by step. After completing it, you'll be able to **see** -  "See how your system REALLY works" 🙂

What you should expect:
- **Your system visualization** in the form of domain modules
- **Entry points** contained in these modules - often corresponding to REST endpoints or business logic entry points
- **Service visualization** showing which services are used by each entry point and how they're interconnected

## Prerequisites

Before you begin, make sure you have:

- **Docker** installed on your system
- **Docker access token** obtained from Noesis team
- **Noesis license file** (`.jwt`) obtained from Noesis team
- **A .NET 5+ repository** to analyze
- **Basic knowledge** of Docker and .NET project structure

## Step 1: Prepare Directory Structure

We recommend using the following directory structure:

```
your-workspace/
├── noesis-workspace/
│   ├── data/                 # Noesis data (cache, results) - empty folder
│   └── license.jwt           # License file obtained from Noesis team
├── git-repos/                # Root directory with .NET git repositories to analyze
├── git-repos/my-system-repo/ # Reposiotry which you want to analyze
└── git-repos/noesis-config/  # Noesis DSL configuration project
```
:::info TIP for organizing your repos
On a local machine, **the easiest way to start is to create noesis-workspace next to your directory with the git repositories** (*obviously your git repository can be named differently than `git-repos`*). However, if you want to share only selected repos with Noesis, you may as well create a separate directory and put the scanned repos there. It is also a good practice if you want to scan different versions of git-repos than the ones which you currently modify. 
:::

 `noesis-config` is a new .NET library with Noesis DSL which you will create as a part of this tutorial. We recommend that thhis config  eventualy becomes one of your git repositories, so it's a good idea to put it inside `git-repos` as well.

Please note that for the first quick check you will need only:

```
your-workspace/
├── noesis-workspace/
│   ├── data/           # Noesis data (cache, results) - empty folder
│   └── license.jwt     # License file obtained from Noesis team
```


## Step 2: Docker Authentication

Start Docker or make sure that it's up and running. You need to authenticate with the Noesis Docker registry using `noesis-packages` as a username:

```bash
docker login ghcr.io -u noesis-packages
# Enter your access token when prompted (obtained from Noesis team)
```

## Step 3: First Noesis Run

Start by running the Noesis container without configuration to check if you can access the UI.

Make sure you are in the noesis-workspace directory:
``` bash
cd noesis-workspace
```

Run the basic docker command: 
``` bash
docker run \
  -v ./data:/data \
  -v ./license.jwt:/license.jwt:ro \
  -p 8088:8080 \
  --rm \
  ghcr.io/noesisvision/vision:latest
```

Open your browser and navigate to `http://localhost:8088`. You should see the Noesis interface with example repositories.

🎉 **First Success!** Noesis is running and you can browse example projects.

## Step 4: Basic Configuration - Domain Modules

Now we'll configure Noesis to analyze your repository. Let's start by creating a basic configuration that will detect domain modules according to namespace hierarchy.
In order to acheive that you are going to configure two new volumes in the container: 
- `externalSources` - it is a root directory of all the code repositories you want to scan 
- `externalConfig` - is a path to .NET project where in Noesis DSL you will specify your scanning rules and architecture conventions

### 4.0: Make sure the code for analysis is in `git-repos`

Clone the .NET repo to the `git-repos` directory or make sure that it is available there. In the tutorial we will assume that your repo name is `my-system-repo`no

### 4.1: Create Configuration Project

Now we will create a new configuration project `noesis-config` which we recommend to keep in git-repos as well. Make sure you are in the `git-repos` directory
```bash 
cd git-repos
```

Create a .NET library project named `noesis-config`:
```bash
# Create configuration project next to noesis-workspace
dotnet new classlib -n noesis-config
cd noesis-config
```

### 4.2: Add Basic Module Configuration

Create the `ArchitectureConventions.cs` file:

```csharp
using Noesis.Parser;

namespace NoesisConfig
{
    [FullAnalysisConfig]
    public static FullAnalysisConfig Create() => FullAnalysisConfigBuilder
        .System("My System")  // System name in documentation
        .Repositories(repositories => repositories
            .UseLocal("Main", "../my-system-repo"))  // Path to your repository relative to the externalSources dir
        .Conventions(conventions => conventions
            .ForDomainModules(convention => convention
                .UseNamespaceHierarchy()))  // Creates modules from namespaces
        .Build();
}
```

### 4.3: Run with Module Configuration
Navigate back to noesis-workspace
```bash
cd noesis-workspace
```

Run the docker command with the 2 new volumes added. **Please note that for `externalSources` you need to use root `git-repos` directory, not the full link to your repo!**

```bash
docker run \
  -v ../git-repos/noesis-config:/externalConfig:ro \
  -v ../git-repos:/externalSources:ro \
  -v ./data:/data \
  -v ./license.jwt:/license.jwt:ro \
  -p 8088:8080 \
  --rm \
  ghcr.io/noesisvision/vision:latest
```

### 4.4: Verify Modules

1. Open `http://localhost:8088`
2. Run a scan of your repository - the scanning may take a while - check logs for details and potential errors.
3. Go to the scan results and click **Modules** section - you should see modules created from your project's namespaces in the tree on the left.

🎉 **Second Success!** Noesis recognized your system structure and created domain modules.

## Step 5: Entry Points Configuration

Now we'll add entry points configuration - entry points to your system's business logic. These often correspond to REST API endpoints or command handling methods.

### 5.1: Add Entry Points Configuration

Update `ArchitectureConventions.cs`, adding entry points configuration. The configuration depends on your project patterns, but if you use typical `CommandHandlers` with method `Handle` it may look like that: 

```csharp
using Noesis.Parser;

namespace NoesisConfig
{
    [FullAnalysisConfig]
    public static FullAnalysisConfig Create() => FullAnalysisConfigBuilder
        .System("My System")
        .Repositories(repositories => repositories
            .UseLocal("Main", "../my-system-repo"))
        .Conventions(conventions => conventions
            .ForDomainModules(convention => convention
                .UseNamespaceHierarchy())
            // Add Entry Points configuration
            .ForDomainBehaviors(NoesisTags.Domain.EntryPoint, convention => convention
                .UseMethods()  // Analyze individual methods
                .FromTypes(types => types
                    .OfKind(TypeKind.Class)  // Only classes
                    .WithNameEndingWith("CommandHandler"))  // Handler naming convention
                .WithName("Handle")  // Method must be named "Handle"
                .SetName(method =>
                    $"{method.ContainingType.Name.Replace("CommandHandler", string.Empty)}"
                        .Humanize(LetterCasing.Title)))  // Create readable behavior name
        .Build();
}
```
For more options on how to configure entry point detection please refer to the [Conventions Documentation](configure.md#entry-points-configuration)

### 5.2: Run with Entry Points Configuration

Run the container again with updated configuration.

```bash
docker run \
  -v ../noesis-config:/externalConfig:ro \
  -v ../my-system-repo:/externalSources:ro \
  -v ./data:/data \
  -v ./license.jwt:/license.jwt:ro \
  -p 8088:8080 \
  --rm \
  ghcr.io/noesisvision/vision:latest
```

### 5.3: Verify Entry Points

1. Run a new scan
2. Go to the **Entry Points** section - you should see Handle methods inside modules in the tree on the left
3. Check if entry points are assigned to appropriate modules

🎉 **Third Success!** Noesis recognized entry points to your system and shows them in appropriate modules.

## Step 6: Services Configuration

Finally, we'll add services configuration - business components used by entry points.

### 6.1: Add Services Configuration

Update `ArchitectureConventions.cs`, adding services configuration:

```csharp
using Noesis.Parser;

namespace NoesisConfig
{
    [FullAnalysisConfig]
    public static FullAnalysisConfig Create() => FullAnalysisConfigBuilder
        .System("My System")
        .Repositories(repositories => repositories
            .UseLocal("Main", "../my-system-repo"))
        .Conventions(conventions => conventions
            .ForDomainModules(convention => convention
                .UseNamespaceHierarchy())
            .ForDomainBehaviors(NoesisTags.Domain.EntryPoint, convention => convention
                .UseMethods()  // Analyze individual methods
                .FromTypes(types => types
                    .OfKind(TypeKind.Class)  // Only classes
                    .WithNameEndingWith("CommandHandler"))  // Handler naming convention
                .WithName("Handle")  // Method must be named "Handle"
                .SetName(method =>
                    $"{method.ContainingType.Name.Replace("CommandHandler", string.Empty)}"
                        .Humanize(LetterCasing.Title)))  // Create readable behavior name
            // Add Services configuration
            .ForDomainObjects(NoesisTags.Domain.Service, convention => convention
                .UseTypes()  // Analyze types
                .WithNameEndingWith("Service")  // Interfaces ending with "Service"
                .SetName(type => type.Name[1..])))  // Remove "I" prefix
        .Build();
}
```

### 6.2: Run with Full Configuration

Run the container with complete configuration:

```bash
docker run \
  -v ../noesis-config:/externalConfig:ro \
  -v ../my-system-repo:/externalSources:ro \
  -v ./data:/data \
  -v ./license.jwt:/license.jwt:ro \
  -p 8088:8080 \
  --rm \
  ghcr.io/noesisvision/vision:latest
```

### 6.3: Verify Complete Visualization

1. Run final scan
2. Go to the **Entry Points** section in the newest scan result and click a plus icon of the entry points - you should see services from your system used by this entry point.
3. Add another entry point from the list which potentially share some services with the first one. You should see what are the common services

🎉 **Great Success!** You now have completed a first basic visualization of your system!

## What You've Achieved

Congratulations! After completing this tutorial, you can **see**:

✅ **Your system visualization** - domain modules created from namespaces  
✅ **Entry points** - business logic entry points (REST endpoints)  
✅ **Services** - business components used by entry points  
✅ **Relationships** - how entry points use services and how they're connected  

## Next Steps

Now that you have basic visualization, you can:

- **[Configure advanced conventions](/docs/configure)** - customize architectural rules to your needs, add entities, repositories, commands, queries and DDD pattersn
- **[Explore the interface](/docs/explore)** - learn to use all Noesis UI features
- **[Add AI integration](/docs/setup#optional-llm-integration)** - enable component description generation

## Troubleshooting

### Issue: Container won't start
- Check if all volumes are properly mounted
- Ensure the license file is accessible
- Check container logs: `docker logs <container_id>`

### Issue: Can't see your modules/entry points/services
- Ensure naming conventions match your code
- Verify the configuration project compiles correctly

## Need Help?

- Check the [full installation guide](/docs/setup)
- Review [configuration examples](/docs/configure)
- Visit our [GitHub repository](https://github.com/noesisvision/noesis)
- Join our [Discord community](https://discord.gg/QF5PMX4Dqg)
