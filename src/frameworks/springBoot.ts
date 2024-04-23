import * as vscode from 'vscode';
import { parse, createVisitor, TypeDeclarationContext } from 'java-ast';
import * as fs from 'fs';
import * as path from 'path';
import { Reportpanel } from '../reportPanel';

export function analyzeSpringBootProject(proyecto: string, rules: any, selectedRules: string[], selectedSeverityRules: string[], selectedLayerRulesSpringBoot: string[], context: vscode.ExtensionContext) {

    function readJavaFiles(dir: string): {content: string, filePath: string}[] {
        let javaFilesContent: {content: string, filePath: string}[] = [];
        const files = fs.readdirSync(dir);
        const excludeDirs = ['bin','target','test'];
    
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
    
            if (stat.isDirectory()) {
                if (excludeDirs.includes(file)) {
                    continue;
                }
                javaFilesContent = javaFilesContent.concat(readJavaFiles(filePath));
            } else if (stat.isFile() && path.extname(file) === '.java') {
                const content = fs.readFileSync(filePath, 'utf8');
                javaFilesContent.push({content, filePath});
            }
        }
        return javaFilesContent;
    }

    function checkJavaRules (source: string, filePath: string) {
        let ast = parse(source);
        interface Report {
            [key: string]: {
                id: number;
                name: string;
                description: string;
                example: string;
                message: string;
                severity: string;
                line: number;
                path: string;
                absolutePath:string;
            }[];
        }
    
        let report: Report = {
            'Capa de persistencia': [],
            'Capa de lógica': [],
            'Capa de controladores': []
        };

        let annotationsEntity: any[] = [];
        let annotationsService: any[] = [];
        let annotationsController: any[] = [];
        let annotationsDTO: any[] = [];
        
        let visitor = createVisitor({
            visitClassDeclaration: (node) => {
                if (node.IDENTIFIER().symbol.text?.includes("Entity") && !node.IDENTIFIER().symbol.text?.includes("Test") && !node.IDENTIFIER().symbol.text?.includes("Exception")) {
                    let pass = false;
                    let line = 0;
                    for (const nodei of node.classBody().classBodyDeclaration()) {
                        if (nodei.memberDeclaration()?.fieldDeclaration()?.typeType().primitiveType() !== undefined) {
                            pass = true;
                            line = nodei.start.line;
                        }
                    }
                    if (pass) {
                        report[rules.rules[0].category].push({
                            message: `En el atributo en la línea <b>${node.start.line}</b> del archivo ${filePath}`,
                            severity: rules.rules[0].severity,
                            name: rules.rules[0].name,
                            id: rules.rules[0].id,
                            description: rules.rules[0].description,
                            example: rules.rules[0].example,
                            line: line,
                            path: proyecto.replace(/\\/g, '\\\\') + filePath.replace(/\\/g, '\\\\'),
                            absolutePath: filePath.split('\\').at(-1) || ""
                        });
                    }
                }
                if (node.IDENTIFIER().symbol.text?.includes("DTO")) {
                    let pass = false;
                    let line = 0;
                    for (const nodei of node.classBody().classBodyDeclaration()) {
                        if (nodei.memberDeclaration()?.fieldDeclaration()?.typeType().primitiveType() !== undefined) {
                            pass = true;
                            line = nodei.start.line;
                        }
                    }
                    if (pass) {
                        report[rules.rules[8].category].push({
                            message: `En el atributo en la línea <b>${node.start.line}</b> del archivo ${filePath}`,
                            severity: rules.rules[8].severity,
                            name: rules.rules[8].name,
                            id: rules.rules[8].id,
                            description: rules.rules[8].description,
                            example: rules.rules[8].example,
                            line: line,
                            path: proyecto.replace(/\\/g, '\\\\') + filePath.replace(/\\/g, '\\\\'),
                            absolutePath: filePath.split('\\').at(-1) || ""
                        });
                    }
                }
                if (node.IDENTIFIER().symbol.text?.includes("Service") && !node.IDENTIFIER().symbol.text?.includes("Test") && !node.IDENTIFIER().symbol.text?.includes("Exception")) {
                    for (const nodei of node.classBody().classBodyDeclaration()) {
                        if(!nodei.modifier()[0]?.classOrInterfaceModifier()?.annotation()?.qualifiedName()?.IDENTIFIER()[0]?.symbol.text?.includes("Autowired") && nodei.memberDeclaration()?.fieldDeclaration() !== undefined) {
                            report[rules.rules[3].category].push({
                                message: `En el atributo en la línea <b>${node.start.line}</b> del archivo ${filePath}`,
                                severity: rules.rules[3].severity,
                                name: rules.rules[3].name,
                                id: rules.rules[3].id,
                                description: rules.rules[3].description,
                                example: rules.rules[3].example,
                                line: nodei.start.line,
                                path: proyecto.replace(/\\/g, '\\\\') + filePath.replace(/\\/g, '\\\\'),
                                absolutePath: filePath.split('\\').at(-1) || ""
                            });                                                                       
                        }
                    }
                }
                if (node.IDENTIFIER().symbol.text?.includes("Controller")) {
                    for (const nodei of node.classBody().classBodyDeclaration()) {
                        if(!nodei.modifier()[0]?.classOrInterfaceModifier()?.annotation()?.qualifiedName()?.IDENTIFIER()[0]?.symbol.text?.includes("Autowired") && nodei.memberDeclaration()?.fieldDeclaration() !== undefined) {
                            report[rules.rules[6].category].push({
                                message: `En el atributo en la línea <b>${node.start.line}</b> del archivo ${filePath}`,
                                severity: rules.rules[6].severity,
                                name: rules.rules[6].name,
                                id: rules.rules[6].id,
                                description: rules.rules[6].description,
                                example: rules.rules[6].example,
                                line: nodei.start.line,
                                path: proyecto.replace(/\\/g, '\\\\') + filePath.replace(/\\/g, '\\\\'),
                                absolutePath: filePath.split('\\').at(-1) || ""
                            });                                                                       
                        }
                    }
                }
                if (node.IDENTIFIER().symbol.text?.includes("Controller")) {
                    for (const nodei of node.classBody().classBodyDeclaration()) {
                        const nodea = nodei.memberDeclaration()?.methodDeclaration()?.typeTypeOrVoid()?.typeType()?.classOrInterfaceType();
                        if(nodei.modifier()[0]?.classOrInterfaceModifier()?.annotation()?.qualifiedName()?.IDENTIFIER()[0]?.symbol.text?.includes("GetMapping") && nodea !== undefined) {
                            if(!nodea?.IDENTIFIER()[0]?.symbol.text?.includes("DetailDTO")) {
                                if(!nodea?.typeArguments()[0]?.typeArgument()[0]?.typeType()?.classOrInterfaceType()?.IDENTIFIER()[0]?.symbol.text?.includes("DetailDTO")) {
                                    report[rules.rules[9].category].push({
                                        message: `En el método en la línea <b>${node.start.line}</b> del archivo ${filePath}`,
                                        severity: rules.rules[9].severity,
                                        name: rules.rules[9].name,
                                        id: rules.rules[9].id,
                                        description: rules.rules[9].description,
                                        example: rules.rules[9].example,
                                        line: nodei.memberDeclaration()?.methodDeclaration()?.start.line || 1,
                                        path: proyecto.replace(/\\/g, '\\\\') + filePath.replace(/\\/g, '\\\\'),
                                        absolutePath: filePath.split('\\').at(-1) || ""
                                    });
                                }
                            }                                                    
                        }
                    }
                }
                if(node.IDENTIFIER().symbol.text?.includes("DTO")) {
                    if((node.parent?.childCount ?? 0).toString() === '2') {
                        report[rules.rules[7].category].push({
                            message: `En la clase en la línea <b>${node.start.line}</b> del archivo ${filePath}`,
                            severity: rules.rules[7].severity,
                            name: rules.rules[7].name,
                            id: rules.rules[7].id,
                            description: rules.rules[7].description,
                            example: rules.rules[7].example,
                            line: node.start.line,
                            path: proyecto.replace(/\\/g, '\\\\') + filePath.replace(/\\/g, '\\\\'),
                            absolutePath: filePath.split('\\').at(-1) || ""
                        });
                    }
                }
                if(node.IDENTIFIER().symbol.text?.includes("Entity") && !node.IDENTIFIER().symbol.text?.includes("Test") && !node.IDENTIFIER().symbol.text?.includes("Exception")){
                    if((node.parent?.childCount ?? 0).toString() === '2') {
                        report[rules.rules[1].category].push({
                            message: `En la clase en la línea <b>${node.start.line}</b> del archivo ${filePath}`,
                            severity: rules.rules[1].severity,
                            name: rules.rules[1].name,
                            id: rules.rules[1].id,
                            description: rules.rules[1].description,
                            example: rules.rules[1].example,
                            line: node.start.line,
                            path: proyecto.replace(/\\/g, '\\\\') + filePath.replace(/\\/g, '\\\\'),
                            absolutePath: filePath.split('\\').at(-1) || ""
                        });
                    }
                }
                if(node.IDENTIFIER().symbol.text?.includes("Service") && !node.IDENTIFIER().symbol.text?.includes("Test") && !node.IDENTIFIER().symbol.text?.includes("Exception")) {
                    if((node.parent?.childCount ?? 0).toString() === '2') {
                        report[rules.rules[2].category].push({
                            message: `En la clase en la línea <b>${node.start.line}</b> del archivo ${filePath}`,
                            severity: rules.rules[2].severity,
                            name: rules.rules[2].name,
                            id: rules.rules[2].id,
                            description: rules.rules[2].description,
                            example: rules.rules[2].example,
                            line: node.start.line,
                            path: proyecto.replace(/\\/g, '\\\\') + filePath.replace(/\\/g, '\\\\'),
                            absolutePath: filePath.split('\\').at(-1) || ""
                        });
                    }
                }
                if(node.IDENTIFIER().symbol.text?.includes("Controller")) {
                    if((node.parent?.childCount ?? 0).toString() === '2') {
                        report[rules.rules[4].category].push({
                            message: `En la clase en la línea <b>${node.start.line}</b> del archivo ${filePath}`,
                            severity: rules.rules[4].severity,
                            name: rules.rules[4].name,
                            id: rules.rules[4].id,
                            description: rules.rules[4].description,
                            example: rules.rules[4].example,
                            line: node.start.line,
                            path: proyecto.replace(/\\/g, '\\\\') + filePath.replace(/\\/g, '\\\\'),
                            absolutePath: filePath.split('\\').at(-1) || ""
                        });
                    }
                }
                if(node.IDENTIFIER().symbol.text?.includes("Controller")) {
                    if((node.parent?.childCount ?? 0).toString() === '2') {
                        report[rules.rules[5].category].push({
                            message: `En la clase en la línea <b>${node.start.line}</b> del archivo ${filePath}`,
                            severity: rules.rules[5].severity,
                            name: rules.rules[5].name,
                            id: rules.rules[5].id,
                            description: rules.rules[5].description,
                            example: rules.rules[5].example,
                            line: node.start.line,
                            path: proyecto.replace(/\\/g, '\\\\') + filePath.replace(/\\/g, '\\\\'),
                            absolutePath: filePath.split('\\').at(-1) || ""
                        });
                    }
                }
                return false;
            },
            visitAnnotation: (node) => {
                let clas = node.parent?.parent as TypeDeclarationContext;
                if (clas.classDeclaration()?.IDENTIFIER().symbol.text?.includes("Entity")) {
                    annotationsEntity.push({
                        node: node,
                        classNode: clas,
                        filePath: filePath
                    });
                }
                if (clas.classDeclaration()?.IDENTIFIER().symbol.text?.includes("Service") && !clas.classDeclaration()?.IDENTIFIER().symbol.text?.includes("Test") && !clas.classDeclaration()?.IDENTIFIER().symbol.text?.includes("Exception")) {
                    annotationsService.push({
                        node: node,
                        classNode: clas,
                        filePath: filePath
                    });
                }
                if (clas.classDeclaration()?.IDENTIFIER().symbol.text?.includes("Controller")) {
                    annotationsController.push({
                        node: node,
                        classNode: clas,
                        filePath: filePath
                    });
                }
                if (clas.classDeclaration()?.IDENTIFIER().text.includes("DTO")) {
                    annotationsDTO.push({
                        node: node,
                        classNode: clas,
                        filePath: filePath
                    });
                }
                return false;
            },
            defaultResult: () => true,
            aggregateResult: (a, b) => a,
        });
        visitor.visit(ast);
        
        if (selectedRules.includes("Todas las entidades tienen la anotación @Data")) {
            let list : any[] = [];

            for (const annotation of annotationsEntity) {
                if (annotation.node.qualifiedName().IDENTIFIER()[0]?.symbol.text?.includes("Data")) {
                    list.push(annotation);
                }
            }
            for (const annotation of annotationsEntity) {
                for (const item of list) {
                    if (annotation.filePath === item.filePath) {
                        annotationsEntity = annotationsEntity.filter(item => item.filePath !== annotation.filePath);
                    }
                }
            }
            for (const annotation of annotationsEntity) {
                for (const rule of rules.rules) {
                    if (rule.id.toString() === '2') {
                        report[rule.category].push({
                            message: `En la entidad de la línea <b>${annotation.classNode.start.line}</b> del archivo ${annotation.filePath}`,
                            severity: rule.severity,
                            name: rule.name,
                            id: rule.id,
                            description: rule.description,
                            example: rule.example,
                            line: annotation.classNode.start.line,
                            path: proyecto.replace(/\\/g, '\\\\') + filePath.replace(/\\/g, '\\\\'),
                            absolutePath: filePath.split('\\').at(-1) || ""
                        });
                    }

                }
            }
        }

        if (selectedRules.includes("Todas las clases de lógica tienen la anotación @Service")) {
            let list : any[] = [];

            for (const annotation of annotationsService) {
                if (annotation.node.qualifiedName().IDENTIFIER()[0]?.symbol.text?.includes("Service")) {
                    list.push(annotation);
                }
            }
            for (const annotation of annotationsService) {
                for (const item of list) {
                    if (annotation.filePath === item.filePath) {
                        annotationsService = annotationsService.filter(item => item.filePath !== annotation.filePath);
                    }
                }
            }
            for (const annotation of annotationsService) {
                for (const rule of rules.rules) {
                    if (rule.id.toString() === '3') {
                        report[rule.category].push({
                            message: `En la clase de lógica de la línea <b>${annotation.classNode.start.line}</b> del archivo ${annotation.filePath}`,
                            severity: rule.severity,
                            name: rule.name,
                            id: rule.id,
                            description: rule.description,
                            example: rule.example,
                            line: annotation.classNode.start.line,
                            path: proyecto.replace(/\\/g, '\\\\') + filePath.replace(/\\/g, '\\\\'),
                            absolutePath: filePath.split('\\').at(-1) || ""
                        });
                    }

                }
            }
        }

        if (selectedRules.includes("Todas las clases de controladores tienen la anotación @Controller")) {
            let list : any[] = [];
            let complete_list : any[] = annotationsController;

            for (const annotation of complete_list) {
                if (annotation.node.qualifiedName().IDENTIFIER()[0]?.symbol.text?.includes("Controller")) {
                    list.push(annotation);
                }
            }
            for (const annotation of complete_list) {
                for (const item of list) {
                    if (annotation.filePath === item.filePath) {
                        complete_list = complete_list.filter(item => item.filePath !== annotation.filePath);
                    }
                }
            }
            
            complete_list = complete_list.filter((elem, index, self) => self.findIndex((t) => {return t.filePath === elem.filePath; }) === index);

            for (const annotation of complete_list) {
                for (const rule of rules.rules) {
                    if (rule.id.toString() === '5') {
                        report[rule.category].push({
                            message: `En la clase de controladores de la línea <b>${annotation.classNode.start.line}</b> del archivo ${annotation.filePath}`,
                            severity: rule.severity,
                            name: rule.name,
                            id: rule.id,
                            description: rule.description,
                            example: rule.example,
                            line: annotation.classNode.start.line,
                            path: proyecto.replace(/\\/g, '\\\\') + filePath.replace(/\\/g, '\\\\'),
                            absolutePath: filePath.split('\\').at(-1) || ""
                        });
                    }

                }
            }
        }

        if(selectedRules.includes("Todas las clases de controladores tienen la anotación @RequestMapping")) {
            let list : any[] = [];
            let complete_list : any[] = annotationsController;

            for (const annotation of complete_list) {
                if (annotation.node.qualifiedName().IDENTIFIER()[0]?.symbol.text?.includes("RequestMapping")) {
                    list.push(annotation);
                }
            }
            for (const annotation of complete_list) {
                for (const item of list) {
                    if (annotation.filePath === item.filePath) {
                        complete_list = complete_list.filter(item => item.filePath !== annotation.filePath);
                    }
                }
            }

            complete_list = complete_list.filter((elem, index, self) => self.findIndex((t) => {return t.filePath === elem.filePath; }) === index);

            for (const annotation of complete_list) {
                for (const rule of rules.rules) {
                    if (rule.id.toString() === '6') {
                        report[rule.category].push({
                            message: `En la clase de controladores de la línea <b>${annotation.classNode.start.line}</b> del archivo ${annotation.filePath}`,
                            severity: rule.severity,
                            name: rule.name,
                            id: rule.id,
                            description: rule.description,
                            example: rule.example,
                            line: annotation.classNode.start.line,
                            path: proyecto.replace(/\\/g, '\\\\') + filePath.replace(/\\/g, '\\\\'),
                            absolutePath: filePath.split('\\').at(-1) || ""
                        });
                    }

                }
            }
        }

        if(selectedRules.includes("Todas las clases DTO y DetailDTO tienen la anotación @Data")) {
            let list : any[] = [];
            let complete_list : any[] = annotationsDTO;

            for (const annotation of complete_list) {
                if (annotation.node.qualifiedName().IDENTIFIER()[0]?.symbol.text?.includes("Data")) {
                    list.push(annotation);
                }
            }
            for (const annotation of complete_list) {
                for (const item of list) {
                    if (annotation.filePath === item.filePath) {
                        complete_list = complete_list.filter(item => item.filePath !== annotation.filePath);
                    }
                }
            }
            complete_list = complete_list.filter((elem, index, self) => self.findIndex((t) => {return t.filePath === elem.filePath; }) === index);
            for (const annotation of complete_list) {
                for (const rule of rules.rules) {
                    if (rule.id.toString() === '8') {
                        report[rule.category].push({
                            message: `En la clase DTO de la línea <b>${annotation.classNode.start.line}</b> del archivo ${annotation.filePath}`,
                            severity: rule.severity,
                            name: rule.name,
                            id: rule.id,
                            description: rule.description,
                            example: rule.example,
                            line: annotation.classNode.start.line,
                            path: proyecto.replace(/\\/g, '\\\\') + filePath.replace(/\\/g, '\\\\'),
                            absolutePath: filePath.split('\\').at(-1) || ""
                        });
                    }

                }
            }
        }

        return report;
    };
    
    const javaFilesContent = readJavaFiles(proyecto);

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
            absolutePath:string;
        }[];
    }

    let globalReport:GlobalReport = {
        'Capa de persistencia': [],
        'Capa de lógica': [],
        'Capa de controladores': []
    };

    for (const javaFileContent of javaFilesContent) {
        const path = javaFileContent.filePath.split(proyecto)[1];
        const fileReport = checkJavaRules(javaFileContent.content, path);
        for (const category in fileReport) {
            globalReport[category] = globalReport[category].concat(fileReport[category]);
        }
    }

    // Solo deja las capas seleccionadas en el config
    for (const category in globalReport) {
        if (!selectedLayerRulesSpringBoot.includes(category)) {
            delete globalReport[category];
        }
    }

    // Solo deja las reglas con severidad seleccionada en el config
    for (const category in globalReport) {
        globalReport[category] = globalReport[category].filter(rule => selectedSeverityRules.includes(rule.severity));
    }

    // Vuelve selectedRules a un array de int correspondiente al id de la regla 
    let selectedRulesInt: number[] = [];
    for (const rule of selectedRules) {
        if(rule === "Todos los atributos de las entidades son objetos") {
            selectedRulesInt.push(1);
        }
        else if(rule === "Todas las entidades tienen la anotación @Data") {
            selectedRulesInt.push(2);
        }
        else if(rule === "Todas las clases de lógica tienen la anotación @Service") {
            selectedRulesInt.push(3);
        }
        else if(rule === "Todos los atributos de las clases de lógica tienen la anotación @Autowired") {
            selectedRulesInt.push(4);
        }
        else if(rule === "Todas las clases de controladores tienen la anotación @Controller") {
            selectedRulesInt.push(5);
        }
        else if(rule === "Todas las clases de controladores tienen la anotación @RequestMapping") {
            selectedRulesInt.push(6);
        }
        else if(rule === "Todos los atributos de las clases de controladores tienen la anotación @Autowired") {
            selectedRulesInt.push(7);
        }
        else if(rule === "Todas las clases DTO y DetailDTO tienen la anotación @Data") {
            selectedRulesInt.push(8);
        }
        else if(rule === "Todos los atributos de la clase son serializables") {
            selectedRulesInt.push(9);
        }
        else if(rule === "Todos los métodos de tipo GET deben retornar atributos de tipo DetailDTO") {
            selectedRulesInt.push(10);
        }
    }
    // Solo deja las reglas seleccionadas en el config
    for (const category in globalReport) {
        for (const rule of globalReport[category]) {
            var esta = false;
            for(const ruleInt of selectedRulesInt) {
                if(rule.id.toString() === ruleInt.toString()) {
                    esta = true;
                }
            }
            if(!esta) {
                globalReport[category] = globalReport[category].filter(item => item.id !== rule.id);
            }
        }
    }

    // Ordena globalReport por severidad
    for (const category in globalReport) {
        globalReport[category].sort((a, b) => {
            if (a.severity === 'Grave' && (b.severity === 'Leve' || b.severity === 'Moderado')) {
                return -1;
            } else if (a.severity === 'Leve' && (b.severity === 'Grave' || b.severity === 'Moderado')) {
                return 1;
            } else if (a.severity === 'Moderado' && (b.severity === 'Grave')) {
                return 1;
            } else if (a.severity === 'Moderado' && (b.severity === 'Leve')) {
                return -1;
            }
            else {
                return 0;
            }
        });
    }
    Reportpanel.createOrShow(context?.extensionUri || '', proyecto, globalReport);
    return globalReport;
}