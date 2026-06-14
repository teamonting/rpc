import * as NodeTest from 'node:test';
import { scenario } from '@testduet/given-when-then';
import { expect } from 'expect';
import { createClientStub } from './client/index.ts';
import { listen } from './server/index.ts';
import type { StubDeclaration } from './types/StubDeclaration.ts';

scenario(
  'simple',
  bdd => {
    bdd
      .given('a stub declaration', () => {
        return {
          declaration: {
            keys: ['hello'],
            implement() {
              return { hello: () => 'World!' };
            }
          } satisfies StubDeclaration<{ hello: () => string }>
        };
      })
      .and(
        'a MessageChannel',
        precondition => {
          return { ...precondition, messageChannel: new MessageChannel() };
        },
        ({ messageChannel }) => {
          messageChannel.port1.close();
          messageChannel.port2.close();
        }
      )
      .and(
        'a server stub',
        precondition => {
          const teardown = listen(
            precondition.declaration,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {} as any,
            precondition.messageChannel.port1
          );

          return { ...precondition, teardown };
        },
        ({ teardown }) => teardown()
      )
      .and('a client stub', precondition => {
        return {
          ...precondition,
          clientStub: createClientStub(precondition.declaration, precondition.messageChannel.port2)
        };
      })
      .when('the client stub is called', async precondition => {
        return await precondition.clientStub.hello();
      })
      .then('should return "World!', (_, result) => {
        expect(result).toBe('World!');
      });
  },
  NodeTest
);
