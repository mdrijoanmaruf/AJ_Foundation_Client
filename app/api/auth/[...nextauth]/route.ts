import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("NextAuth: Missing credentials");
          return null;
        }

        try {
          console.log("NextAuth: Attempting login for:", credentials.email);
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();
          console.log("NextAuth: Backend response status:", res.status);
          console.log("NextAuth: Backend response data:", data);

          if (res.ok && data.user) {
            const userWithRole = {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              image: data.user.image,
              role: data.user.role || 'user',
              token: data.token,
            };
            console.log("NextAuth: Login successful for:", credentials.email, "with role:", userWithRole.role);
            return userWithRole;
          }

          console.log("NextAuth: Login failed - response not ok or no user data");
          return null;
        } catch (error) {
          console.error("NextAuth: Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              image: user.image,
              googleId: account.providerAccountId,
            }),
          });

          const data = await res.json();

          if (res.ok && data.user) {
            (user as any).id = data.user.id;
            (user as any).token = data.token;
            (user as any).role = data.user.role || 'user';
            console.log("NextAuth Google: Set role", (user as any).role, "for user:", user.email);
            return true;
          }

          return false;
        } catch (error) {
          console.error("Google auth error:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.token = (user as any).token;
        token.role = (user as any).role || 'user';
        console.log("NextAuth JWT: Setting token with role:", token.role, "for user:", token.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session as any).token = token.token;
        (session.user as any).role = (token as any).role || 'user';
        console.log("NextAuth Session: Setting session with role:", (session.user as any).role, "for user:", session.user.email);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
