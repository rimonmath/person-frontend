export type ErrorResponse = {
	message?: string;
	code?: number;
	data?: Record<string, unknown> | null;
	error?: unknown[];
	success?: boolean;
	redirect?: string;
	[key: string]: unknown;
};

export type SuccessResponse = {
	message: string;
	redirect?: string;
	id?: number;
	result?: any;
};

export type SigninResponse = SuccessResponse & {
	accessToken: string;
	redirect: string;
};

export type Person = {
	id?: string;
	_id: string;
	first_name: string;
	last_name: string;
	email: string;
	gender: 'Male' | 'Female' | 'Other';
	address: string;
};

export type User = {
	full_name: string;
	email: string;
	userType: string;
};
