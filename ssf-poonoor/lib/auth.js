const connectDB = require('./db')
const { resolvePermissions } = require('./permissions')

function getModels() {
  return {
    User: require('../models/User'),
  }
}

function getCredentialsProvider() {
  const pkg = require('next-auth/providers/credentials')
  return pkg.default ?? pkg
}

const authOptions = {
  providers: [
    getCredentialsProvider()({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        await connectDB()
        const { User } = getModels()
        const bcrypt = require('bcrypt')

        const user = await User.findOne({
          username: credentials.username,
          isDeleted: false,
          isActive: true,
        })
          .select('+password')
          .populate('roleId')

        if (!user) return null

        const passwordMatch = await bcrypt.compare(credentials.password, user.password)
        if (!passwordMatch) return null

        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })

        const permissions = resolvePermissions(
          user.roleId?.permissions || [],
          user.permissions || []
        )

        return {
          id: user._id.toString(),
          name: user.name,
          username: user.username,
          roleId: user.roleId?._id?.toString() || null,
          roleName: user.roleId?.name || null,
          permissions,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.roleId = user.roleId
        token.roleName = user.roleName
        token.permissions = user.permissions
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.username = token.username
      session.user.roleId = token.roleId
      session.user.roleName = token.roleName
      session.user.permissions = token.permissions || []
      return session
    },
  },
  pages: {
    signIn: '/app/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
}

module.exports = { authOptions }
