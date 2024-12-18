import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/authMiddleware";
import { logMiddleware } from "./middlewares/api/logMiddleware";

export const config = {
    matcher: "/api/:path*",
}

export default function middleware(request: Request) {
    if(request.url.includes("/api/blogs")){
        const logResult = logMiddleware(request);
        console.log(logResult.response); 
    }

    // Apply authentication middleware before processing the request.
    const authResult = authMiddleware(request);
    if(!authResult?.isValid) {
        return new NextResponse("Unauthorized", {status: 401})
    }

    return NextResponse.next();
}