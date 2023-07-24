import { generate as generateTSClients } from 'openapi-typescript-codegen';
import { print } from './print';
import { CLIOptions } from './cli';
import path from 'path';
import { createSource } from './createSource';
import { defaultOutputPath, requestsOutputPath } from './constants';

export async function generate(options: CLIOptions) {
	const openApiOutputPath = path.join(
		options.output ?? defaultOutputPath,
		requestsOutputPath
	);

	await generateTSClients({
		...options,
		useOptions: true,
		httpClient: options.client,
		output: openApiOutputPath,
	});
	const { queries, getQueryClient, prefetchQuery } =
		createSource(openApiOutputPath);
	print(queries, options);
	print(getQueryClient, options, 'get-query-client.ts');
	print(prefetchQuery, options, 'prefetch-query.tsx');
	// print(get, options);
}
