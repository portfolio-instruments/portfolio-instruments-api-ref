import { User as PrismaUser } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { omit } from 'lodash';
import { ParsedQuery } from '../../utils/parseQuery';
import prisma from '../../utils/prisma';
import { NewSettings, NewUser, Settings, User, settings as settingsTable, users as usersTable } from './schema/user.db.schema';
import db from '../../utils/drizzle';
import { SQL, eq, sql } from 'drizzle-orm';

export function getUser(email: string): Promise<PrismaUser | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function getAllUsers(options: ParsedQuery & { email?: string }): Promise<User[]> {
  const sqlChunks: SQL[] = [sql`select * from ${usersTable}`];

  if (options.email) {
    sqlChunks.push(sql`where ${eq(usersTable.email, options.email)}`);
  }

  // if (options.sort) {
  //   sqlChunks.push(sql`order by ${options.sort}`);
  // }

  const offsetSize: number = (options.pageNumber - 1) * options.pageSize;
  sqlChunks.push(sql`limit ${options.pageSize} offset ${offsetSize}`);

  const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));
  const res = await db.execute({ getSQL: () => finalSql });
  console.log(res);
}

export type CreatedUser = Omit<User, 'password' | 'role'>;

export async function createUser(newUser: NewUser): Promise<CreatedUser> {
  const users: CreatedUser[] = await db.insert(usersTable).values(newUser).returning({
    id: usersTable.id,
    email: usersTable.email,
    name: usersTable.name,
    createdAt: usersTable.createdAt,
    updatedAt: usersTable.updatedAt,
  });
  return users[0];
}

export async function createUserSettings(newSettings: NewSettings): Promise<Settings> {
  const settings: Settings[] = await db.insert(settingsTable).values(newSettings).returning();
  return settings[0];
}

export async function validateUser(email: string, password: string): Promise<Omit<PrismaUser, 'password'> | null> {
  const user: PrismaUser | null = await getUser(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }
  return omit(user, ['password']);
}
