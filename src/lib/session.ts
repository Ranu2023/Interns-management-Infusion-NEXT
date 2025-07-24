'use server';

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-for-development');
const key = secretKey;

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch(e) {
        return null;
    }
}

export async function logout() {
  // Destroy the session
  cookies().set('session', '', { expires: new Date(0) });
}
