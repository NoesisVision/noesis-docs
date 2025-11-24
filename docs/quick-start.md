---
sidebar_position: 1
---

# Getting Started

This practical tutorial will walk you through configuring Noesis step by step. After completing it, you'll be able to **see** -  "See how your system REALLY works" 🙂

What you should expect:
- **Your system visualization** in the form of [P3 model elements](https://github.com/NoesisVision/P3-model/blob/main/Elements.md)
- **Entry points** contained in these modules - often corresponding to REST endpoints or business logic entry points
- **Service visualization** showing which services are used by each entry point and how they're interconnected

:::info Understanding the P3 Model
Understanding the [P3 model](https://github.com/NoesisVision/P3-model/blob/main/Elements.md) is crucial for effective Noesis configuration. The P3 model defines three key elements: **domain modules**, **domain objects**, and **domain behaviors** that form the foundation of how Noesis analyzes and visualizes your system architecture.
:::

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

 `noesis-config` is a new .NET library with Noesis DSL which you will create as a part of this tutorial. We recommend that this config eventually becomes one of your git repositories, so it's a good idea to put it inside `git-repos` as well.

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

Now we'll configure Noesis to analyze your repository and make the full use of directory structure presented in [Step 1](#step-1-prepare-directory-structure). 

Let's start by creating a basic configuration that will detect [domain modules](https://github.com/NoesisVision/P3-model/blob/main/Elements.md#domain-module) according to namespace hierarchy.
In order to achieve that, you are going to configure two new volumes in the container: 
- `externalSources` - it is a root directory of all the code repositories you want to scan 
- `externalConfig` - is a path to a new  .NET project where you will specify your scanning rules and architecture conventions, using Noesis DSL

### 4.1: Prepare code for analysis in `git-repos`

Clone the .NET repo for analysis in the `git-repos` directory or make sure that it is already available there. In the tutorial we assume that your repo name is `my-system-repo`

```bash
cd git-repos/my-system-repo
git status
```

Make sure that the project in the repo can be successfully compiled. It should be possible to make `dotnet restore` and `dotnet build` on this project. However you don't need to run these commands right now - just make sure they won't fail as Noesis scanning engine needs to run them independently on a repository copy to perform the successful scan. 

If you are not sure and want to be on the safe side run: 
``` bash
dotnet build
```

### 4.2: Create Configuration Project

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

Now add .NET NuGet packages to the project and test that it compiles

``` bash
dotnet add package NoesisVision.Configuration
dotnet build
```

### 4.3: Add Basic Module Configuration

Open the project in your IDE and create the `ArchitectureConventions.cs` file.

**Remember to change `../my-system-repo` to the actual path to your project.**

```csharp
using NoesisVision.Scanner.Configuration;

namespace NoesisConfig
{
    public static class ArchitectureConventions
    {
        [FullAnalysisConfigAttribute]
        public static FullAnalysisConfig Create() => FullAnalysisConfigBuilder
            .System("My System")  // System name in documentation
            .Repositories(repositories => repositories
                .UseLocal("Main", "my-system-repo"))  // Path to your repository relative to externalSources dir
            .Conventions(conventions => conventions
                .ForDomainModules(convention => convention
                    .UseNamespaceHierarchy()))  // Creates modules from namespaces
            .Build();
    }
}
```

:::info Important Note about Repositories
The **Repositories** node in Noesis DSL refers to **version control repositories** (code repositories, Git repositories), not the Repository design pattern. This section configures where Noesis should look for your source code to analyze.
:::

Play with the DSL if you want. You should be able additional versions of methods e.g. allowing to specify repository branch (which might be useful if your primary branch is not `main`). You may add multiple configuration files - they will be recognized by Noesis as separate systems to scan. 

Check if the project correctly compiles - otherwise Noesis won't be able to work with it.

``` bash
dotnet build
```


### 4.4: Run with Module Configuration
Navigate back to noesis-workspace
```bash
cd noesis-workspace
```

Run the docker command with the 2 new volumes added. 

**Please note that for `externalSources` we use root `git-repos` directory, not the full link to your repo!**

```bash
docker run \
  -v $(pwd)/../git-repos/noesis-config:/externalConfig:ro \
  -v $(pwd)/../git-repos:/externalSources:ro \
  -v ./data:/data \
  -v ./license.jwt:/license.jwt:ro \
  -p 8088:8080 \
  --rm \
  ghcr.io/noesisvision/vision:latest
```

### 4.5: Verify Modules

1. Open `http://localhost:8088`
2. Click "Analyze" and run a scan of your repository - the scanning may take a while - check logs for details and potential errors.
    Correct logs should look similar to this ones: 
    ```
    [10:04:12 INF] Source code setup for system DDD Starter Dotnet started
    [10:04:12 INF] Source code setup for system DDD Starter Dotnet finished in 0.02s.
    [10:04:12 INF] Source code checkout for system DDD Starter Dotnet started
    [10:04:12 INF] Source code checkout for system DDD Starter Dotnet finished in 0.25s.
    [10:04:12 INF] Full analysis started for system DDD Starter Dotnet.
    [10:04:12 INF] Building intermediate model started
    [10:04:52 INF] Loading projects for repository Main started.
    [10:05:08 INF] Loading projects for repository Main finished in 16.64s.
    [10:05:15 INF] Building intermediate model finished in 62.35s.
    [10:05:15 INF] Building P3 model started
    [10:05:15 INF] Building P3 model finished in 0.34s.
    [10:05:15 INF] Inferencing started
    [10:05:15 INF] Inferencing finished in 0.06s.
    [10:05:15 INF] Full analysis for system DDD Starter Dotnet finished in 62.92s.
    ```
    :::warning
    You may see some compilation errors in the logs - DO NOT PANIC - probably these are compilation WARNINGS which are only displayed as errors by Roslyn. Please wait patientily for the final message about success or failure of project loading.
    :::
3. Go back to the main page and click "Basic mode" to view the scan results. Choose your result.
4. Click **Modules** view - you should see modules created from your project's namespaces in the tree on the left, after you expand it. Here's how it may look: 

    ![Modules tree view](/img/modules.png)





🎉 **Second Success!** Noesis recognized your system structure and created domain modules.

## Step 5: Entry Points Configuration

Now we'll add entry points configuration - [domain behaviors](https://github.com/NoesisVision/P3-model/blob/main/Elements.md#domain-behavior) that represent entry points to your system's business logic. These often correspond to REST API endpoints or command handling methods.

:::info
From now on, it might be worth knowing that **the architecture conventions examples presented in the code-snippets below were created according to the architecture of an opensource project [Grandnode2](https://github.com/grandnode/grandnode2)**. This information might help you compare what is the exact application code corresponding to the presented usages of Noesis DSL. In addition you can find a full configuration for this projects in our examples repository on [Github](https://github.com/NoesisVision/noesis-config)
:::

### 5.1: Add Entry Points Configuration

Update `ArchitectureConventions.cs`, adding entry points configuration. The configuration depends on your project patterns, but if you use typical `CommandHandlers` with method `Handle` it may look like that: 

```csharp
using NoesisVision.Scanner.CodeParsing.Configuration;
using NoesisVision.Scanner.Configuration;
using NoesisVision.Tags;

namespace NoesisConfig
{
    public static class Grandnode2Config
    {
        [FullAnalysisConfigAttribute]
        public static FullAnalysisConfig Create() => FullAnalysisConfigBuilder
            .System("My System")  // System name in documentation
            .Repositories(repositories => repositories
                .UseLocal("Main", "my-system-repo"))  // Path to your repository relative to externalSources dir
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
                    $"{method.ContainingType.Name.Replace("CommandHandler", string.Empty)}")  // Create readable behavior name
            )) // Creates modules from namespaces
            .Build();
    }
}
```
For more options on how to configure entry point detection please refer to the [Conventions Documentation](configure.md#entry-points-configuration). You may also check available 

### 5.2: Run with Entry Points Configuration

At the moment, you need to restart container after every configuration change (we are plan to improve it in the near future).

```bash
docker run \
  -v $(pwd)/../git-repos/noesis-config:/externalConfig:ro \
  -v $(pwd)/../git-repos:/externalSources:ro \
  -v ./data:/data \
  -v ./license.jwt:/license.jwt:ro \
  -p 8088:8080 \
  --rm \
  ghcr.io/noesisvision/vision:latest
```

### 5.3: Verify Entry Points

1. Open `http://localhost:8088`
2. Click "Analyze" and run a scan of your repository - the scanning may take a while - check logs for details and potential errors.
3. Go back to the main page and click "Basic mode" to view the scan results. Choose your result.
4. Click **Entry Points** view - you should see entry points organized in modules in the tree on the left, after you expand it.

Here's how it may look: 
 ![Entry points view](/img/entry-points.png)

🎉 **Third Success!** Noesis recognized entry points to your system and shows them in appropriate modules.

## Step 6: Services Configuration

Finally, we'll add services configuration - [domain objects](https://github.com/NoesisVision/P3-model/blob/main/Elements.md#domain-object) that represent business components used by entry points.

### 6.1: Add Services Configuration

Update `ArchitectureConventions.cs`, adding services configuration:

```csharp
using NoesisVision.Scanner.CodeParsing.Configuration;
using NoesisVision.Scanner.Configuration;
using NoesisVision.Tags;

namespace NoesisConfig
{
    public static class Grandnode2Config
    {
         [FullAnalysisConfigAttribute]
        public static FullAnalysisConfig Create() => FullAnalysisConfigBuilder
            .System("My System")  // System name in documentation
            .Repositories(repositories => repositories
                .UseLocal("Main", "my-system-repo"))  // Path to your repository relative to externalSources dir
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
                        $"{method.ContainingType.Name.Replace("CommandHandler", string.Empty)}"))
                // Add Services configuration
                .ForDomainObjects(NoesisTags.Domain.Service, convention => convention
                    .UseTypes()  // Analyze types
                    .WithNameEndingWith("Service")  // Interfaces ending with "Service"
                    .SetName(type => type.Name[1..])))  // Remove "I" prefix
            .Build();
    }
}
```

:::info Important Note about Domain Objects
**Domain Objects** in Noesis DSL can be **any objects from your code** - they are not limited to Domain Driven Design concepts. You can identify and tag various types of objects such as services, entities, repositories, commands, events, queries, controllers, or any other architectural components that are important in your system.

For more information about the generic P3 model and its elements, see the [P3 Model Elements documentation](https://github.com/NoesisVision/P3-model/blob/main/Elements.md).
:::

### 6.2: Run with Full Configuration

Run the container with complete configuration:

```bash
docker run \
  -v $(pwd)/../git-repos/noesis-config:/externalConfig:ro \
  -v $(pwd)/../git-repos:/externalSources:ro \
  -v ./data:/data \
  -v ./license.jwt:/license.jwt:ro \
  -p 8088:8080 \
  --rm \
  ghcr.io/noesisvision/vision:latest
```

### 6.3: Verify Complete Visualization

1. Run the final scan
2. Go to the **Entry Points** section in the newest scan result and click a plus icon of the entry points - you should see services from your system used by this entry point.
3. Add another entry point from the list which potentially shares some services with the first one. You should see what are the common services.

 ![Services view](/img/services.png)

🎉 **Great Success!** You now have completed a first basic visualization of your system!

## What You've Achieved

Congratulations! After completing this tutorial, you can **see**:

✅ **Your system visualization** - domain modules created from namespaces  
✅ **Entry points** - business logic entry points (REST endpoints)  
✅ **Services** - business components used by entry points  
✅ **Relationships** - how entry points use services and how they're connected  

## Next Steps

Now that you have basic visualization, you can:

- **[Configure advanced conventions](/docs/configure)** - customize architectural rules to your needs, add entities, repositories, commands, queries and DDD patterns
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

- Get instant help on our [Discord server](https://discord.gg/QF5PMX4Dqg)
- Check the [full installation guide](/docs/setup)
- Review [configuration documentation](/docs/configure)
- Visit our [GitHub repository with config examples](https://github.com/NoesisVision/noesis-config)

