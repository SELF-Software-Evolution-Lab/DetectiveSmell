/* eslint-disable eqeqeq */
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { analyzeSpringBootProject } from '../frameworks/springBoot'; 

suite('Extension Test Suite', () => {
    let context: vscode.ExtensionContext;

    suite('SpringBoot', () => {

		const rulesFilePath = path.join(__dirname, '../../src/frameworks/rules/rulesSpringboot.json');
    	const rulesSpringBootContent = fs.readFileSync(rulesFilePath, 'utf8');
		const rulesSpringBoot = JSON.parse(rulesSpringBootContent);
		const selectedRules = [
            "Todos los atributos de las entidades son objetos",
            "Todas las entidades tienen la anotación @Data",
            "Todas las clases de lógica tienen la anotación @Service",
            "Todos los atributos de las clases de lógica tienen la anotación @Autowired",
            "Todas las clases de controladores tienen la anotación @Controller",
            "Todas las clases de controladores tienen la anotación @RequestMapping",
            "Todos los atributos de las clases de controladores tienen la anotación @Autowired",
            "Todas las clases DTO y DetailDTO tienen la anotación @Data",
            "Todos los atributos de la clase son serializables",
            "Todos los métodos de tipo GET deben retornar atributos de tipo DetailDTO"
        ];
		const selectedSeverityRules =[
            "Leve",
            "Moderado",
            "Grave"
        ];
		const selectedLayerRules = [
            "Capa de persistencia",
            "Capa de lógica",
            "Capa de controladores"
        ];

        test('Should identify the first rule', () => {
            const source = path.join(__dirname, '../../src/test/spring/first'); 

            const report = analyzeSpringBootProject(source, rulesSpringBoot, selectedRules, selectedSeverityRules, selectedLayerRules, context);

            assert.strictEqual(report['Capa de persistencia'].length, 1);
            assert.ok(report['Capa de persistencia'][0].id == 1);
        });

		test('Should identify the second rule', () => {
            const source = path.join(__dirname, '../../src/test/spring/second'); 

            const report = analyzeSpringBootProject(source, rulesSpringBoot, selectedRules, selectedSeverityRules, selectedLayerRules, context);

            assert.strictEqual(report['Capa de persistencia'].length, 1);
            assert.ok(report['Capa de persistencia'][0].id == 2);
        });

		test('Should identify the third rule', () => {
            const source = path.join(__dirname, '../../src/test/spring/third'); 

            const report = analyzeSpringBootProject(source, rulesSpringBoot, selectedRules, selectedSeverityRules, selectedLayerRules, context);

            assert.strictEqual(report['Capa de lógica'].length, 1);
            assert.ok(report['Capa de lógica'][0].id == 3);
        });

		test('Should identify the fourth rule', () => {
            const source = path.join(__dirname, '../../src/test/spring/fourth'); 

            const report = analyzeSpringBootProject(source, rulesSpringBoot, selectedRules, selectedSeverityRules, selectedLayerRules, context);

            assert.strictEqual(report['Capa de lógica'].length, 1);
            assert.ok(report['Capa de lógica'][0].id == 4);
        });

		test('Should identify the fifth rule', () => {
            const source = path.join(__dirname, '../../src/test/spring/fifth'); 

            const report = analyzeSpringBootProject(source, rulesSpringBoot, selectedRules, selectedSeverityRules, selectedLayerRules, context);

            assert.strictEqual(report['Capa de controladores'].length, 1);
            assert.ok(report['Capa de controladores'][0].id == 5);
        });

		test('Should identify the sixth rule', () => {
			const source = path.join(__dirname, '../../src/test/spring/sixth'); 

			const report = analyzeSpringBootProject(source, rulesSpringBoot, selectedRules, selectedSeverityRules, selectedLayerRules, context);

			assert.strictEqual(report['Capa de controladores'].length, 1);
			assert.ok(report['Capa de controladores'][0].id == 6);
		});

		test('Should identify the seventh rule', () => {
			const source = path.join(__dirname, '../../src/test/spring/seventh');

			const report = analyzeSpringBootProject(source, rulesSpringBoot, selectedRules, selectedSeverityRules, selectedLayerRules, context);

			assert.strictEqual(report['Capa de controladores'].length, 1);
			assert.ok(report['Capa de controladores'][0].id == 7);
		});

		test('Should identify the eighth rule', () => {
			const source = path.join(__dirname, '../../src/test/spring/eighth');

			const report = analyzeSpringBootProject(source, rulesSpringBoot, selectedRules, selectedSeverityRules, selectedLayerRules, context);

			assert.strictEqual(report['Capa de persistencia'].length, 1);
			assert.ok(report['Capa de persistencia'][0].id == 8);
		});

		test('Should identify the ninth rule', () => {
			const source = path.join(__dirname, '../../src/test/spring/ninth');

			const report = analyzeSpringBootProject(source, rulesSpringBoot, selectedRules, selectedSeverityRules, selectedLayerRules, context);

			assert.strictEqual(report['Capa de persistencia'].length, 1);
			assert.ok(report['Capa de persistencia'][0].id == 9);
		});

		test('Should identify the tenth rule', () => {
			const source = path.join(__dirname, '../../src/test/spring/tenth');

			const report = analyzeSpringBootProject(source, rulesSpringBoot, selectedRules, selectedSeverityRules, selectedLayerRules, context);

			assert.strictEqual(report['Capa de controladores'].length, 1);
			assert.ok(report['Capa de controladores'][0].id == 10);
		});

		test('Should not identify any broken rule', () => {
			const source = path.join(__dirname, '../../src/test/spring/escenario1');

			const report = analyzeSpringBootProject(source, rulesSpringBoot, selectedRules, selectedSeverityRules, selectedLayerRules, context);

			assert.strictEqual(report['Capa de controladores'].length, 0);
			assert.strictEqual(report['Capa de lógica'].length, 0);
			assert.strictEqual(report['Capa de persistencia'].length, 0);
		});

		test('Should identify every rule', () => {
			const source = path.join(__dirname, '../../src/test/spring/escenario2');

			let report = analyzeSpringBootProject(source, rulesSpringBoot, selectedRules, selectedSeverityRules, selectedLayerRules, context);

			report['Capa de controladores'].sort((a, b) => a.id - b.id);
			report['Capa de lógica'].sort((a, b) => a.id - b.id);
			report['Capa de persistencia'].sort((a, b) => a.id - b.id);

			assert.strictEqual(report['Capa de controladores'].length, 4);
			assert.ok(report['Capa de controladores'][0].id == 5);
			assert.ok(report['Capa de controladores'][1].id == 6);
			assert.ok(report['Capa de controladores'][2].id == 7);
			assert.ok(report['Capa de controladores'][3].id == 10);

			assert.strictEqual(report['Capa de lógica'].length, 2);
			assert.ok(report['Capa de lógica'][0].id == 3);
			assert.ok(report['Capa de lógica'][1].id == 4);

			assert.strictEqual(report['Capa de persistencia'].length, 4);
			assert.ok(report['Capa de persistencia'][0].id == 1);
			assert.ok(report['Capa de persistencia'][1].id == 2);
			assert.ok(report['Capa de persistencia'][2].id == 8);
			assert.ok(report['Capa de persistencia'][3].id == 9);
		});

		test('Should identify a rule per layer', () => {
			const source = path.join(__dirname, '../../src/test/spring/escenario3');

			let report = analyzeSpringBootProject(source, rulesSpringBoot, selectedRules, selectedSeverityRules, selectedLayerRules, context);

			report['Capa de controladores'].sort((a, b) => a.id - b.id);
			report['Capa de lógica'].sort((a, b) => a.id - b.id);
			report['Capa de persistencia'].sort((a, b) => a.id - b.id);

			assert.strictEqual(report['Capa de controladores'].length, 1);
			assert.ok(report['Capa de controladores'][0].id == 10);

			assert.strictEqual(report['Capa de lógica'].length, 1);
			assert.ok(report['Capa de lógica'][0].id == 4);

			assert.strictEqual(report['Capa de persistencia'].length, 1);
			assert.ok(report['Capa de persistencia'][0].id == 8);
		});
    });
});
