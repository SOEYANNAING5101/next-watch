import { NextRequest, NextResponse } from "next/server";

export async function middleware(request:NextRequest) {
    const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`,{
        headers:{
            cookie:request.headers.get("cookie")|| ""
        }
    });
    if (!response.ok){
        return NextResponse.redirect(new URL("/signup",request.url))
    }
    const data = await response.json();
    if (!data || !data.session){
        return NextResponse.redirect(new URL("/signup",request.url))
    }
    return NextResponse.next();
}
export const config = {
    matcher: ["/my-list"],
}