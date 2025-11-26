You are a coding assistant helping me install and configure **Noesis Vision** in a repository.

## High-level goal

Install and configure Noesis Vision for the target application, using:
- Quick start tutorial:
    - https://noesisvision.github.io/noesis-docs/docs/quick-start
- Configuration conventions:
    - https://noesisvision.github.io/noesis-docs/docs/configure
- Configuration examples:
    - https://github.com/NoesisVision/noesis-config

Your job is to:
1. Make sure a `noesis-config` project is created and builds/compiles correctly.
2. Configure conventions so they are aligned with the scanned repository and its actual code structure.
3. Create a script to start the Noesis server.
4. Create a `README.md` explaining how to run Noesis for this repo.

---

## Repository handling

1. **Clone** the target public repository into a new directory in git-repos. The repository url must be defined by the user doing the setup - if it is not defined - ask for it.
2. After cloning the repo, check its **default branch name** and:
    - Configure the branch name properly in the Noesis conventions, as described in the quick start tutorial.
    - Do not assume the branch is named `main` or `master` – always check.

---

## License handling

1. Check if `license.jwt` already exists in the **root directory** of the workspace or repository.
2. If it exists:
    - Move it to the correct location as described in the quick start tutorial.
3. If it does not exist:
    - Clearly state this in your summary at the end and assume configuration can proceed but Noesis may not fully run until the license is provided.

---

## Conventions & entry points

When configuring conventions and entry points, follow these rules:

1. Entry points:
    - It is **very important** that configured entry points are relatively high in the call stack.
    - Prefer **controller methods** or **command/event handler methods** as entry points.
    - **Do NOT** set lower-level service methods as entry points unless explicitly requested.

2. SkipNamespaceParts:
    - Use `SkipNamespaceParts` **sparingly**, only for technical suffixes such as:
        - `Controllers`, `Plugins`, `Services`, etc.
    - **Do NOT** use `SkipNamespaceParts` for business-related namespace parts such as:
        - `Shipping`, `Search`, etc.
    - **For now do NOT** use `SkipNamespaceParts` for a root part common to all namespaces (e.g. company name).
        - We must always retain a root module even if some modules accidentally lose all namespace parts.

3. Make sure the conventions you configure:
    - Match the actual folder structure, namespaces, and architecture of the scanned repo.
    - Use the public `noesis-config` examples as guidance:
        - https://github.com/NoesisVision/noesis-config

---

## Build & validation

1. Ensure that the `noesis-config` project:
    - Builds/compiles correctly.
    - Is correctly referenced or located relative to the main application according to the quick start tutorial.
    - Uses branch argument in `UseLocal` function in conventions DSL- and the branch name is in line with the default branch of the project

2. If build fails:
    - Fix the configuration, references, project structure or paths.
    - Only finish when the `noesis-config` project compiles successfully or you have a clear explanation of why it cannot.

---

## Script & README

1. Create a script to start the Noesis server:
    - For example `start-noesis.sh` (Linux/macOS) or `start-noesis.ps1` (Windows).
    - The script should:
        - Run any necessary build/restore commands.
        - Start the Noesis server with the correct configuration pointing at this repository.

2. Create or update `README.md` in the root of the workspace with:
    - Prerequisites (e.g. .NET version, Node, Docker – whatever is actually needed).
    - Steps to:
        - Build the app and `noesis-config`.
        - Run the Noesis server using the created script.
    - Short explanation of:
        - Where conventions are configured.
        - Which entry points are set up and why.

---

## Way of working

1. **Always** open and read the quick start and configuration docs before changing files.
2. When you use external docs or examples, adapt them to the actual structure of this repository instead of copy-pasting blindly.
3. Prefer small, incremental changes with explanations in between.
4. At the end, provide a clear summary including:
    - What you did.
    - Where the `noesis-config` project is located.
    - How to run the server step by step.
    - Any manual steps still required (e.g. adding `license.jwt`).