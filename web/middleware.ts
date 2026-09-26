import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

interface CookieToSet {
  name: string;
  value: string;
  options?: CookieOptions;
}

// Percorsi pubblici esatti: il confronto è per uguaglianza ("/" con startsWith matcherebbe tutto).
const PUBLIC_EXACT_PATHS = ["/", "/offline", "/login", "/registrati", "/auth/callback", "/circuiti"];
// Prefissi pubblici: il confronto richiede il separatore ("/circuiti/monza" sì, "/circuitiX" no),
// così un percorso che inizia per caso con lo stesso testo non eredita l'esenzione dal login.
const PUBLIC_PREFIX_PATHS = ["/auth/callback/", "/circuiti/"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublic =
    PUBLIC_EXACT_PATHS.includes(request.nextUrl.pathname) ||
    PUBLIC_PREFIX_PATHS.some((path) => request.nextUrl.pathname.startsWith(path));

  if (!user && !isPublic) {
    // Le API rispondono in JSON: un rinvio alla pagina di login darebbe al chiamante una pagina HTML
    // che non puo' leggere, mentre un 401 gli permette di mostrare l'errore di sessione.
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/registrati")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // manifest.webmanifest e sw.js vanno esclusi esplicitamente: sono file statici che il browser
  // richiede senza sessione, e passando dal middleware verrebbero rimandati al login — con il
  // risultato che l'app non risulterebbe mai installabile.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
