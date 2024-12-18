// this file is going to check if the bearer token from the clientSite, from the postman is passed or not.

const validate = (token: any) => {
    const validToken = true;
    if(!validToken || !token) {
        return false;
    }
    return true;
}

export function authMiddleware(req: Request): any {
    const token = req.headers.get("authorization")?.split(" ")[1];

    return {isValid: validate(token)};
}