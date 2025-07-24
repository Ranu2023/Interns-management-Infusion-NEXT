import { getSession } from '@/lib/actions';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession();
  if (session) {
    res.status(200).json(session);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
}
