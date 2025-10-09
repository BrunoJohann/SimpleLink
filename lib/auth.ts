import { prisma } from '@/lib/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        // MailHog não requer autenticação
        auth:
          process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD
            ? {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
              }
            : undefined,
        secure: false, // MailHog não usa TLS
        tls: {
          rejectUnauthorized: false, // Para desenvolvimento
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Após login bem-sucedido, redirecionar para o dashboard
      if (url.startsWith(baseUrl)) {
        // Se for uma URL relativa do mesmo domínio
        if (url.includes('/login') || url.includes('/api/auth')) {
          return `${baseUrl}/dashboard`
        }
        return url
      }
      // Se for uma URL externa ou callback, redirecionar para o dashboard
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/dashboard`
      }
      return `${baseUrl}/dashboard`
    },
  },
  pages: {
    signIn: '/login',
    verifyRequest: '/login', // Página após enviar o email
    error: '/login', // Página de erro
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  debug: process.env.NODE_ENV === 'development',
}
