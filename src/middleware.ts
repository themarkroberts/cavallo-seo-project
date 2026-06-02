import { NextRequest, NextResponse } from "next/server";
import { clients } from "@/lib/clients";

export function middleware(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const clientSlug = segments[0];

  if (!clientSlug || !clients[clientSlug]) {
    return NextResponse.next();
  }

  const tokenParam = request.nextUrl.searchParams.get("k");
  const tokenCookie = request.cookies.get("portal_token")?.value;
  const expectedToken = process.env.PORTAL_ACCESS_TOKEN;

  if (!expectedToken) {
    return new NextResponse(null, { status: 404 });
  }

  if (tokenParam === expectedToken) {
    const url = new URL(request.nextUrl.pathname, request.url);
    const response = NextResponse.redirect(url);
    response.cookies.set("portal_token", expectedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
    });
    return response;
  }

  if (tokenCookie === expectedToken) {
    return NextResponse.next();
  }

  return new NextResponse(null, { status: 404 });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
