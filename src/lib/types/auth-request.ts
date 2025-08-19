import type { NextRequest } from 'next/server';
import type { auth } from '../auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: (typeof auth.$Infer.Session)['user'];
}
