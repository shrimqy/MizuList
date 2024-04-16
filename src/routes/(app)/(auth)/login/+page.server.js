/** @type {import('./$types').PageServerLoad} */
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { db } from '$lib/server/database';

export async function load({ locals }) {
  return {
    user: locals.user,
  };
}

export const actions = {
  login: async ({ cookies, request, locals }) => {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
      return fail(400, { invalid: true });
    }

    const user = await db.user.findUnique({ where: { username } });

    if (!user) {
      return fail(400, { credentials: true });
    }

    const userPassword = await bcrypt.compare(password, user.passwordHash);
    if (!userPassword) {
      return fail(400, { credentials: true });
    }

    const authenticatedUser = await db.user.update({
      where: { username: user.username },
      data: { userAuthToken: crypto.randomUUID() },
    });

    cookies.set('session', authenticatedUser.userAuthToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 24 * 30,
    });

    locals.user = {
      userId: user.id,
      username: user.username,
    };

    throw redirect(302, '/');
  },
};