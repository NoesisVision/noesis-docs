---
sidebar_position: 1
---

# Set-up

Deploy Noesis on your infrastructure to safely scan your projects and describe their elements using the LLM of your choice.

## Quick Start

Get Noesis running on your infrastructure in minutes.

### Prerequisites

- .NET code repositories to scan
- Code should be in git
- Docker installed
- Noesis license file obtained
- Noesis docker access token obtained
- *Optional - LLM API access (OpenAI or Bedrock)*

### Docker command example

``` bash
docker run \
  -v /Users/szjanikowski/Documents/git/p3/P3-model-dotnet/Sources/Parser/Tests/TestConfigs:/externalConfig:ro \
  -v /Users/szjanikowski/Documents/git/itlibrium/DDD-starter-dotnet:/externalSources:ro \
  -v noesis-data:/data \
 -e NOESIS_Fireworks__Url=https://api.fireworks.ai/inference/v1 \
  -e NOESIS_Fireworks__ApiKey=[your api key] \
-e NOESIS_LLM=FireworksQwen3Coder30B \
 -p 8080:8080 \
  --rm \
ghcr.io/noesisvision/vision:latest
```

## Next Steps

Once Noesis is set up, proceed to [Configure](/docs/configure) to learn how to define architectural patterns for your codebase.
