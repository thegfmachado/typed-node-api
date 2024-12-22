import z from "zod";
import { randomUUID } from "node:crypto";

import type { FastifyTypedInstance } from "./types/common";
import type { IUser } from "./types/interfaces";

const users: IUser[] = [];

export async function routes(app: FastifyTypedInstance) {
  app.get('/users', {
    schema: {
      tags: ['users'],
      description: 'List all users',
      response: {
        200: z.array(z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
        })).describe('List of all users'),
      },
    },
  }, () => {
    return users;
  });

  app.post('/users', {
    schema: {
      tags: ['users'],
      description: 'Create a new user',
      body: z.object({
        name: z.string(),
        email: z.string().email(),
      }),
      response: {
        201: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
        }).describe('User created'),
      },
    },
  }, async (request, reply) => {
    const { name, email } = request.body;

    const user = { id: randomUUID(), name, email };
    users.push(user);

    return reply.status(201).send(user);
  });
} 