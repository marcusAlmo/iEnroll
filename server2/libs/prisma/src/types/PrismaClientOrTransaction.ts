import { PrismaClient } from '@prisma/client';
import { Transaction } from './Transaction';

export type PrismaClientOrTransaction = Transaction | PrismaClient;
