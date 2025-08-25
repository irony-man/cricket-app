import {
    getRequest,
    getUrl,
    postRequest,
    patchRequest,
    deleteRequest,
} from "./network";

interface QueryParams {
    [key: string]: string | number | boolean;
}

interface UpdatePayload<T> {
    [key: string]: number;
    formData: T;
}

const createApiActions = <T extends { id?: string }>(resourceName: string) => {
    const resourceUrl = getUrl(resourceName);

    return {
        async list(query?: QueryParams): Promise<T[]> {
            return await getRequest<T[]>(
                resourceUrl,
                query as Record<string, string>
            );
        },

        async listNested<U>(
            actionName: string,
            query?: QueryParams
        ): Promise<U> {
            const url = `${resourceUrl}${actionName}/`;
            return await getRequest<U>(url, query as Record<string, string>);
        },

        async get(id: number): Promise<T> {
            const url = `${resourceUrl}${id}/`;

            return await getRequest<T>(url);
        },

        async getNested<U>(
            id: number,
            actionName: string,
            query?: QueryParams
        ): Promise<U> {
            const url = `${resourceUrl}${id}/${actionName}/`;
            return await getRequest<U>(url, query as Record<string, string>);
        },

        async create(formData: T): Promise<T> {
            return await postRequest<T>(resourceUrl, formData);
        },

        async createNested<T>(
            id: number,
            actionName: string,
            formData: T
        ): Promise<T> {
            const url = `${resourceUrl}${id}/${actionName}/`;
            return await postRequest<T>(url, formData);
        },

        async update({ id, formData }: UpdatePayload<T>): Promise<T> {
            const url = `${resourceUrl}${id}/`;
            return await patchRequest<T>(url, formData);
        },

        async updateNested<T>({
            id,
            actionName,
            formData,
        }: UpdatePayload<T>): Promise<T> {
            const url = `${resourceUrl}${id}/${actionName}/`;
            return await patchRequest<T>(url, formData);
        },

        async delete(id: number): Promise<void> {
            const url = `${resourceUrl}${id}/`;
            return await deleteRequest<void>(url);
        },

        async createOrUpdate({
            id,
            formData,
        }: {
            id?: number;
            formData: T;
        }): Promise<T> {
            if (id) {
                return this.update({ id, formData });
            }
            return this.create(formData);
        },

        async createOrUpdateNested<T>({
            id,
            actionName,
            formData,
        }: {
            id?: number;
            actionName: string;
            formData: T;
        }): Promise<T> {
            if (id) {
                return this.updateNested({ id, actionName, formData });
            }
            return this.createNested(id, actionName, formData);
        },

        async createOrDelete({
            id,
            formData,
        }: {
            id?: string;
            formData: T;
        }): Promise<T | void> {
            if (id) {
                return this.delete(id);
            }
            return this.create(formData);
        },
    };
};

const actions = {
    teams: createApiActions("teams"),
    players: createApiActions("players"),
    matches: {
        ...createApiActions("matches"),
        startMatch: (formData: T) =>
            createApiActions("matches/start").create(formData),
    },
};

export default actions;
