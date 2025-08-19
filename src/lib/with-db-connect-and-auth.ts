import type { NextRequest } from 'next/server';
import connectDB from '@/config/mongoose';
import { getCurrentUser } from './auth';
import { error401, error500 } from './response';
import type { AuthenticatedRequest } from './types/auth-request';

export function withDbConnectAndAuth(handler: unknown, isAuthRequired = true) {
  return async (req: NextRequest, context: unknown) => {
    try {
      const [, user] = await Promise.all([connectDB(), getCurrentUser()]);

      if (isAuthRequired === false) {
        // @ts-expect-error: handler type doesn't match NextRequest type
        return await handler(req, context);
      }

      if (user) {
        (req as AuthenticatedRequest).user = user; // Attach user to request
      } else {
        return error401('Unauthorized');
      }

      // @ts-expect-error: handler type doesn't match NextRequest type
      return await handler(req as AuthenticatedRequest, context); // Proceed with the handler
    } catch {
      return error500({
        message: 'Unauthorized or Internal Server Error',
      });
    }
  };
}

export async function withDbConnectAndActionAuth() {
  const mongooseConn = await connectDB();
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return { user, mongooseConn };
}
