import ts from 'typescript';
import { capitalizeFirstLetter } from './common';

export const createUseQuery = (
	node: ts.SourceFile,
	className: string,
	method: ts.MethodDeclaration
) => {
	const methodName = method.name?.getText(node)!;
	const customHookName = `use${className}${capitalizeFirstLetter(methodName)}`;
	const queryKey = `${customHookName}Key`;

	const queryKeyGenericType = ts.factory.createTypeReferenceNode(
		'TQueryKey',
		undefined
	);
	const queryKeyConstraint = ts.factory.createTypeReferenceNode('Array', [
		ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
	]);

	return [
		ts.factory.createVariableStatement(
			[ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
			ts.factory.createVariableDeclarationList(
				[
					ts.factory.createVariableDeclaration(
						ts.factory.createIdentifier(queryKey),
						undefined,
						undefined,
						ts.factory.createStringLiteral(
							`${className}${capitalizeFirstLetter(methodName)}`
						)
					),
				],
				ts.NodeFlags.Const
			)
		),
		ts.factory.createVariableStatement(
			[ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
			ts.factory.createVariableDeclarationList(
				[
					ts.factory.createVariableDeclaration(
						ts.factory.createIdentifier(customHookName),
						undefined,
						undefined,
						ts.factory.createArrowFunction(
							undefined,
							ts.factory.createNodeArray([
								ts.factory.createTypeParameterDeclaration(
									undefined,
									'TQueryKey',
									queryKeyConstraint,
									ts.factory.createArrayTypeNode(
										ts.factory.createKeywordTypeNode(
											ts.SyntaxKind.UnknownKeyword
										)
									)
								),
							]),
							[
								ts.factory.createParameterDeclaration(
									undefined,
									undefined,
									ts.factory.createIdentifier('params'),
									!method.parameters || !method.parameters.length
										? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
										: undefined,
									!method.parameters || !method.parameters.length
										? // never | null
										  ts.factory.createTypeReferenceNode('null')
										: // Parameters<typeof DefaultClient.findPets>[0]
										  ts.factory.createIndexedAccessTypeNode(
												ts.factory.createTypeReferenceNode(
													ts.factory.createIdentifier('Parameters'),
													[
														ts.factory.createTypeQueryNode(
															ts.factory.createQualifiedName(
																ts.factory.createIdentifier(className),
																ts.factory.createIdentifier(methodName)
															)
														),
													]
												),
												ts.factory.createLiteralTypeNode(
													ts.factory.createNumericLiteral('0')
												)
										  )
								),

								ts.factory.createParameterDeclaration(
									undefined,
									undefined,
									ts.factory.createIdentifier('options'),
									ts.factory.createToken(ts.SyntaxKind.QuestionToken),
									ts.factory.createTypeReferenceNode(
										ts.factory.createIdentifier('Omit'),
										[
											ts.factory.createTypeReferenceNode(
												ts.factory.createIdentifier('UseQueryOptions'),
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
													ts.factory.createArrayTypeNode(
														ts.factory.createKeywordTypeNode(
															ts.SyntaxKind.UnknownKeyword
														)
													),
												]
											),
											ts.factory.createUnionTypeNode([
												ts.factory.createLiteralTypeNode(
													ts.factory.createStringLiteral('queryKey')
												),
												ts.factory.createLiteralTypeNode(
													ts.factory.createStringLiteral('queryFn')
												),
												ts.factory.createLiteralTypeNode(
													ts.factory.createStringLiteral('initialData')
												),
											]),
										]
									)
								),
								ts.factory.createParameterDeclaration(
									undefined,
									undefined,
									ts.factory.createIdentifier('queryKey'),
									ts.factory.createToken(ts.SyntaxKind.QuestionToken),
									queryKeyGenericType
								),
							],
							undefined,
							ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
							ts.factory.createCallExpression(
								ts.factory.createIdentifier('useQuery'),
								undefined,
								[
									ts.factory.createArrayLiteralExpression(
										[
											ts.factory.createIdentifier(queryKey),
											ts.factory.createSpreadElement(
												ts.factory.createParenthesizedExpression(
													ts.factory.createBinaryExpression(
														ts.factory.createIdentifier('queryKey'),
														ts.factory.createToken(
															ts.SyntaxKind.QuestionQuestionToken
														),
														ts.factory.createArrayLiteralExpression([
															ts.factory.createIdentifier('params'),
														])
													)
												)
											),
										],
										false
									),
									ts.factory.createArrowFunction(
										undefined,
										undefined,
										[],
										undefined,
										ts.factory.createToken(
											ts.SyntaxKind.EqualsGreaterThanToken
										),
										ts.factory.createCallExpression(
											ts.factory.createPropertyAccessExpression(
												ts.factory.createIdentifier(className),
												ts.factory.createIdentifier(methodName)
											),
											undefined,
											method.parameters.length > 0
												? [ts.factory.createIdentifier('params')]
												: []
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
		),
	];
};
