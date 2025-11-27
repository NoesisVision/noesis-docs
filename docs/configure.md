---
sidebar_position: 3
---

# Conventions Configuration

Learn how to use Noesis DSL to set architectural patterns in your code, allowing Noesis to focus on key building blocks in your codebase.

:::info Understanding the P3 Model is Key
Understanding the [P3 model](https://github.com/NoesisVision/P3-model/blob/main/Elements.md) is crucial for effective Noesis configuration. The P3 model defines three key elements that form the foundation of how Noesis analyzes and visualizes your system architecture:
- **[Domain Modules](https://github.com/NoesisVision/P3-model/blob/main/Elements.md#domain-module)** - logical groupings of related functionality
- **[Domain Objects](https://github.com/NoesisVision/P3-model/blob/main/Elements.md#domain-object)** - key building blocks of your domain model
- **[Domain Behaviors](https://github.com/NoesisVision/P3-model/blob/main/Elements.md#domain-behavior)** - operations or entry points in your system
:::

## Noesis DSL Description

Noesis DSL is a fluent API for configuring source code analysis. It consists of three main parts:

1. **System** - defines the name of the analyzed system
2. **Repositories** - configures code sources (local or remote Git repositories)
3. **Conventions** - defines conventions for [domain modules](https://github.com/NoesisVision/P3-model/blob/main/Elements.md#domain-module), [domain objects](https://github.com/NoesisVision/P3-model/blob/main/Elements.md#domain-object), and [domain behaviors](https://github.com/NoesisVision/P3-model/blob/main/Elements.md#domain-behavior)

:::info Important Note about Repositories
The **Repositories** node in Noesis DSL refers to **version control repositories** (code repositories, Git repositories), not the Repository design pattern. This section configures where Noesis should look for your source code to analyze.
:::

## Basic Configuration Examples

### Minimal Configuration

This is the simplest possible configuration that will analyze a codebase and create domain modules from namespace hierarchy.

```csharp
[FullAnalysisConfig]
public static FullAnalysisConfig Create() => FullAnalysisConfigBuilder
    .System("My System")  // Sets the system name for documentation
    .Repositories(repositories => repositories
        .UseLocal("Main", "path/to/repository"))  // Analyzes local repository
    .Conventions(conventions => conventions
        .ForDomainModules(convention => convention
            .UseNamespaceHierarchy()))  // Creates modules from namespace structure
    .Build();
```

**What this configuration does:**
- Analyzes all code in the specified repository
- Creates domain modules based on namespace hierarchy
- Includes all projects and namespaces in the analysis
- Generates basic documentation showing the system structure

### Configuration with Project Exclusions

This configuration demonstrates how to exclude infrastructure and test projects to focus on business domain.

```csharp
[FullAnalysisConfig]
public static FullAnalysisConfig Create() => FullAnalysisConfigBuilder
    .System("System with Exclusions")
    .Repositories(repositories => repositories
        .UseLocal("Main", "path/to/repository", repository => repository
            .ExcludeProjects("TestProject", "Nuke")))  // Exclude build and test projects
    .Conventions(conventions => conventions
        .ForDomainModules(convention => convention
            .UseNamespaceHierarchy()  // Create modules from namespaces
            .NotFromProjects("Infrastructure", "Tests")))  // Exclude infrastructure projects
    .Build();
```

**What this configuration does:**
- Excludes "TestProject" and "Nuke" projects from repository analysis
- Creates domain modules from namespace hierarchy
- Excludes "Infrastructure" and "Tests" projects from domain module creation
- Focuses analysis on business domain code only

**Key differences from minimal configuration:**
- **ExcludeProjects**: Removes specific projects from analysis entirely
- **NotFromProjects**: Excludes projects from domain module creation (but they're still analyzed)
- This creates a cleaner domain model by focusing on business logic

## Entry Points Configuration

Entry Points are a critical component of Noesis DSL configuration. The `NoesisTags.Domain.EntryPoint` tag is specially treated in the implementation and represents the main [domain behaviors](https://github.com/NoesisVision/P3-model/blob/main/Elements.md#domain-behavior) that serve as entry points into your system's business logic. These are typically methods that handle incoming requests, commands, or messages.

### Common Entry Points Patterns

Most systems use one of these common patterns for entry points:

#### Command Handler Pattern
```csharp
.ForDomainBehaviors(NoesisTags.Domain.EntryPoint, convention => convention
    .UseMethods()  // Analyze individual methods
    .FromTypes(types => types
        .OfKind(TypeKind.Class)  // Only classes
        .WithNameEndingWith("CommandHandler"))  // Handler naming convention
    .WithName("Handle")  // Method must be named "Handle"
    .SetName(method =>
        $"{method.ContainingType.Name.Replace("CommandHandler", string.Empty)}"
            .Humanize(LetterCasing.Title)))  // Create readable behavior name
```

**Explanation:**
- **ForDomainBehaviors**: Configures domain behavior identification
- **NoesisTags.Domain.EntryPoint**: Tags these as system entry points
- **UseMethods**: Analyzes individual methods
- **FromTypes**: Filters methods based on containing class
- **WithNameEndingWith**: Ensures containing class ends with "CommandHandler"
- **WithName**: Ensures method is named "Handle"
- **SetName**: Creates readable names by removing "CommandHandler" suffix and formatting

#### Message Handler Pattern
```csharp
.ForDomainBehaviors(NoesisTags.Domain.EntryPoint, convention => convention
    .UseMethods()  // Analyze methods instead of types
    .FromTypes(types => types
        .OfKind(TypeKind.Class)  // Only classes
        .ConvertibleTo("MessageHandler",  // Must inherit from MessageHandler
            "MyCompany.ECommerce.TechnicalStuff.ProcessModel",
            "MyCompany.ECommerce.TechnicalStuff.ProcessModel")
        .WithNameNotEndingWith("Decorator"))  // Exclude decorator classes
    .Matching(method => method.Visibility == Visibility.Public &&  // Public methods only
        method.Name.StartsWith("Handle") &&  // Must start with "Handle"
        method.Parameters.Count() == 1 &&  // Single parameter
        method.Parameters.Single().Name != "message")  // Parameter not named "message"
    .SetName(method => method.Parameters.Single().Type.Name))  // Use parameter type name
```

**Explanation:**
- **ForDomainBehaviors**: Configures how domain behaviors (entry points) are identified
- **NoesisTags.Domain.EntryPoint**: Tags these as system entry points
- **UseMethods**: Analyzes individual methods rather than entire types
- **FromTypes**: Filters methods based on their containing class characteristics
- **ConvertibleTo**: Ensures the containing class inherits from MessageHandler
- **WithNameNotEndingWith**: Excludes decorator pattern implementations
- **Matching**: Complex predicate to identify Handle methods with specific signatures
- **SetName**: Uses the message type name as the behavior name

**Why Entry Points are Special:**
- Entry Points are the primary way users interact with your system
- They represent the public API of your domain
- Noesis uses Entry Points to generate dependency graphs and flow diagrams
- They're essential for understanding system behavior and data flow
- The `NoesisTags.Domain.EntryPoint` tag triggers special analysis and visualization features

## Example 1: Project with Entities and Services (TestRunnerGrandnode2)

This example shows configuration for a project using traditional patterns with entities and services. This configuration demonstrates how to identify various domain objects through naming conventions and inheritance patterns.

### System and Repository Configuration

```csharp
[FullAnalysisConfig]
public static FullAnalysisConfig Create() => FullAnalysisConfigBuilder
    .System("Grand Node 2")  // System name for documentation
    .Repositories(repositories => repositories
        .UseLocal("Main", "grandnode2"))  // Simple local repository configuration
```

**Explanation:**
- **System**: Sets the system name for generated documentation
- **UseLocal**: Configures the local repository without additional exclusions

### Domain Modules Configuration

```csharp
.ForDomainModules(convention => convention
    .UseNamespaceHierarchy()  // Create modules from namespace structure
    .NotFromProjects(  // Exclude infrastructure projects
        "Grand.Infrastructure",
        "Grand.SharedKernel",
        "Grand.Module.Installer",
        "Grand.Module.Migration",
        "Grand.SharedUIResources",
        "Grand.Web.Common",
        "Aspire.AppHost",
        "Aspire.ServiceDefaults")
    .WithPathMatching(new Regex(@"^((?!\.Tests).)*$"))  // Exclude test projects
    .SkipNamespaceParts(  // Remove common technical prefixes
        "Grand", "Business", "Commands", "Events", "Dto", "Enums",
        "Services", "Startup", "Utilities", "Queries", "Validators",
        "Extensions", "Handler", "Handlers", "Attributes", "Components",
        "Controllers", "Endpoints", "Infrastructure", "Domain", "Core",
        "Interfaces", "BackgroundServices", "Models", "Cache", "Features",
        "Roslyn", "Views", "Areas", "App_Data", "Mapper", "Module",
        "Api", "ScheduledTasks"))
```

**Explanation:**
- **UseNamespaceHierarchy**: Creates domain modules from namespace structure
- **NotFromProjects**: Excludes many infrastructure and framework projects
- **WithPathMatching**: Uses regex to exclude test projects (containing ".Tests")
- **SkipNamespaceParts**: Removes extensive list of technical namespace parts to focus on business domain

### Services Configuration

```csharp
.ForDomainObjects(NoesisTags.Domain.Service, convention => convention
    .UseTypes()  // Analyze types
    .OfKind(TypeKind.Interface)  // Only interfaces
    .WithNameEndingWith("Service")  // Must end with "Service"
    .SetName(type => type.Name[1..]))  // Remove "I" prefix from interface names
```

**Explanation:**
- **ForDomainObjects**: Configures domain object identification
- **NoesisTags.Domain.Service**: Tags these as domain services
- **OfKind(TypeKind.Interface)**: Only considers interfaces
- **WithNameEndingWith**: Identifies interfaces ending with "Service"
- **SetName**: Removes the "I" prefix from interface names (e.g., "IUserService" → "UserService")

### Repositories Configuration

```csharp
.ForDomainObjects(NoesisTags.Domain.Repository, convention => convention
    .UseTypes()
    .Matching(type => type.IsGenericConstructedType &&  // Must be generic
        type.TypeDefinition.Is("IRepository&lt;T&gt;", "Grand.Data", "Grand.Data") &&  // Inherit from IRepository&lt;T&gt;
        type.GenericArguments.Count == 1 &&  // Single generic argument
        type.GenericArguments.First().Value is TypeConventionSubject)  // Argument must be a type
    .SetName(type =>
    {
        var argumentType = type.GenericArguments!.First().Value;
        return $"{argumentType.Name}Repository".Humanize(LetterCasing.Title);  // Create readable name
    }))
```

**Explanation:**
- **Matching**: Complex predicate to identify generic repository interfaces
- **IsGenericConstructedType**: Ensures the type is a constructed generic type
- **TypeDefinition.Is**: Checks if the type inherits from IRepository&lt;T&gt;
- **GenericArguments.Count == 1**: Ensures single generic parameter
- **SetName**: Creates readable names like "UserRepository" from "IRepository&lt;User&gt;"

### Entities Configuration

```csharp
.ForDomainObjects(NoesisTags.Domain.Entity, convention => convention
    .UseTypes()
    .ConvertibleTo("BaseEntity", "Grand.Domain", "Grand.Domain"))  // Must inherit from BaseEntity
```

**Explanation:**
- **ConvertibleTo**: Identifies types that inherit from BaseEntity
- **NoesisTags.Domain.Entity**: Tags these as domain entities

### Commands Configuration

```csharp
.ForDomainObjects(NoesisTags.Domain.Command, convention => convention
    .UseTypes()
    .WithNameEndingWith("Command"))  // Simple naming convention
```

**Explanation:**
- **WithNameEndingWith**: Identifies classes ending with "Command"
- **NoesisTags.Domain.Command**: Tags these as domain commands

### Events Configuration

```csharp
.ForDomainObjects(NoesisTags.Domain.Event, convention => convention
    .UseTypes()
    .WithNameEndingWith("Event"))  // Simple naming convention
```

**Explanation:**
- **WithNameEndingWith**: Identifies classes ending with "Event"
- **NoesisTags.Domain.Event**: Tags these as domain events

### Queries Configuration

```csharp
.ForDomainObjects(NoesisTags.Domain.Query, convention => convention
    .UseTypes()
    .WithNameEndingWith("Query"))  // Simple naming convention
```

**Explanation:**
- **WithNameEndingWith**: Identifies classes ending with "Query"
- **NoesisTags.Domain.Query**: Tags these as domain queries

### Entry Points Configuration (Command Handlers)

```csharp
.ForDomainBehaviors(NoesisTags.Domain.EntryPoint, convention => convention
    .UseMethods()  // Analyze methods
    .FromTypes(types => types
        .OfKind(TypeKind.Class)  // Only classes
        .WithNameEndingWith("CommandHandler"))  // Must end with "CommandHandler"
    .WithName("Handle")  // Method must be named "Handle"
    .SetName(method =>
        $"{method.ContainingType.Name.Replace("CommandHandler", string.Empty)}"
            .Humanize(LetterCasing.Title)))  // Create readable behavior name
```

**Explanation:** Explained in the [Entry Points section](#entry-points-configuration) above.

### Key elements of this configuration:
- Excludes extensive list of infrastructure projects to focus on business domain
- Uses comprehensive namespace part skipping to create clean module names
- Identifies different domain object types through simple naming conventions
- Uses inheritance patterns for entities and repositories
- Identifies entry points through Command Handler pattern

## Example 2: DDD Project (TestRunner)

This example shows configuration for a project using Domain-Driven Design patterns. The configuration focuses on identifying domain modules, value objects, and message handlers while excluding infrastructure concerns.

### System and Repository Configuration

```csharp
[FullAnalysisConfig]
public static FullAnalysisConfig Create() => FullAnalysisConfigBuilder
    .System("My Company eCommerce")  // Defines the system name for analysis
    .Repositories(repositories => repositories
        .UseLocal("Main", "DDD-starter-dotnet", "master",  // Local Git repository
            repository => repository
                .ExcludeProjects("Nuke", "Nuke.DockerCompose")))  // Exclude build tools
```

**Explanation:**
- **System**: Sets the overall system name that will appear in generated documentation
- **UseLocal**: Configures a local Git repository with the specified path and branch
- **ExcludeProjects**: Removes build and deployment projects from analysis to focus on business logic

### Domain Modules Configuration

```csharp
.ForDomainModules(convention => convention
    .UseNamespaceHierarchy()  // Use namespace structure to identify modules
    .NotFromProjects(  // Exclude infrastructure projects
        "Monolith.Startup",
        "Search.Startup", 
        "Sales.FluentMigrations")
    .WithPathMatching(new Regex("^(?!.*TechnicalStuff|Database).*$"))  // Exclude technical namespaces
    .SkipNamespaceParts("MyCompany.ECommerce", "OldApi", "RestApi", "EF"))  // Skip common prefixes
```

**Explanation:**
- **UseNamespaceHierarchy**: Creates domain modules based on namespace structure
- **NotFromProjects**: Excludes startup, migration, and infrastructure projects
- **WithPathMatching**: Uses regex to exclude namespaces containing "TechnicalStuff" or "Database"
- **SkipNamespaceParts**: Removes common prefixes to create cleaner module names

### Value Objects Configuration

```csharp
.ForDomainObjects(NoesisTags.Domain.DDD.DddValueObject,
    convention => convention
        .UseTypes()  // Analyze types (classes, interfaces, etc.)
        .ConvertibleTo("ValueObject",  // Must inherit from ValueObject base class
            "MyCompany.ECommerce.TechnicalStuff.ValueObjects",  // Namespace
            "MyCompany.ECommerce.TechnicalStuff")  // Assembly
        .SetName(type => type.Name))  // Use the type name as the object name
```

**Explanation:**
- **ForDomainObjects**: Configures how domain objects are identified
- **NoesisTags.Domain.DDD.DddValueObject**: Tags these objects as DDD Value Objects
- **ConvertibleTo**: Identifies types that inherit from the ValueObject base class
- **SetName**: Uses the actual type name for the domain object name

### Entry Points Configuration (Message Handlers)

```csharp
.ForDomainBehaviors(NoesisTags.Domain.EntryPoint, convention => convention
    .UseMethods()  // Analyze methods instead of types
    .FromTypes(types => types  // Filter by containing type
        .OfKind(TypeKind.Class)  // Only classes
        .ConvertibleTo("MessageHandler",  // Must inherit from MessageHandler
            "MyCompany.ECommerce.TechnicalStuff.ProcessModel",
            "MyCompany.ECommerce.TechnicalStuff.ProcessModel")
        .WithNameNotEndingWith("Decorator"))  // Exclude decorator classes
    .Matching(method => method.Visibility == Visibility.Public &&  // Public methods only
        method.Name.StartsWith("Handle") &&  // Must start with "Handle"
        method.Parameters.Count() == 1 &&  // Single parameter
        method.Parameters.Single().Name != "message")  // Parameter not named "message"
    .SetName(method => method.Parameters.Single().Type.Name))  // Use parameter type name
```

**Explanation:** Explained in the [Entry Points section](#entry-points-configuration) above.

**Key elements of this configuration:**
- Excludes infrastructure and test projects to focus on domain logic
- Uses namespace hierarchy to automatically identify domain modules
- Identifies Value Objects through inheritance from a base class
- Identifies Entry Points as Handle methods in Message Handlers with specific patterns

## DSL Methods Documentation

### RepositoriesBuilder

The RepositoriesBuilder configures the source code repositories to analyze. You can configure both local and remote Git repositories.

#### UseLocal
Configures a local Git repository for analysis:

```csharp
.UseLocal("Name", "path/to/repository")  // Basic local repository
.UseLocal("Name", "path/to/repository", "branch")  // Specify branch
.UseLocal("Name", "path/to/repository", "branch", repository => repository
    .ExcludeProjects("Project1", "Project2")  // Exclude specific projects
    .ExcludeProjectsMatching(new Regex(".*Test.*")))  // Exclude projects matching pattern
```

**Parameters:**
- **Name**: Identifier for the repository in documentation
- **path/to/repository**: Relative or absolute path to the Git repository
- **branch**: Git branch to analyze (defaults to "main")
- **configure**: Optional lambda to configure repository-specific settings

**Repository Configuration Methods:**
- **ExcludeProjects**: Excludes specific project names from analysis
- **ExcludeProjectsMatching**: Excludes projects matching a regex pattern
- **IncludeOnlyProjectsFromSolutions**: Limits analysis to projects from specific solution files

#### UseRemote
Configures a remote Git repository for analysis:

```csharp
// GitHub repository
.UseRemote("Name", GitRepositoryProvider.GitHub,
    new Uri("https://github.com/org/repo.git"))

// GitHub with branch and configuration
.UseRemote("Name", GitRepositoryProvider.GitHub,
    new Uri("https://github.com/org/repo.git"), "develop", repository => repository
        .ExcludeProjects("Tests", "Build")
        .IncludeOnlyProjectsFromSolutions("Main.sln"))

// GitLab Cloud
.UseRemote("Name", GitRepositoryProvider.GitLabCloud,
    new Uri("https://gitlab.com/org/repo.git"))

// Azure DevOps
.UseRemote("Name", GitRepositoryProvider.AzureDevOps,
    new Uri("https://dev.azure.com/org/project/_git/repo"))
```

**Parameters:**
- **Name**: Identifier for the repository in documentation
- **GitRepositoryProvider**: The Git hosting platform (GitHub, GitLabCloud, GitLabOnPrem, AzureDevOps, Other)
- **Uri**: Full URL to the Git repository (must end with .git)
- **branch**: Git branch to analyze (defaults to "main")
- **configure**: Optional lambda to configure repository-specific settings

**Available Providers:**
- `GitRepositoryProvider.GitHub` - GitHub repositories
- `GitRepositoryProvider.GitLabCloud` - GitLab.com repositories
- `GitRepositoryProvider.GitLabOnPrem` - Self-hosted GitLab instances
- `GitRepositoryProvider.AzureDevOps` - Azure DevOps repositories
- `GitRepositoryProvider.Other` - Other Git hosting platforms

**Authentication:** See [Authentication for Remote Repositories](#authentication-for-remote-repositories) section below for security setup.

#### Authentication for Remote Repositories

When using remote repositories, you need to provide authentication credentials via environment variables.

:::danger SECURITY RECOMMENDATION
**Always use Fine-Grained Personal Access Tokens with minimal permissions!**

We **strongly recommend** configuring your Personal Access Token to:
- ✅ Grant access **only to specific repositories** you want to analyze (not all repositories)
- ✅ Use **read-only permissions** (repository contents: read-only)
- ✅ Set **expiration dates** and rotate tokens regularly
- ✅ Use **service accounts** or dedicated bot accounts for production deployments
- ✅ **Never commit** tokens to source code or configuration files in version control

**For GitHub:**
- Use [Fine-grained Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)
- Select only specific repositories in "Repository access"
- Grant only "Contents: Read-only" permission

**For GitLab:**
- Create tokens with `read_repository` scope only
- If you scan only one repository use [Project Access Tokens](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html) for specific projects
- Consider using bot/service accounts with limited access to selected repos

**For Azure DevOps:**
- Create [Personal Access Tokens](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate) with "Code: Read" scope only
- Limit token to specific organizations/projects
- Use dedicated service/bot accounts with PAT for production
:::

**Environment Variables Configuration:**

Set the following environment variables:

```bash
# Required: Personal Access Token
export NOESIS_Git__PAT="your_token_here"

# Optional: Username (defaults to "pat" if not provided)
export NOESIS_Git__Username="your-username"
```

**How it works:**
- Noesis clones the remote repository to a temporary directory
- Authentication happens automatically using the provided PAT
- The PAT is used as the password in Git credentials
- Repository is analyzed from the cloned copy

### AnalyzersBuilder

The AnalyzersBuilder configures how Noesis identifies and categorizes different elements in your codebase. It has three main configuration areas: domain modules, domain objects, and domain behaviors.

#### ForDomainModules
Configures how [domain modules](https://github.com/NoesisVision/P3-model/blob/main/Elements.md#domain-module) are identified and created:

```csharp
.ForDomainModules(convention => convention
    .UseNamespaceHierarchy()  // Create modules from namespace structure
    .NotFromProjects("Infrastructure", "Tests")  // Exclude infrastructure projects
    .WithPathMatching(new Regex("^Domain.*"))  // Only include domain namespaces
    .SkipNamespaceParts("Company", "Infrastructure"))  // Remove common prefixes
```

**Purpose:** [Domain modules](https://github.com/NoesisVision/P3-model/blob/main/Elements.md#domain-module) represent logical groupings of related functionality in your system. They're typically created from namespace hierarchy but can be filtered and customized.

**Configuration Methods:**
- **UseNamespaceHierarchy**: Creates modules based on namespace structure
- **NotFromProjects**: Excludes specific projects from module creation
- **WithPathMatching**: Uses regex to filter namespaces
- **SkipNamespaceParts**: Removes common namespace prefixes for cleaner names

#### ForDomainObjects
Configures how domain objects (entities, services, repositories, etc.) are identified:

```csharp
// Without tag - creates unnamed domain objects
.ForDomainObjects(convention => convention
    .UseTypes()  // Analyze types
    .OfKind(TypeKind.Class)  // Only classes
    .WithNameEndingWith("Service"))  // Naming convention

// With tag - creates tagged domain objects
.ForDomainObjects(NoesisTags.Domain.Service, convention => convention
    .UseTypes()
    .OfKind(TypeKind.Interface)  // Only interfaces
    .WithNameEndingWith("Service"))
```

**Purpose:** Domain objects represent the key building blocks of your domain model. They can be tagged for categorization and filtering in the generated documentation.

:::info Important Note about Domain Objects
**Domain Objects** in Noesis DSL can be **any objects from your code** - they are not limited to Domain Driven Design concepts. You can identify and tag various types of objects such as services, entities, repositories, commands, events, queries, controllers, or any other architectural components that are important in your system.

For more information about the generic P3 model and its elements, see the [P3 Model Elements documentation](https://github.com/NoesisVision/P3-model/blob/main/Elements.md).
:::

**Configuration Methods:**
- **UseTypes**: Analyzes types (classes, interfaces, etc.)
- **OfKind**: Filters by type kind (Class, Interface, Enum, etc.)
- **WithNameEndingWith**: Filters by naming convention
- **ConvertibleTo**: Filters by inheritance
- **SetName**: Customizes the object name in documentation

#### ForDomainBehaviors
Configures how [domain behaviors](https://github.com/NoesisVision/P3-model/blob/main/Elements.md#domain-behavior) (entry points, operations, etc.) are identified:

```csharp
.ForDomainBehaviors(NoesisTags.Domain.EntryPoint, convention => convention
    .UseMethods()  // Analyze individual methods
    .FromTypes(types => types  // Filter by containing type
        .OfKind(TypeKind.Class)  // Only classes
        .WithNameEndingWith("Handler"))  // Handler pattern
    .WithName("Handle"))  // Method name pattern
```

**Purpose:** [Domain behaviors](https://github.com/NoesisVision/P3-model/blob/main/Elements.md#domain-behavior) represent operations or entry points in your system. They're typically identified by analyzing methods rather than entire types.

**Configuration Methods:**
- **UseMethods**: Analyzes individual methods
- **FromTypes**: Filters methods based on containing type characteristics
- **WithName**: Filters by method name
- **Matching**: Custom predicate for complex filtering
- **SetName**: Customizes the behavior name in documentation

### TypeConventionBuilder

The TypeConventionBuilder provides methods to filter and identify types based on various criteria. It's used within ForDomainObjects configurations to specify which types should be considered as domain objects.

#### Filtering by Project
Filter types based on which project they belong to:

```csharp
.FromProject("MyProject")  // Only types from specific project
.FromProjects("Project1", "Project2")  // Types from multiple projects
.NotFromProjects("TestProject", "Infrastructure")  // Exclude specific projects
```

**Use cases:**
- Focus on business domain projects
- Exclude test and infrastructure projects
- Include only specific modules

#### Filtering by Namespace
Filter types based on their namespace:

```csharp
.FromNamespace("Company.Domain")  // Specific namespace
.FromNamespaces("Company.Domain", "Company.Application")  // Multiple namespaces
.NotFromNamespaces("Company.Infrastructure")  // Exclude namespaces
```

**Use cases:**
- Focus on domain-specific namespaces
- Exclude technical namespaces
- Include multiple related namespaces

#### Filtering by Inheritance
Filter types based on inheritance relationships:

```csharp
.ConvertibleTo&lt;IEntity&gt;()  // Types implementing interface
.ConvertibleTo("BaseEntity", "Company.Domain", "Company.Domain")  // Inheriting from specific class
.NotConvertibleTo&lt;IInfrastructure&gt;()  // Exclude types implementing interface
```

**Use cases:**
- Identify entities inheriting from base classes
- Find services implementing specific interfaces
- Exclude infrastructure implementations

#### Filtering by Name
Filter types based on naming patterns:

```csharp
.WithNameMatching(new Regex(".*Service$"))  // Regex pattern matching
.WithNameStartingWith("I")  // Interface naming convention
.WithNameEndingWith("Service")  // Service naming convention
.WithNameNotEndingWith("Test")  // Exclude test classes
```

**Use cases:**
- Identify services by naming convention
- Find interfaces (starting with "I")
- Exclude test classes
- Use complex naming patterns with regex

#### Filtering by Attributes
Filter types based on applied attributes:

```csharp
.AnnotatedWith&lt;ServiceAttribute&gt;()  // Types with specific attribute
.NotAnnotatedWith&lt;ObsoleteAttribute&gt;()  // Exclude obsolete types
```

**Use cases:**
- Identify types marked with specific attributes
- Exclude deprecated or obsolete types
- Use custom attributes for domain object identification

#### Filtering by Type Kind
Filter types based on their kind:

```csharp
.OfKind(TypeKind.Class)  // Only classes
.OfKind(TypeKind.Interface)  // Only interfaces
.OfKind(TypeKind.Enum)  // Only enums
```

**Available Type Kinds:**
- `TypeKind.Class` - Classes
- `TypeKind.Interface` - Interfaces
- `TypeKind.Enum` - Enumerations
- `TypeKind.Struct` - Structures
- `TypeKind.RecordClass` - Record classes
- `TypeKind.RecordStruct` - Record structures
- `TypeKind.Delegate` - Delegates

### MethodConventionBuilder

The MethodConventionBuilder provides methods to filter and identify methods based on various criteria. It's used within ForDomainBehaviors configurations to specify which methods should be considered as domain behaviors.

#### Filtering by Containing Type
Filter methods based on the type that contains them:

```csharp
.FromTypes(types => types  // Filter by containing type
    .OfKind(TypeKind.Class)  // Only classes
    .WithNameEndingWith("Handler"))  // Handler pattern
```

**Use cases:**
- Identify methods in handler classes
- Focus on methods in service classes
- Exclude methods from infrastructure types

#### Filtering by Method Name
Filter methods based on their names:

```csharp
.WithName("Handle")  // Exact method name
.WithNameMatching(new Regex("^Handle.*"))  // Regex pattern
.WithNameStartingWith("Process")  // Methods starting with "Process"
.WithNameEndingWith("Command")  // Methods ending with "Command"
```

**Use cases:**
- Identify handler methods (Handle pattern)
- Find command processing methods
- Use complex naming patterns with regex
- Exclude specific method names

#### Filtering by Attributes
Filter methods based on applied attributes:

```csharp
.AnnotatedWith&lt;HttpPostAttribute&gt;()  // Methods with HTTP attributes
.NotAnnotatedWith&lt;ObsoleteAttribute&gt;()  // Exclude obsolete methods
```

**Use cases:**
- Identify web API endpoints
- Find methods marked with specific attributes
- Exclude deprecated methods
- Use custom attributes for behavior identification

### NamespaceConventionBuilder

The NamespaceConventionBuilder provides methods to filter and configure namespaces for domain module creation. It's used within ForDomainModules configurations.

#### Filtering by Project
Filter namespaces based on which project they belong to:

```csharp
.FromProject("MyProject")  // Only namespaces from specific project
.FromProjects("Project1", "Project2")  // Multiple projects
.NotFromProjects("TestProject")  // Exclude test projects
```

**Use cases:**
- Focus on business domain projects
- Exclude test and infrastructure projects
- Include only specific modules

#### Filtering by Path
Filter namespaces based on their path patterns:

```csharp
.WithPathMatching(new Regex("^Company\\.Domain"))  // Regex pattern matching
.WithPathStartingWith("Company.Domain")  // Namespaces starting with prefix
.WithPathEndingWith(".Services")  // Namespaces ending with suffix
```

**Use cases:**
- Focus on domain-specific namespaces
- Exclude technical namespaces
- Include multiple related namespaces
- Use complex patterns with regex

#### Skipping Namespace Parts
Remove common namespace parts to create cleaner module names:

```csharp
.SkipNamespaceParts("Company", "Infrastructure", "TechnicalStuff")
```

**Use cases:**
- Remove company prefixes
- Skip technical namespace parts
- Create cleaner module names
- Focus on business domain structure

**Example:**
- Original namespace: `Company.MyApp.Infrastructure.Data.Repositories`
- After skipping "Company", "Infrastructure": `MyApp.Data.Repositories`

### Available Tags

Please note that you are free to use any tag names you want and you are not limited to the ones listed below. They are only a set of commonly used ones. 

However please pay attention to one special tag `NoesisTags.Domain.EntryPoint` which is used by application logic to display the application entry points. In the future we may have more tags with such a special treatment, please stay tuned.

#### Basic Domain Tags
- `NoesisTags.Domain.Entity` - entities
- `NoesisTags.Domain.Service` - services
- `NoesisTags.Domain.Repository` - repositories
- `NoesisTags.Domain.Command` - commands
- `NoesisTags.Domain.Event` - events
- `NoesisTags.Domain.Query` - queries
- `NoesisTags.Domain.EntryPoint` - entry points

#### DDD Tags
- `NoesisTags.Domain.DDD.DddAggregate` - aggregates
- `NoesisTags.Domain.DDD.DddEntity` - domain entities
- `NoesisTags.Domain.DDD.DddValueObject` - value objects
- `NoesisTags.Domain.DDD.DddRepository` - domain repositories
- `NoesisTags.Domain.DDD.DddDomainService` - domain services
- `NoesisTags.Domain.DDD.DddFactory` - factories
- `NoesisTags.Domain.DDD.DddApplicationService` - application services

## Next Steps

Once you've configured Noesis, proceed to [Explore](/docs/explore) to learn how to use the UI and generate documentation.
