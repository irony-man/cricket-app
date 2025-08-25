interface ErrorData extends Record<string, object | string> {
    detail?: string;
    [key: string]: object;
}

class BaseHttpError extends Error {
    public data: ErrorData | null;
    public statusCode: number;

    constructor(message: string, data: ErrorData | null, statusCode: number) {
        super(message);
        this.data = data;
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

export class HttpBadRequestError extends BaseHttpError {}
export class HttpNotFoundError extends BaseHttpError {}
export class HttpNotOkError extends BaseHttpError {}
export class HttpServerError extends BaseHttpError {}

async function execute<T>(url: string, options: RequestInit): Promise<T> {
    let response: Response;

    try {
        response = await fetch(url, options);
    } catch (error) {
        console.error("Network request failed:", error);
        throw new HttpServerError(
            "A network error occurred. Please check your connection.",
            null,
            503
        );
    }

    let data: object | ErrorData | null = null;
    if (response.status !== 204) {
        const contentType = response.headers.get("Content-Type") || "";
        try {
            if (contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = { detail: await response.text() };
            }
        } catch (e) {
            throw new HttpServerError(
                "Error parsing server response.",
                e as ErrorData,
                response.status
            );
        }
    }

    if (!response.ok) {
        const errorMessage = data?.detail || response.statusText;
        switch (response.status) {
            case 400:
                throw new HttpBadRequestError(errorMessage, data, 400);
            case 404:
                throw new HttpNotFoundError(
                    "The requested resource was not found.",
                    data,
                    404
                );
            case 500:
                throw new HttpServerError(
                    "An internal server error occurred.",
                    data,
                    500
                );
            default:
                throw new HttpNotOkError(errorMessage, data, response.status);
        }
    }

    return data as T;
}

export async function getRequest<T>(
    url: string,
    queryParams: Record<string, string> | null = null
): Promise<T> {
    const options: RequestInit = {
        method: "GET",
        credentials: "same-origin",
        headers: { Accept: "application/json" },
    };

    let finalUrl = url;
    if (queryParams) {
        const params = new URLSearchParams(queryParams);
        finalUrl = `${url}?${params.toString()}`;
    }

    return execute<T>(finalUrl, options);
}

async function mutationRequest<T>(
    method: string,
    url: string,
    body: object
): Promise<T> {
    const isFormData = body instanceof FormData;
    const headers: HeadersInit = {
        Accept: "application/json",
    };

    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    const options: RequestInit = {
        method,
        credentials: "same-origin",
        headers,
        body: isFormData ? body : JSON.stringify(body),
    };

    return execute<T>(url, options);
}

export async function postRequest<T>(
    url: string,
    body: object = {}
): Promise<T> {
    return mutationRequest<T>("POST", url, body);
}

export async function patchRequest<T>(
    url: string,
    body: object = []
): Promise<T> {
    return mutationRequest<T>("PATCH", url, body);
}

export async function deleteRequest<T>(url: string): Promise<T> {
    const options: RequestInit = {
        method: "DELETE",
        credentials: "same-origin",
        headers: {
            Accept: "application/json",
        },
    };
    return execute<T>(url, options);
}

export function getUrl(resourceName: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    return `${baseUrl}/${resourceName}/`;
}