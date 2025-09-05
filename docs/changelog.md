# Changelog

All notable changes to the Noesis Vision application will be documented in this file.

## [vision/0.3.0-preview10] - 2025-09-03

### Changed
- **Entry Point Description Refactoring**: Major refactoring of entry point description generation system
- **Namespace Refactoring**: Improved code organization and namespace structure
- **Code Quality**: Enhanced code maintainability and structure

### Fixed
- Improved entry point description generation logic
- Better error handling in description services

## [vision/0.3.0-preview09] - 2025-09-03

### Fixed
- **CreateEntryPointDescription Fix**: Resolved issues with entry point description creation
- Improved glossary integration with entry point descriptions
- Better error handling for missing domain glossaries

## [vision/0.3.0-preview08] - 2025-09-02

### Fixed
- **Glossary Retrieval Fix**: Fixed issues with domain glossary retrieval
- Improved error handling for missing glossary files
- Better logging for glossary deserialization failures

## [vision/0.3.0-preview07] - 2025-09-02

### Added
- **Domain Glossary System**: Complete domain glossary generation and management
- **Structured Output Support**: Added support for Amazon Claude models with structured output
- **Multiple AI Model Support**: Added support for Hugging Face models, QwenCoder7B, and Haiku
- **Token Usage Monitoring**: Enhanced monitoring of AI model token consumption
- **Glossary Integration**: Integrated glossary generation with entry point descriptions
- **Improved UI**: Enhanced glossary readiness state display

### Changed
- **Storage Management**: Centralized storage management across the application
- **Model Selection**: Haiku set as default AI model
- **Prompt Improvements**: Enhanced AI prompt templates and structures

### Fixed
- **Smoke Test Fix**: Resolved issues with automated testing
- **Element Descriptions**: Fixed various issues with element description generation
- **Domain Glossary Views**: Improved glossary display and interaction

### Technical
- Enhanced logging levels and error handling
- Improved test runner integration
- Better type handling for generic arguments

## [vision/0.3.0-preview06] - 2025-08-14

### Added
- **Enhanced Streaming**: Improved streaming capabilities for ElementDetails
- **Token Usage Monitoring**: Added comprehensive token usage tracking
- **AI Model Integration**: Support for Amazon Bedrock models
- **Entry Point Descriptions**: AI-powered generation of entry point descriptions
- **Prompt Templates**: Structured prompt template system

### Changed
- **Model Selection**: Enhanced LLM selection capabilities
- **Streaming Performance**: Better streaming for ElementDetails components
- **Prompt Structure**: Improved DefineEntryPointDescriptionStructure prompts

### Technical
- Added Chunk.cs for better streaming support
- Enhanced Amazon model wrapper functionality
- Improved prompt template management

## [vision/0.3.0-preview05] - 2025-08-08

### Changed
- **Logging Consistency**: Improved logging messages and consistency in ElementDescriptionService
- **Error Handling**: Better error message formatting and consistency

### Fixed
- **AWS Environment Variables**: Updated Vision README with correct AWS environment variable names
- **Documentation**: Removed outdated README files

## [vision/0.3.0-preview04] - 2025-08-08

### Added
- **Semantic Kernel Integration**: Full integration of Microsoft Semantic Kernel
- **GitHub Context Fetching**: Basic GitHub context retrieval for better element descriptions
- **Analysis View**: New analysis interface for P3 models
- **Navigation Enhancement**: Logo click navigation to home page
- **Source Code Integration**: Enhanced source code provider integration

### Changed
- **AI Model**: Switched to Haiku as the default AI model
- **Logging**: Updated logging level to "Information"
- **Docker Configuration**: Enhanced Docker run command formatting with AWS credentials
- **Context Fetching**: Improved context retrieval including parent domain objects

### Technical
- Enhanced element description generation with AI
- Improved token counting and optimization
- Better code compression and performance

## [vision/0.3.0-preview03] - 2025-08-06

### Fixed
- **Docker Image Naming**: Fixed repository owner retrieval for Docker image names
- **Container Publishing**: Improved Docker container publishing workflow

## [vision/0.3.0-preview02] - 2025-08-06

### Added
- **External Sources Support**: Added support for external sources path handling across projects
- **Git Repository Configuration**: Default branch support for Git repository configurations
- **Enhanced Package Management**: Improved NuGet package restoration logic

### Changed
- **Project Structure**: Major refactoring of project structure
- **Package Versions**: Updated package versions across the solution
- **Container Publishing**: Enhanced Vision Docker container publishing

### Fixed
- **FullAnalysis**: Various fixes for FullAnalysis functionality
- **Configuration Handling**: Improved external configuration path handling
- **Error Handling**: Enhanced error handling for package restoration and file operations

### Technical
- Merged AllInOne with Vision project
- Updated base container images across projects
- Enhanced GitHub Actions workflow configuration

## [vision/0.3.0-preview01] - 2025-07-31

### Added
- **.NET 9 SDK Support**: Added .NET 9 SDK setup in GitHub Actions publish-images workflow
- **Enhanced CI/CD**: Improved continuous integration and deployment pipeline

---

## Summary of Key Features

The Vision application provides:

- **AI-Powered Analysis**: Advanced AI integration for P3 model analysis and description generation
- **Domain Glossary System**: Comprehensive domain glossary generation and management
- **Multiple AI Models**: Support for various AI models including Amazon Bedrock, Hugging Face, and more
- **Enhanced Streaming**: Real-time streaming capabilities for better user experience
- **GitHub Integration**: Context-aware analysis using GitHub repository information
- **Docker Support**: Containerized deployment with comprehensive configuration options
- **Token Monitoring**: Detailed tracking of AI model usage and costs
- **Modern UI**: Enhanced user interface with improved navigation and analysis views

## System Requirements

- .NET 9 SDK
- Docker support
- AWS credentials (for Amazon Bedrock models)
- External configuration and sources paths
- Sufficient storage for P3 model data

## Getting Started

Refer to the Vision README for detailed setup and configuration instructions, including Docker run commands and AWS credential configuration.
