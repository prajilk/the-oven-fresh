import {
  adminClient,
  inferAdditionalFields,
  usernameClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import type { auth } from './auth';
import { ac, admin, delivery, manager } from './permissions';

export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    adminClient({
      ac,
      roles: {
        admin,
        manager,
        delivery,
      },
    }),
    inferAdditionalFields<typeof auth>(),
  ],
});
