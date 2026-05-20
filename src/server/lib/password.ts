import 'server-only'

import * as bcrypt from 'bcryptjs'

const COST = parseInt(process.env.BCRYPT_COST ?? '12', 10)

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, COST)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}
