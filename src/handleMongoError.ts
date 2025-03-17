import { indent } from "./indent";


/* eslint-disable @typescript-eslint/no-explicit-any */


type MongoServerError = {
	errorResponse: {
		errmsg: string;
		errInfo?: {
			[key: string]: any;
		};
	};
	[key: string]: any;
};

function isMongoServerError(error: unknown): error is MongoServerError {
	return (
		!!error &&
		typeof error == "object" &&
		"errorResponse" in error &&
		!!error.errorResponse &&
		typeof error.errorResponse == "object" &&
		"errInfo" in error.errorResponse
	);
}

export function handleMongoError<E extends MongoServerError>(error: E): E;
export function handleMongoError(error: any): any;
export function handleMongoError(error: any) {
	if (isMongoServerError(error) && error.errorResponse.errmsg === "Document failed validation")
		error.message = `${error.errorResponse.errmsg}\n${indent(`failingDocumentId: ${error.errorResponse.errInfo?.failingDocumentId}\nschemaRulesNotSatisfied: ${JSON.stringify(error.errorResponse.errInfo?.details?.schemaRulesNotSatisfied, null, "  ")}`, "  ")}`;
	
	return error;
}
