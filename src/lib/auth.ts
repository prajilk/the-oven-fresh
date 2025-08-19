import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import {
  admin as adminPlugin,
  createAuthMiddleware,
  username,
} from 'better-auth/plugins';
import mongoose from 'mongoose';
import { headers } from 'next/headers';
import connectDB from '@/config/mongoose';
import { ac, admin, delivery, manager } from './permissions';

const mongooseConn = await connectDB();

export const auth = betterAuth({
  database: mongodbAdapter(mongooseConn.connection.db),
  plugins: [
    username(),
    adminPlugin({
      ac,
      roles: {
        admin,
        manager,
        delivery,
      },
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'manager',
        input: true,
        returned: true,
      },
      storeId: {
        type: 'string',
        required: true,
        input: true,
        references: {
          model: 'Store',
          field: '_id',
        },
      },
      zone: {
        type: 'number',
        required: false,
        defaultValue: null,
        input: true,
      },
    },
    deleteUser: {
      enabled: true,
    },
  },
  databaseHooks: {
    user: {
      create: {
        // biome-ignore lint/suspicious/useAwait: <before function should be returning a Promise>
        before: async (user) => {
          const u = user as typeof user & {
            storeId: string;
          };
          return {
            data: {
              ...u,
              storeId: mongoose.Types.ObjectId.createFromHexString(u.storeId),
            },
          };
        },
      },
      update: {
        // biome-ignore lint/suspicious/useAwait: <before function should be returning a Promise>
        before: async (user) => {
          const u = user as typeof user & {
            storeId: string;
          };
          return {
            data: {
              ...u,
              storeId: mongoose.Types.ObjectId.createFromHexString(u.storeId),
            },
          };
        },
      },
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-in/username') {
        // what the endpoint just returned
        const returned = ctx.context.returned as
          | { token: string; user: { id: string } }
          | undefined;

        if (!returned?.user?.id) {
          return;
        } // nothing to do

        // fetch only what you need
        const dbUser = (await ctx.context.adapter.findOne({
          model: 'user',
          where: [{ field: 'id', value: returned.user.id }],
          select: ['role'],
        })) as { role: string };

        return ctx.json({
          ...returned,
          user: {
            ...returned.user,
            role: dbUser?.role ?? null,
          },
        });
      }
    }),
  },
});

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user || null;
}
