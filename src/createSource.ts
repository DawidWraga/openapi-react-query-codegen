import ts from 'typescript';
import { createImports } from './createImports';
import { createExports } from './createExports';
import { createGetQueryClient } from './createGetQueryClient';
import { createPrefetchQuery } from './createPrefetchQuery';

const createSourceFile = (statements: readonly ts.Statement[]) => {
	return ts.factory.createSourceFile(
		statements,
		ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
		ts.NodeFlags.None
	);
};

export const createSource = (outputPath: string) => {
	const resultFile = ts.createSourceFile(
		'index.tsx',
		'',
		ts.ScriptTarget.Latest,
		false,
		ts.ScriptKind.TS
	);

	const getQueryClientFile = ts.createSourceFile(
		'get-query-client.ts',
		'',
		ts.ScriptTarget.Latest,
		false,
		ts.ScriptKind.TS
	);

	const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

	const result = printer.printNode(
		ts.EmitHint.Unspecified,
		createSourceFile([
			...createImports(outputPath),
			...createExports(outputPath),
		]),
		resultFile
	);

	const getQueryClient = printer.printNode(
		ts.EmitHint.Unspecified,
		createSourceFile([...createGetQueryClient()]),
		getQueryClientFile
	);

	const prefetchQueryFile = ts.createSourceFile(
		'prefetch-query.tsx',
		'',
		ts.ScriptTarget.Latest,
		false,
		ts.ScriptKind.TS
	);

	const prefetchQuery = printer.printNode(
		ts.EmitHint.Unspecified,
		createSourceFile([...createPrefetchQuery()]),
		prefetchQueryFile
	);

	return { queries: result, getQueryClient, prefetchQuery };
};
