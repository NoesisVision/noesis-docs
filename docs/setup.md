---
sidebar_position: 1
---

# Container Set-up

## Introduction

Noesis Vision is an advanced source code analysis system that scans your codebase according to provided conventions and creates a knowledge map (graph) called the P3 model. The system provides: 

- **Noesis UI** for visual browsing of analysis results in the form of lists and diagrams
- **Export functionality** to generate markdown documentation files for independent distribution (more export formats coming soon)

Additionally, Noesis Vision offers optional AI integration for generating descriptions of P3 model elements using various language model providers. These descriptions become a vital part of the exported documentation and can also be viewed within the Noesis UI to improve understanding of diagram elements.

:::info Important
Noesis Vision operates exclusively as a containerized application using Docker. There is no standalone installation or native deployment option available at the moment.
:::

## Core Functionality

Noesis Vision's primary purpose is to analyze source code and create a comprehensive knowledge map that represents the relationships and dependencies within your codebase. This analysis is performed according to configurable conventions and rules, allowing you to understand the architecture and structure of your software system.

### Key Features
- **Code Scanning**: Analyzes source code according to predefined conventions
- **P3 Model Generation**: Creates a knowledge graph representing code relationships
- **Web UI**: Provides an intuitive interface for browsing analysis results
- **Convention-Based Analysis**: Uses configurable rules to identify patterns and relationships

### Required Configuration

To run Noesis Vision for core functionality (without AI), you need to configure the following essential parameters:

#### License Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `NOESIS_NoesisLicenseFilePath` | Yes | Path to JWT license file |

**Notes:**
- License file must be in JWT format
- In container, file must be mounted at `/license.jwt`
- License is verified at application startup

#### Feature Configuration

| Variable | Required | Default Value | Description |
|----------|----------|---------------|-------------|
| `NOESIS_FeatureManagement__AdvancedMode` | No | `false` | Enables experimental features |
| `NOESIS_FeatureManagement__FileUpload` | No | `false` | Enables file upload functionality |

#### Logging Configuration

| Variable | Required | Default Value | Description |
|----------|----------|---------------|-------------|
| `NOESIS_LogLevel` | No | `Information` | Logging level: `Debug`, `Information`, `Warning`, `Error` |

### Running Noesis Vision (Core Functionality Only)

To run Noesis Vision without AI integration, use the following Docker command:

```bash
docker run \
  -v /path/to/config:/externalConfig:ro \
  -v /path/to/sources:/externalSources:ro \
  -v /path/to/data:/data \
  -v /path/to/license.jwt:/license.jwt:ro \
  -p 8080:8080 \
  --rm \
  ghcr.io/noesisvision/vision:latest
```

This configuration will:
- Scan your codebase according to the conventions defined in `/externalConfig`
- Generate the P3 model representing code relationships
- Provide web UI accessible at `http://localhost:8080`
- Store analysis results and cache in the `/data` volume

## Optional AI Integration

Noesis Vision can optionally integrate with various AI language models to generate descriptions of elements in the P3 model. This AI integration is completely optional and enhances the analysis with human-readable descriptions of code components.

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

### AI Configuration

To enable AI integration, you need to configure the appropriate environment variables for your chosen AI provider and model.

#### AWS Bedrock Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `NOESIS_AWS__AccessKey` | Yes | AWS IAM access key with Bedrock permissions |
| `NOESIS_AWS__SecretKey` | Yes | AWS IAM secret key |

**Available Models:**
- `AmazonClaude35Haiku` - Claude 3.5 Haiku (fast, economical)
- `AmazonLlama8B` - Llama 3 8B (compact, fast)
- `AmazonLlama70B` - Llama 3 70B (advanced, slower)
- `AmazonMistralSmall` - Mistral Small (high quality)

**Notes:**
- AWS Region: `us-east-1` (hardcoded)
- Required permissions: `bedrock:InvokeModel` for selected model
- Claude 3.5 Haiku model is default supported in documentation

#### Fireworks AI Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `NOESIS_Fireworks__ApiKey` | Yes | Fireworks API key (format: `fw-...`) |
| `NOESIS_Fireworks__Url` | Yes | Fireworks endpoint URL (e.g., `https://api.fireworks.ai/inference/v1`) |

**Available Models:**
- `FireworksQwen3Coder30B` - Qwen3 Coder 30B (specialized for coding)

**Notes:**
- Fireworks uses OpenAI-compatible API
- Model is optimized for programming tasks

#### Hugging Face Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `NOESIS_HuggingFace__ApiKey` | Yes | Hugging Face API key (format: `hf_...`) |
| `NOESIS_HuggingFace__Phi4MiniUrl` | Yes* | URL for Phi-4 Mini model (e.g., `https://api-inference.huggingface.co/models/microsoft/Phi-4-mini-instruct`) |
| `NOESIS_HuggingFace__QwenCoder7BUrl` | Yes* | URL for Qwen Coder 7B model |

*Required only for corresponding models

**Available Models:**
- `HuggingFacePhi4Mini` - Phi-4 Mini (compact Microsoft model)
- `HuggingFaceQwenCoder7B` - Qwen Coder 7B (coding model)

**Notes:**
- Requires custom endpoint URL (can be Inference API or custom deployment)
- Model must be available through Hugging Face API


### AI Integration Examples

#### AWS Bedrock with Claude 3.5 Haiku

```bash
docker run \
  -v /path/to/config:/externalConfig:ro \
  -v /path/to/sources:/externalSources:ro \
  -v /path/to/data:/data \
  -v /path/to/license.jwt:/license.jwt:ro \
  -e NOESIS_LLM=AmazonClaude35Haiku \
  -e NOESIS_AWS__AccessKey=AKIA... \
  -e NOESIS_AWS__SecretKey=... \
  -p 8080:8080 \
  --rm \
  ghcr.io/noesisvision/vision:latest
```

#### Fireworks AI with Qwen3 Coder 30B

```bash
docker run \
  -v /path/to/config:/externalConfig:ro \
  -v /path/to/sources:/externalSources:ro \
  -v /path/to/data:/data \
  -v /path/to/license.jwt:/license.jwt:ro \
  -e NOESIS_LLM=FireworksQwen3Coder30B \
  -e NOESIS_Fireworks__ApiKey=fw-... \
  -e NOESIS_Fireworks__Url=https://api.fireworks.ai/inference/v1 \
  -p 8080:8080 \
  --rm \
  ghcr.io/noesisvision/vision:latest
```

#### Hugging Face with Phi-4 Mini

```bash
docker run \
  -v /path/to/config:/externalConfig:ro \
  -v /path/to/sources:/externalSources:ro \
  -v /path/to/data:/data \
  -v /path/to/license.jwt:/license.jwt:ro \
  -e NOESIS_LLM=HuggingFacePhi4Mini \
  -e NOESIS_HuggingFace__ApiKey=hf_... \
  -e NOESIS_HuggingFace__Phi4MiniUrl=https://api-inference.huggingface.co/models/microsoft/Phi-4-mini-instruct \
  -p 8080:8080 \
  --rm \
  ghcr.io/noesisvision/vision:latest
```


## Container Volumes

| Volume | Type | Description |
|--------|------|-------------|
| `/externalConfig` | Read-only | External configuration directory (.NET class library with Noesis rules) |
| `/externalSources` | Read-only | System sources directory for analysis (optional, if configuration uses local git repositories) |
| `/data` | Read-write | Volume for Noesis Vision managed data (cache, analysis results) |
| `/license.jwt` | Read-only | JWT license file |


## Notes and Best Practices

### Security
1. **Permissions**: In container, application runs as user `$APP_UID` (default 1000).
1. **Licenses**: License file must be available in container at `/license.jwt`.

### Configuration
1. **AWS Region**: AWS Bedrock is configured for `us-east-1` region (hardcoded).
2. **Ports**: Vision application listens on port 8080 in container.
3. **Logging**: All logs are sent to console in structured format.

### SELinux
If using SELinux, add `:Z` modifiers to volumes:
```bash
-v /path/to/config:/externalConfig:ro,Z
-v /path/to/sources:/externalSources:ro,Z
-v /path/to/data:/data:Z
```

### Performance
1. **Core Functionality**: Noesis Vision performs code analysis and generates P3 models efficiently without AI
2. **AI Models**: When using AI integration, choose model appropriate for your needs:
   - Claude 3.5 Haiku: fast and economical
   - Llama 3 70B: highest quality, slower
   - Qwen3 Coder 30B: specialized for coding
3. **Cache**: `/data` volume stores cache, speeding up subsequent analyses

### Troubleshooting
1. **Missing License**: Check if `/license.jwt` file is properly mounted
2. **AI Error**: Check API keys and model permissions (only if using AI integration)
3. **Missing Configuration**: Ensure `/externalConfig` contains proper .NET configuration
4. **Core Functionality**: Noesis works without AI - check configuration and license first

## Next Steps

After setting up Noesis, proceed to [Configure](/docs/configure) to learn how to define architectural patterns for your codebase.