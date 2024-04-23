import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { analyzeSpringBootProject } from './frameworks/springBoot';
import { analyzeAngular } from './frameworks/angular';
import { analyzeNestJsProject } from './frameworks/nestjs';

let config = vscode.workspace.getConfiguration('DetectiveSmell');
let selectedRulesSpringBoot = config.get('selectedRulesSpringBoot');
let selectedProjectType = config.get('selectA ProjectType');
let selectedSeverityRules = config.get('selectedSeverityRules');
let selectedLayerRulesSpringBoot = config.get('selectedLayerRulesSpringBoot');
let selectedRulesNest = config.get('selectedRulesNest');
let selectedLayerRuleNest = config.get('selectedLayerRulesNest');
let selectedRulesAngular = config.get('selectedRulesAngular');
let selectedLayerRulesAngular = config.get('selectedLayerRulesAngular');
let selectedSeverityRulesAngular = config.get('selectedSeverityRulesAngular');


export function activate(context: vscode.ExtensionContext) {

	let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'DetectiveSmell.analyzeProyect';
    statusBarItem.text = 'Analiza el proyecto';
    statusBarItem.tooltip = 'Haz clic para analizar el proyecto';
    statusBarItem.show();

    context.subscriptions.push(statusBarItem);

	const extensionFolder = context.extensionPath;

	const rulesSpringBootFilePath = path.join(extensionFolder, '/src/frameworks/rules/rulesSpringboot.json');
	const rulesSpringBootContent = fs.readFileSync(rulesSpringBootFilePath, 'utf8');
	const rulesSpringBoot = JSON.parse(rulesSpringBootContent);
	const buffer = fs.readFileSync(extensionFolder+"\\src\\frameworks\\rules\\formatoPruebas.json");
    const rulesNest= JSON.parse(buffer.toString("utf-8"));
	const rulesAngularFilePath = path.join(extensionFolder, '/src/frameworks/rules/rulesAngular.json');
	const rulesAngularContent = fs.readFileSync(rulesAngularFilePath, 'utf-8');
	const rulesAngular = JSON.parse(rulesAngularContent);

	let disposable = vscode.commands.registerCommand('DetectiveSmell.analyzeProyect', function (selectedFolder: vscode.Uri)
	{
		const projectFolder = vscode.workspace.workspaceFolders;

		let proyecto = projectFolder?.map((folder) => folder.uri.fsPath)[0] || selectedFolder.fsPath;

		if (selectedProjectType === 'SpringBoot')
		{
			analyzeSpringBootProject(proyecto, rulesSpringBoot, selectedRulesSpringBoot as string[], selectedSeverityRules as string[], selectedLayerRulesSpringBoot as string[], context);
		} else if (selectedProjectType === 'NextJS') {
			analyzeNestJsProject(proyecto,rulesNest,selectedRulesNest as string[], selectedSeverityRules as string[],selectedLayerRuleNest as string[], context);

		} else if (selectedProjectType === 'Angular') {
			analyzeAngular(proyecto, rulesAngular, selectedRulesAngular as string[], selectedSeverityRulesAngular as string[], selectedLayerRulesAngular as string[], context);
		}

        vscode.window.showInformationMessage('Análisis completado');

		vscode.workspace.onDidChangeConfiguration(async event => {
			loadConfig();
			if (selectedProjectType === 'SpringBoot')
			{
				analyzeSpringBootProject(proyecto, rulesSpringBoot, selectedRulesSpringBoot as string[], selectedSeverityRules as string[], selectedLayerRulesSpringBoot as string[], context);
			} else if (selectedProjectType === 'NextJS') {
				analyzeNestJsProject(proyecto,rulesNest,selectedRulesNest as string[], selectedSeverityRules as string[],selectedLayerRuleNest as string[], context);
			} else if (selectedProjectType === 'Angular') {
				analyzeAngular(proyecto, rulesAngular, selectedRulesAngular as string[], selectedSeverityRulesAngular as string[], selectedLayerRulesAngular as string[], context);
			}
		});
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function loadConfig() {
	config = vscode.workspace.getConfiguration('DetectiveSmell');
	selectedRulesSpringBoot = config.get('selectedRulesSpringBoot');
	selectedProjectType = config.get('selectA ProjectType');
	selectedSeverityRules = config.get('selectedSeverityRules');
	selectedLayerRulesSpringBoot = config.get('selectedLayerRulesSpringBoot');
	selectedRulesNest = config.get('selectedRulesNest');
	selectedLayerRuleNest = config.get('selectedLayerRulesNest');
	let selectedRulesAngular = config.get('selectedRulesAngular');
	let selectedLayerRulesAngular = config.get('selectedLayerRulesAngular');
	let selectedSeverityRulesAngular = config.get('selectedSeverityRulesAngular');
}
