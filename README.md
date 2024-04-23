# DetectiveSmell Extension for Visual Studio Code

DetectiveSmell is a Visual Studio Code extension designed to analyze your project and generate a comprehensive report on the code smells found within the project. 

This extension leverages the power of ANTLR4, ts-morph, and java-ast to parse and analyze your code, providing you with insights into potential areas of improvement in your codebase. 

DetectiveSmell supports multiple project types including SpringBoot, Angular, and NextJS. It comes with a set of predefined rules for each project type, which can be customized according to your needs. 

The extension also categorizes the detected code smells based on their severity and the layer they belong to, making it easier for you to prioritize and plan your refactoring efforts.

Whether you're working on a large enterprise application or a small personal project, DetectiveSmell can help you maintain high code quality and ensure your project's long-term success.


## Features

The extension's project analysis function is a feature that allows you to identify the main "smells" or bad smells in a web development project. These smells are code patterns that may indicate design, performance or maintainability problems in the project.

The project analysis function works as follows:

- **Information gathering:** The extension collects information about the project, such as source code files, dependencies, configurations, and any other relevant items.

- **Static analysis:** Using static analysis techniques, the extension examines the project's source code for code patterns that may indicate "smells". This involves analyzing the code structure, naming conventions, code complexity, among other aspects.

- **Smell identification:** Based on predefined or custom rules, the extension identifies smells in the project. These smells may include code duplication, excessive coupling, lack of cohesion, dead code, among others.

- **Report generation:** Once the smells have been identified, the extension generates reports showing the results of the analysis. These reports can include details about the smells found, their location in the code and suggestions for fixing them.

The extension's analyze project feature is a useful tool for improving code quality and keeping a web development project clean and well-structured. By identifying and correcting smells, code readability, performance and maintainability can be improved.


## Requirements

This Visual Studio Code extension is designed to analyze a project and generate a report with the code smells found in the project. To use this extension, you will need the following:

1. **antlr4ts**: This is a powerful parser generator for reading, processing, executing, or translating structured text or binary files. It's widely used to build languages, tools, and frameworks. You'll need it for this extension as it helps in parsing the code.

2. **ts-morph**: This is a TypeScript compiler API wrapper. It provides an easy-to-use way to navigate and manipulate TypeScript and JavaScript code. It's required for this extension to analyze TypeScript code.

3. **java-ast**: This is a library for parsing Java code and generating Abstract Syntax Trees (AST). It's necessary for this extension to analyze Java code.

Please ensure that these are installed and properly configured in your environment before using this extension.

## Extension Settings

This extension contributes the following settings:

1. **`DetectiveSmell.selectedRulesSpringBoot`**: This is an array that contains the list of rules to analyze for a SpringBoot project. The default rules include checks for entity attributes being objects, entities having the `@Data` annotation, logic classes having the `@Service` annotation, and more.

2. **`DetectiveSmell.selectA ProjectType`**: This setting allows you to select the type of project that will be analyzed. The options are "SpringBoot", "Angular", and "NextJS". The default is "SpringBoot".

3. **`DetectiveSmell.selectedSeverityRulesSpringBoot`**: This is an array that contains the list of severities per rule. The options are "Leve", "Moderado", and "Grave".

4. **`DetectiveSmell.selectedLayerRulesSpringBoot`**: This is an array that contains the list of category layers per rule. The options are "Capa de persistencia", "Capa de lógica", and "Capa de controladores".

Please refer to the `package.json` file for more details about these settings and their descriptions.


## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0


## Instructions for Publishing the Extension

For publishing the extension follow the instructions:

- Make sure you have Node.js installed
- Run: `npm install -g @vscode/vsce`
- Create a new DevOps Organization in `https://go.microsoft.com/fwlink/?LinkId=307137`
- Create a new Personal Access Token (Make sure to select the checkbox of manage on the Marketplace scope)
- Go to `https://marketplace.visualstudio.com/manage` and create a new publisher
- Go to the root folder of the project
- Run: `vsce login <PUBLISHER_ID>` and give the Personal Access Token you create before
- On the `package.json` file create a new field above the displayName field. The field should be as follow `"publisher": "<PUBLISHER_ID>",`
- Run: `vsce publish`
- DONE!! Once the extension is verified, you should see it in the Marketplace

## Requirements for the API

The API is develop in NestJS, for that reason, we need a node envirorment to run the API REST.

- It could be a container or an entire machine
- The machine it has to have an open port and always running
- No need for db or other resource
