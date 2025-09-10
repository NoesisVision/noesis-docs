---
sidebar_position: 2
---

# Running Noesis Vision

## Introduction

At the core of Noesis Vision is an advanced source code analysis system that scans your codebase according to provided [architecture conventions](configure.md) and creates a knowledge map (graph) called the [P3 model](https://github.com/P3-model/P3-model/blob/main/Elements.md). The system provides: 

- **Noesis UI** for visual browsing of analysis results in the form of lists and diagrams
- **Export functionality** to generate markdown documentation files for independent distribution (more export formats coming soon)

Additionally, Noesis Vision offers optional LLM integration for generating descriptions of [P3 model elements](https://github.com/P3-model/P3-model/blob/main/Elements.md) using various language model providers. These descriptions become a vital part of the exported documentation and can also be viewed within the Noesis UI to improve understanding of diagram elements.

:::info Important
Noesis Vision operates exclusively as a containerized application. There is no standalone installation or native deployment option available at the moment.
:::

## Required Configuration

### Running Noesis Vision (without LLM integration)

To run Noesis Vision without LLM integration, use the following Docker command:

```bash
docker run \
  -v /path/to/config:/externalConfig:ro \
  -v /path/to/sources:/externalSources:ro \
  -v /path/to/data:/data \
  -v /path/to/license.jwt:/license.jwt:ro \
  -p 3000:8080 \
  --rm \
  ghcr.io/noesisvision/vision:latest
```

This configuration launches the newest version of Noesis Vision. If it is successful, you should be able to access the UI at `http://localhost:3000` (or any other port you configured) where you can:
- Launch scanning of your codebase from `/externalSources` according to the [architecture conventions](configure.md) defined in `/externalConfig`
- Browse scanning results (which are stored permanently in `data` directory)
- Run export functionality to obtain the scanning results and use them elsewhere.

### Required Volumes

You must mount the following volumes:

| Volume | Type | Description | Example (from command above) |
|--------|------|-------------|------------------------------|
| `/externalSources` | Read-only | Path to git repository with sources of the system to analyze. **Currently we support only .NET 5+ repositories** | `-v` `/path/to/sources:/externalSources:ro` |
| `/externalConfig` | Read-only | Path to .NET project with parsing configuration in [Noesis DSL](configure.md). This configuration should include architecture conventions of the analyzed system. | `-v` `/path/to/config:/externalConfig:ro` |
| `/data` | **Read-write** | Volume for Noesis Vision managed data (cache, analysis results). *In case of problems with absolute path use relative path* | `-v /path/to/data:/data` |
| `/license.jwt` | Read-only | JWT license file | `-v` `/path/to/license.jwt:/license.jwt:ro` |

### Application Configuration

| Variable | Required | Default Value | Description | Example (from command above) |
|----------|----------|---------------|-------------|------------------------------|
| `NOESIS_LogLevel` | No | `Information` | Logging level: `Debug`, `Information`, `Warning`, `Error` | Not shown (uses default) |

### Port Configuration

| Parameter | Required | Description | Example (from command above) |
|-----------|----------|-------------|------------------------------|
| Container Port mapping | Yes | Maps host port to container port (format: `-p` `HOST_PORT:8080`) | `-p 3000:8080` |

**Port mapping**: The `-p 3000:8080` parameter maps port `3000` on your host machine to port `8080` inside the container. You can access the Noesis UI at `http://localhost:3000`. You can change the host port (3000) to any available port on your system.

## Optional LLM Integration

Noesis Vision can optionally integrate with various LLMs (Large Language Models) to generate descriptions of the mapped elements.

### Supported APIs and Models

#### AWS Bedrock
- **Claude 3.5 Haiku** (`us.anthropic.claude-3-5-haiku-20241022-v1:0`) - Fast model for basic tasks
- **Llama 3 8B** (`us.meta.llama3-1-8b-instruct-v1:0`) - Compact Meta model
- **Llama 3 70B** (`us.meta.llama3-3-70b-instruct-v1:0`) - Advanced Meta model
- **Mistral Small** (`mistral.mistral-small-2402-v1:0`) - Mistral AI model

#### Fireworks AI
- **Qwen3 Coder 30B** (`accounts/fireworks/models/qwen3-coder-30b-a3b-instruct`) - Specialized coding model

#### Hugging Face
- **Phi-4 Mini** - Compact Microsoft model (requires custom URL)
- **Qwen Coder 7B** - Coding model (requires custom URL)

### LLM Configuration

To enable LLM integration, you need to configure the appropriate environment variables for your chosen AI provider and model.

| Variable | Required | Description |
|----------|----------|-------------|
| `NOESIS_LLM` | Yes | Model identifier (see "Available Models" in each provider section below) |

#### AWS Bedrock Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `NOESIS_AWS__AccessKey` | Yes | AWS IAM access key with Bedrock permissions |
| `NOESIS_AWS__SecretKey` | Yes | AWS IAM secret key |

**Recommended Models (for `NOESIS_LLM`):**
- `AmazonClaude35Haiku` - Claude 3.5 Haiku (fast, economical)
- `AmazonLlama8B` - Llama 3 8B (compact, fast)
- `AmazonLlama70B` - Llama 3 70B (advanced, slower)
- `AmazonMistralSmall` - Mistral Small (high quality)

**Notes:**
- AWS Region: `us-east-1` (hardcoded)
- Required permissions: `bedrock:InvokeModel` for selected model
- Claude 3.5 Haiku model is the default supported model in documentation

**Example Docker command:**
```bash
docker run \
  -v /path/to/config:/externalConfig:ro \
  -v /path/to/sources:/externalSources:ro \
  -v /path/to/data:/data \
  -v /path/to/license.jwt:/license.jwt:ro \
  -e NOESIS_LLM=AmazonClaude35Haiku \
  -e NOESIS_AWS__AccessKey=AKIA... \
  -e NOESIS_AWS__SecretKey=... \
  -p 3000:8080 \
  --rm \
  ghcr.io/noesisvision/vision:latest
```

#### Fireworks AI Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `NOESIS_Fireworks__ApiKey` | Yes | Fireworks API key (format: `fw-...`) |
| `NOESIS_Fireworks__Url` | Yes | Fireworks endpoint URL (e.g., `https://api.fireworks.ai/inference/v1`) |

**Recommended Models (for `NOESIS_LLM`):**
- `FireworksQwen3Coder30B` - Qwen3 Coder 30B (specialized for coding)

**Notes:**
- Fireworks uses OpenAI-compatible API
- Model is optimized for programming tasks

**Example Docker command:**
```bash
docker run \
  -v /path/to/config:/externalConfig:ro \
  -v /path/to/sources:/externalSources:ro \
  -v /path/to/data:/data \
  -v /path/to/license.jwt:/license.jwt:ro \
  -e NOESIS_LLM=FireworksQwen3Coder30B \
  -e NOESIS_Fireworks__ApiKey=fw-... \
  -e NOESIS_Fireworks__Url=https://api.fireworks.ai/inference/v1 \
  -p 3000:8080 \
  --rm \
  ghcr.io/noesisvision/vision:latest
```

#### Hugging Face Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `NOESIS_HuggingFace__ApiKey` | Yes | Hugging Face API key (format: `hf_...`) |
| `NOESIS_HuggingFace__Phi4MiniUrl` | Yes* | URL for Phi-4 Mini model (e.g., `https://api-inference.huggingface.co/models/microsoft/Phi-4-mini-instruct`) |
| `NOESIS_HuggingFace__QwenCoder7BUrl` | Yes* | URL for Qwen Coder 7B model |

*Required only for corresponding models

**Recommended Models (for `NOESIS_LLM`):**
- `HuggingFacePhi4Mini` - Phi-4 Mini (compact Microsoft model)
- `HuggingFaceQwenCoder7B` - Qwen Coder 7B (coding model)

**Notes:**
- Requires custom endpoint URL (can be Inference API or custom deployment)
- Model must be available through Hugging Face API

**Example Docker command:**
```bash
docker run \
  -v /path/to/config:/externalConfig:ro \
  -v /path/to/sources:/externalSources:ro \
  -v /path/to/data:/data \
  -v /path/to/license.jwt:/license.jwt:ro \
  -e NOESIS_LLM=HuggingFacePhi4Mini \
  -e NOESIS_HuggingFace__ApiKey=hf_... \
  -e NOESIS_HuggingFace__Phi4MiniUrl=https://api-inference.huggingface.co/models/microsoft/Phi-4-mini-instruct \
  -p 3000:8080 \
  --rm \
  ghcr.io/noesisvision/vision:latest
```

## Notes and Best Practices

### SELinux
If using SELinux, add `:Z` modifiers to volumes:
```bash
-v /path/to/config:/externalConfig:ro,Z
-v /path/to/sources:/externalSources:ro,Z
-v /path/to/data:/data:Z
```

### Troubleshooting
1. **Missing License**: Check if the `/license.jwt` file is properly mounted.
2. **AI Error**: Check API keys and model permissions (only if using AI integration).
3. **Missing Configuration**: Ensure `/externalConfig` contains proper .NET configuration.

## Next Steps

After setting up Noesis, proceed to [Configure](/docs/configure) to learn how to define architectural patterns for your codebase.