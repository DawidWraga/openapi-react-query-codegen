import ts from 'typescript';
import { capitalizeFirstLetter } from './common';

export const createUseMutation = (
	node: ts.SourceFile,
	className: string,
	method: ts.MethodDeclaration
) => {
	const methodName = method.name?.getText(node)!;
	return ts.factory.createVariableStatement(
		[ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
		ts.factory.createVariableDeclarationList(
			[
				ts.factory.createVariableDeclaration(
					ts.factory.createIdentifier(
						`use${className}${capitalizeFirstLetter(methodName)}`
					),
					undefined,
					undefined,
					ts.factory.createArrowFunction(
						undefined,
						undefined,
						[
							ts.factory.createParameterDeclaration(
								undefined,
								undefined,
								ts.factory.createIdentifier('options'),
								ts.factory.createToken(ts.SyntaxKind.QuestionToken),
								ts.factory.createTypeReferenceNode(
									ts.factory.createIdentifier('Omit'),
									[
										ts.factory.createTypeReferenceNode(
											ts.factory.createIdentifier('UseMutationOptions'),
											[
												ts.factory.createTypeReferenceNode(
													ts.factory.createIdentifier('Awaited'),
													[
														ts.factory.createTypeReferenceNode(
															ts.factory.createIdentifier('ReturnType'),
															[
																ts.factory.createTypeQueryNode(
																	ts.factory.createQualifiedName(
																		ts.factory.createIdentifier(className),
																		ts.factory.createIdentifier(methodName)
																	),
																	undefined
																),
															]
														),
													]
												),
												ts.factory.createKeywordTypeNode(
													ts.SyntaxKind.UnknownKeyword
												),
												method.parameters.length !== 0
													? ts.factory.createTypeReferenceNode(
															method.parameters[0].type?.getFullText(node) ??
																'any'
													  )
													: ts.factory.createKeywordTypeNode(
															ts.SyntaxKind.VoidKeyword
													  ),
												ts.factory.createKeywordTypeNode(
													ts.SyntaxKind.UnknownKeyword
												),
											]
										),
										ts.factory.createLiteralTypeNode(
											ts.factory.createStringLiteral('mutationFn')
										),
									]
								),
								undefined
							),
						],
						undefined,
						ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
						ts.factory.createCallExpression(
							ts.factory.createIdentifier('useMutation'),
							undefined,
							[
								ts.factory.createArrowFunction(
									undefined,
									undefined,
									method.parameters.length !== 0
										? [
												ts.factory.createParameterDeclaration(
													undefined,
													undefined,
													ts.factory.createObjectBindingPattern(
														method.parameters.map((param) => {
															return ts.factory.createBindingElement(
																undefined,
																undefined,
																ts.factory.createIdentifier(
																	flattenObject(param.name.getText(node))
																),
																undefined
															);
														})
													),
													undefined,
													undefined,
													undefined
												),
										  ]
										: [],
									undefined,
									ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
									ts.factory.createCallExpression(
										ts.factory.createPropertyAccessExpression(
											ts.factory.createIdentifier(className),
											ts.factory.createIdentifier(methodName)
										),
										undefined,
										method.parameters.map((params) => {
											return ts.factory.createIdentifier(
												params.name.getText(node)
											);
										})
									)
								),
								ts.factory.createIdentifier('options'),
							]
						)
					)
				),
			],
			ts.NodeFlags.Const
		)
	);
};

function flattenObject(str: string) {
	return str.replace('{', '').replace('}', '');
}
