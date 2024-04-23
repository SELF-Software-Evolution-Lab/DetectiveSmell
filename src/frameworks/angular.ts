import * as fs from "fs";
import * as path from "path";
import * as vscode from 'vscode';
import { Reportpanel } from "../reportPanel";

export function analyzeAngular(projectDirectory: string, rules: any, selectedRules: string[], selectedSeverityRules: string[], selectedLayerRulesAngular: string[], context: vscode.ExtensionContext) {
    // Objeto para almacenar la estructura de carpetas y sus archivos
    const folderStructure: { [folderName: string]: string[] } = {};

    // Array para almacenar los mensajes de error
    const errors: string[] = [];

    // Función para leer todos los archivos TypeScript en un directorio y sus subdirectorios
    function readProject(directory: string, parentFolder: string = ""): void {
        fs.readdirSync(directory).forEach(file => {
            const filePath = path.join(directory, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                // Si es un directorio, leer sus archivos recursivamente
                readProject(filePath, path.join(parentFolder, file));
            } else if (file.endsWith(".ts")) {
                // Si es un archivo TypeScript, agregarlo a la lista
                const folder = parentFolder || "/";
                if (!folderStructure[folder]) {
                    folderStructure[folder] = [];
                }
                folderStructure[folder].push(filePath);
            }
        });
    }

    readProject(projectDirectory);

    interface GlobalReport {
        [key: string]: {
            id: number;
            name: string;
            description: string;
            example: string;
            message: string;
            severity: string;
            line: number;
            path: string;
            absolutePath: string;
        }[];
    }

    let globalReport: GlobalReport = {
        'Capa de infraestructura': [],
        'Capa de módulos': []
    };
//Regla: Los nombres de los módulos deben estar en singular.    
    for (const rule of rules.rules) {
        if(selectedRules.includes(rule.name) && selectedSeverityRules.includes(rule.severity) && selectedLayerRulesAngular.includes(rule.category)){
            if(rule.category==="Capa de módulos"){
                if(rule.name==="Los nombres de los módulos deben estar en singular"){
                    var natural = require('natural');
                    var nounInflector = new natural.NounInflector();
                    for (const folderName in folderStructure) {
                        if (folderName.toLowerCase().includes('app')){
                            const files = folderStructure[folderName];
                            if (files.some(file => file.endsWith('.module.ts'))) {
                                const moduleName = path.basename(folderName, path.extname(folderName));
                                const modulePath = path.join(projectDirectory, folderName, moduleName + '.module.ts');
                                const singularizeModuleName = nounInflector.singularize(moduleName);
                                if (moduleName !== singularizeModuleName) {
                                    globalReport['Capa de módulos'].push({
                                        message: `'${moduleName}' debería estar escrito en un formato en singular.`,
                                        severity: rule.severity,
                                        name: rule.name,
                                        id: rule.id,
                                        description: rule.description,
                                        example: rule.example,
                                        line: 1,
                                        path: modulePath.replace(/\\/g, '\\\\'),
                                        absolutePath: moduleName.split('\\').at(-1) || ""
                                    });
                                }
                            }
                        }
                    }
                }
            }
            if(rule.category==="Capa de infraestructura"){
                const foldersToExcludeKeywords = ['cypress', 'Prueba_Cypress', 'reports', 'interceptors', 'environments', 'test', 'prueba', 'pruebas']; // Palabras clave para identificar carpetas de prueba
                for (const folderName in folderStructure) {
                    let excludeFolder = false;
                    for (const keyword of foldersToExcludeKeywords) {
                        if (folderName.toLowerCase().includes(keyword)) {
                            excludeFolder = true;
                            break;
                        }
                    }
                    if (excludeFolder) {
                        continue;
                    }                
                    if(rule.name==="No debería haber servicios ni componentes a nivel de la carpeta 'app' que no sean los propios de 'app'"){
                        const files = folderStructure[folderName];
                        const folderBaseName = path.basename(folderName);
                        for (const filename of files) {
                            const fileBaseName = path.basename(filename, path.extname(filename));
                            const modulePath = path.join(folderName, filename);
                            if (!fileBaseName.includes(folderBaseName)) {
                                if (folderBaseName.toLowerCase() === 'app') {
                                    globalReport['Capa de infraestructura'].push({
                                        message: `El archivo ${fileBaseName} no debería ir en el nivel de la carpeta ${folderBaseName}`,
                                        severity: rule.severity,
                                        name: rule.name,
                                        id: rule.id,
                                        description: rule.description,
                                        example: rule.example,
                                        line: 1,
                                        path: filename.replace(/\\/g, '\\\\'),
                                        absolutePath: modulePath.split('\\').at(-1) || ""
                                    });
                                }
                            }
                        }
                    }
                    if(rule.name==="Los nombres de las carpetas (módulos) deben coincidir con sus archivos"){
                        const files = folderStructure[folderName];
                        const folderBaseName = path.basename(folderName);
                        for (const filename of files) {
                            const fileBaseName = path.basename(filename, path.extname(filename));
                            const modulePath = path.join(fileBaseName, filename);
                            if (!fileBaseName.includes(folderBaseName)) {
                                globalReport['Capa de infraestructura'].push({
                                    message: `El archivo ${fileBaseName} no contiene el nombre de la carpeta ${folderBaseName}`,
                                    severity: rule.severity,
                                    name: rule.name,
                                    id: rule.id,
                                    description: rule.description,
                                    example: rule.example,
                                    line: 1,
                                    path: filename.replace(/\\/g, '\\\\'),
                                    absolutePath: modulePath.split('\\').at(-1) || ""
                                }); 
                            }
                        }
                    }
                }
            }
        }
    }
    Reportpanel.createOrShow(context.extensionUri, projectDirectory, globalReport);
}
