---
sidebar_position: 5
---

# Changelog

All notable changes to the Noesis Vision application will be documented in this file.

## [vision/0.4.0] - Preview

### Product Features

**Code Analysis**
- Automated source code analysis of .NET 5+ (.NET Core) repositories and extraction of a map of key architecture components structured according to the P3 model
- Ability to configure analysis using Noesis DSL in .NET using public `Noesis.Parser` packages, which allows to define architecture conventions
- Integration with Git repositories present on the file system of the host machine

**Noesis User Interface** 
- Visualization of the key architecture elements and their relationships in the form of trees, lists and diagrams
- Supported browsing modes:
    - By overall modules structure
    - By application entry point and its dependencies to other elements
- Each browsing mode includes:
    - tree of detected elements organized according to the configuration of modules
    - ability to visualize multiple selected elements in a form of diagram, with ability to filter and reorganize the elements on the diagram.

**LLM-powered map elements descriptions**
- Effective bulk generation of so called Domain Glossary - LLM summaries of all mapped elements
- Extended descriptions of entry points integrated with Domain Glossary
- Streaming of elements description in the NoesisUI during LLM generation to see the results faster
- Estimation of Domain Glossary generation cost and displaying it in the UI.

**Variety of LLM Integration**
- Support for multiple AI models: Amazon Bedrock, Hugging Face, Fireworks
- Token usage and cost monitoring


**Deployment & Infrastructure**
- Noesis Vision application is deployed as a Docker Container 
- Ability to configure the container using mounted configuration and environment variables
- Ability to mount persistent storage unit for caches and results


### In Development

**Documentation Export**
- Extended capabilities for exporting generated documentation
- Multiple export formats (Markdown and others)

**UX Improvements**
- User interface enhancements
- Better user experience across the application
- Performance and responsiveness optimization

---


