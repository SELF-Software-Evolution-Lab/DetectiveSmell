import { Project, SourceFile, ClassDeclaration } from 'ts-morph';
import * as fs from "fs";
import * as vscode from 'vscode';
import { Reportpanel } from '../reportPanel';
import * as path from 'path';



export function analyzeNestJsProject(proyectPath:string, rulesTotal:any,selectedRules: string[], selectedSeverityRules: string[],selectedLayerRules:string[], context: vscode.ExtensionContext){
    const extensionUri= vscode.Uri;
    const projectPath =  proyectPath;
    
    const project = new Project({
        tsConfigFilePath: projectPath+"\\tsconfig.json",
    });
    const projectName = projectPath.split("\\").pop();
    interface Rule {
        id: number;
        name: string;
        description: string;
        example: string;
        message: string;
        severity: string;
        line: number;
        path: string;
        absolutePath:string;
      }
    interface Rules {
        [key: string]: Rule[];
    }
    const globalReport:Rules= {
    'Capa de persistencia':[],
    'Capa de lógica': [],
    'Capa de controladores': [],
    'Capa de DTO': []
    };

    const objectTypes = new Set(["String","Integer","FLoat","Date","Boolean"]);
    for(let rule of rulesTotal.rules){
        if(selectedRules.includes(rule.name) && selectedSeverityRules.includes(rule.severity) && selectedLayerRules.includes(rule.category)){
            if(rule.category==="Capa de persistencia"){
                project.getSourceFiles().forEach(file=>{
                    const classes = file.getClasses(); 
                    classes.forEach(classFile=>{
                        if(classFile.getName()?.includes("Entity")){
                            if(rule.name==="Atributos primitivos" ){
                            const properties = classFile.getProperties();
                            properties.forEach(property=>{
                                const type = property.getType();
                                const filePath = classFile.getSourceFile().getFilePath();
                                const shortenedPath= path.relative(proyectPath, filePath);
                                const absolutePath=projectName+"/" + shortenedPath.replace("\\","/");
                                if(!objectTypes.has(type.getText())){
                                    const line = property.getStartLineNumber();
                                    globalReport['Capa de persistencia'].push({
                                        id: rule.id,
                                        name: rule.name,
                                        description: rule.description,
                                        message: `En el atributo en la línea ${line} de la clase ${classFile.getName()}`,
                                        severity: rule.severity,
                                        line: line,
                                        example: rule.example,
                                        path: filePath,
                                        absolutePath:absolutePath
                                    });
                                }
        
                            });
                        }
                            else if(rule.name==="Anotacion en la clase Entity"){
                                if(!classFile.getDecorator("Data")){
                                    const comment= `Error: Clase "${classFile.getName()}" no tiene la anotación @Data de la libreria lombok `;
                                    const line= classFile.getStartLineNumber();
                                    const filePath = classFile.getSourceFile().getFilePath();
                                    const shortenedPath= path.relative(proyectPath, filePath);
                                    const absolutePath=projectName+"/" + shortenedPath.replace("\\","/");
                                    globalReport["Capa de persistencia"].push({
                                        id: rule.id,
                                        name: rule.name,
                                        description: rule.description,
                                        message: comment,
                                        severity: rule.severity,
                                        line: line,
                                        example: rule.example,
                                        path: filePath,
                                        absolutePath:absolutePath
                                    });
                                }
                            }
                        }
                    });
                });
            }
            else if(rule.category==="Capa de lógica"){
                project.getSourceFiles().forEach(file=>{
                    const classes = file.getClasses(); 
                    classes.forEach(classFile=>{
                        if(classFile.getName()?.includes("Service")){
                            if(rule.name==="Anotacion en la clase Service"){
                                if(!classFile.getDecorator("Service")){
                                    const comment= `Error: Clase "${classFile.getName()}" no tiene la anotación @Service `;
                                    const line= classFile.getStartLineNumber();
                                    const filePath = classFile.getSourceFile().getFilePath();
                                    const shortenedPath= path.relative(proyectPath, filePath);
                                    const absolutePath=projectName+"/" + shortenedPath.replace("\\","/");
                                    globalReport["Capa de lógica"].push({
                                        id: rule.id,
                                        name: rule.name,
                                        description: rule.description,
                                        message: comment,
                                        severity: rule.severity,
                                        line: line,
                                        example: rule.example,
                                        path: filePath,
                                        absolutePath:absolutePath
                                    });
                                }

                            }
                            else if(rule.name==="Anotacion en los atributos de las clases de la lógica"){

                            }

                        }
                    });
                });
            }
            else if(rule.category==="Capa de controladores"){
                project.getSourceFiles().forEach(file=>{
                    const classes = file.getClasses(); 
                    classes.forEach(classFile=>{
                        if(classFile.getName()?.includes("Controller")){
                            if(rule.name==="Anotacion en la clase Controller"){
                            if(!classFile.getDecorator("Controller")){
                                const comment= `Error: Clase "${classFile.getName()}" no tiene la anotación @Controller`;
                                const line= classFile.getStartLineNumber();
                                const filePath = classFile.getSourceFile().getFilePath();
                                const shortenedPath= path.relative(proyectPath, filePath);
                                const absolutePath=projectName+"/" + shortenedPath.replace("\\","/");
                                globalReport["Capa de controladores"].push({
                                    id: rule.id,
                                    name: rule.name,
                                    description: rule.description,
                                    message: comment,
                                    severity: rule.severity,
                                    line: line,
                                    example: rule.example,
                                    path: filePath,
                                    absolutePath:absolutePath
                                });
                            }}
                            else if(rule.name==="Anotacion de RequestMapping en la clase Controller"){
                                if(!classFile.getDecorator("RequestMapping")){
                                    const comment= `Error: Clase "${classFile.getName()}" no tiene la anotación @RequestMapping`;
                                    const line= classFile.getStartLineNumber();
                                    const filePath = classFile.getSourceFile().getFilePath();
                                    const shortenedPath= path.relative(projectPath, filePath);
                                    const absolutePath=projectName+"/" + shortenedPath.replace("\\","/");
                                    globalReport["Capa de controladores"].push({
                                        id: rule.id,
                                        name: rule.name,
                                        description: rule.description,
                                        message: comment,
                                        severity: rule.severity,
                                        line: line,
                                        example: rule.example,
                                        path: filePath,
                                        absolutePath:absolutePath
                                    });
                                }
                            }
                            else if(rule.name==="Anotacion en los atributos de las clases de los controladores"){
                                const properties = classFile.getProperties();
                                properties.forEach(property=>{
                                    if(!property.getDecorator("Autowired")){
                                        const comment= `Error: Clase ${classFile.getName()} debe tener los atributos anotados con @Autowired`;
                                        const line= property.getStartLineNumber();
                                        const filePath = classFile.getSourceFile().getFilePath();
                                        const shortenedPath= path.relative(projectPath, filePath);
                                        const absolutePath=projectName+"/" + shortenedPath.replace("\\","/");
                                        globalReport["Capa de controladores"].push({
                                            id: rule.id,
                                            name: rule.name,
                                            description: rule.description,
                                            message: comment,
                                            severity: rule.severity,
                                            line: line,
                                            example: rule.example,
                                            path: filePath,
                                            absolutePath:absolutePath
                                        });
                                    }
                                });
                            }
                            else if(rule.name==="Retorno tipo GET en controladores"){
                                const methods = classFile.getMethods();
                                methods.forEach(m=>{
                                    if(m.getDecorator("Get")){
                                        const returnType=m.getReturnType();
                                        if(!returnType||returnType.getText()!=="DetailDTO"){
                                            const comment=`Error: Método '${m.getName()} del la clase  ${classFile.getName()} no retorna DetailDTO`;
                                            const line= m.getStartLineNumber();
                                            const filePath = classFile.getSourceFile().getFilePath();
                                            const shortenedPath= path.relative(projectPath, filePath);
                                            const absolutePath=projectName+"/" + shortenedPath.replace("\\","/");
                                            globalReport["Capa de controladores"].push({
                                                id: rule.id,
                                                name: rule.name,
                                                description: rule.description,
                                                message: comment,
                                                severity: rule.severity,
                                                line: line,
                                                example: rule.example,
                                                path: filePath,
                                                absolutePath:absolutePath
                                            });

                                        }
                                    }
                                });
                            }
                        }
                    });
                });
            }
            else if(rule.category==="Capa de DTO")
            {
                project.getSourceFiles().forEach(file=>{
                    const classes = file.getClasses(); 
                    classes.forEach(classFile=>{
                        if(classFile.getName()?.includes("DTO")||classFile.getName()?.includes("DetailDTO")){
                            if(rule.name==="Anotacion de data en DTO y DetailDTO"){
                                if(!classFile.getDecorator("Data")){
                                    const comment= `Error: Clase "${classFile.getName()}" no tiene la anotación @Data de la libreria lombok `;
                                    const line= classFile.getStartLineNumber();
                                    const filePath = classFile.getSourceFile().getFilePath();
                                    const shortenedPath= path.relative(projectPath, filePath);
                                    const absolutePath=projectName+"/" + shortenedPath.replace("\\","/");
                                    globalReport["Capa de DTO"].push({
                                        id: rule.id,
                                        name: rule.name,
                                        description: rule.description,
                                        message: comment,
                                        severity: rule.severity,
                                        line: line,
                                        example: rule.example,
                                        path: filePath,
                                        absolutePath:absolutePath
                                    });
                                }
                            }
                            else if(rule.name="Tipo de atributos en las clases DTO y DetailDTO"){
                                const properties = classFile.getProperties();
                                properties.forEach(property=>{
                                    const type = property.getType();
                                    const line = property.getStartLineNumber();
                                });
                            }
                        }
                    });
                });

            }
        }
    }
    Reportpanel.createOrShow(context.extensionUri,projectPath,globalReport);
}


