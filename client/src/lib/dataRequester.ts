export type requestResultType = {
    statusCode: number,
    message: string,
    details: string | object | null
}

export const requestData = async <T>(
    { url, method, body }: 
    { 
        url: string, 
        method: string, 
        body?: object 
    }
)=> {
    const requestOption: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    };

    if (['POST', 'PUT', 'DELETE'].includes(method) && body) {
        requestOption.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, requestOption);

        // Check if response is not OK
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message);
        }

        const data = await response.json() as T;

        // return the response if success
        return data;
    } catch (error) {
        if(error instanceof Error){
            console.error('Request error:', error);
            throw new Error(`${error.message}`);
        }
    }
};
