import { indent } from "./indent.js";


/* eslint-disable @typescript-eslint/no-explicit-any */


type MongoServerError = {
	errorResponse: {
		errmsg: string;
		errInfo?: {
			[key: string]: any;
		};
	};
	isMongoServerError?: true;
	[key: string]: any;
};

export function handleMongoError<E extends MongoServerError>(error: E): E;
export function handleMongoError(error: any): any;
export function handleMongoError(error: any) {
	
	try {
		const documentFailedValidationResponses =
			("writeErrors" in error ? error.writeErrors : [ error.errorResponse ])
				.filter((errorResponse: MongoServerError["errorResponse"]) => errorResponse.errmsg === "Document failed validation");
		
		if (documentFailedValidationResponses.length)
			error.message += `\n${
				documentFailedValidationResponses.map(
					(errorResponse: MongoServerError["errorResponse"]) =>
						indent(
							`failingDocumentId: ${errorResponse.errInfo?.failingDocumentId}\n` +
							`schemaRulesNotSatisfied: ${JSON.stringify(errorResponse.errInfo?.details?.schemaRulesNotSatisfied, null, "  ")}`,
							"  "
						)
				).join("\n")
			}`;
		
		error.isMongoServerError = true;
	} catch {}
	
	return error;
}
