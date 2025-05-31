// lib/auth.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from './dbConnect'
import UserModel from './models/UserModel'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

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
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
          }
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

// Higher-order function that wraps API route handlers with authentication
export const auth = (handler: (req: any, context?: any) => Promise<Response>) => {
  return async (req: NextRequest, context?: any) => {
    const session = await getServerSession(authOptions)
    
    // Create enhanced request object with auth info
    const enhancedReq = {
      ...req,
      auth: session ? { user: session.user } : null,
      json: () => req.json(),
    }
    
    return handler(enhancedReq, context)
  }
}

// Utility function to get session (for use in components or other places)
export const getSession = async () => {
  return await getServerSession(authOptions)
}