import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {

  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/" || path === "/sign-in" || path === "/sign-up" || path === "/verify-code";

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  if(token && isPublicPath){
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  if(!isPublicPath && !token){
    return NextResponse.redirect(new URL("/sign-in", request.nextUrl));
  }

  
  return NextResponse.next();

}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up", "/dashboard/:path*", "/verify-code"],
};
