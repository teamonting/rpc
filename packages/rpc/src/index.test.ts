import { scenario } from '@testduet/given-when-then';
import { expect } from 'expect';
import * as NodeTest from 'node:test';
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
              return { hello: (_aloha: string) => 'World!' };
            }
          } satisfies StubDeclaration<{ hello: (aloha: string) => string }>
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
      .and('a marshaller', precondition => {
        const marshaller = {
          marshal: (value: unknown): unknown => {
            marshaller.marshalled.push(value);

            return (value as string).split('');
          },
          marshalled: [] as any[],
          unmarshal: (value: unknown): unknown => {
            marshaller.unmarshalled.push(value);

            return (value as string[]).join('');
          },
          unmarshalled: [] as any[]
        };

        return {
          ...precondition,
          marshaller
        };
      })
      .and(
        'a server stub',
        precondition => {
          const teardown = listen(
            precondition.declaration,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {} as any,
            precondition.messageChannel.port1,
            precondition.marshaller
          );

          return { ...precondition, teardown };
        },
        ({ teardown }) => teardown()
      )
      .and('a client stub', precondition => {
        return {
          ...precondition,
          clientStub: createClientStub(
            precondition.declaration,
            precondition.messageChannel.port2,
            precondition.marshaller
          )
        };
      })
      .when('the client stub is called', async precondition => {
        return await precondition.clientStub.hello('Aloha');
      })
      .then('should return "World!', (_, result) => {
        expect(result).toBe('World!');
      })
      .and('should do marshalling', precondition => {
        expect(precondition.marshaller.marshalled).toEqual(['Aloha', 'World!']);
      })
      .and('should do unmarshalling', precondition => {
        expect(precondition.marshaller.unmarshalled).toEqual(['Aloha'.split(''), 'World!'.split('')]);
      });
  },
  NodeTest
);
