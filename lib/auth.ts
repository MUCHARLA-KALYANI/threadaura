// lib/auth.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from './dbConnect'
import UserModel from './models/UserModel'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect()
        if (!credentials) return null

        const user = await UserModel.findOne({ email: credentials.email })
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return user
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    newUser: '/register',
    error: '/signin',
  },
  callbacks: {
    async jwt({ user, token, trigger, session }: any) {
      if (user) {
        token.user = {
          _id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        }
      }
      if (trigger === 'update' && session) {
        token.user = {
          ...token.user,
          email: session.user.email,
          name: session.user.name,
        }
      }
      return token
    },
    async session({ session, token }: any) {
      if (token?.user) {
        session.user = token.user
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } // For your /api/auth route


export const auth = async (req: any) => {
  const session = await getServerSession(authOptions)
  return {
    auth: session ? { user: session.user } : null,
  }
}