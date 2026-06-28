import { scenario } from '@testduet/given-when-then';
import { expect } from 'expect';
import * as NodeTest from 'node:test';
import { createClientStub } from './client/index.ts';
import { listen } from './server/index.ts';
import defineImplementation from './types/defineImplementation.ts';
import defineContract from './types/defineContract.ts';

type Stub = {
  hello: (aloha: string) => string;
};

scenario(
  'simple',
  bdd => {
    bdd
      .given('a stub contract', () => {
        return { contract: defineContract<Stub>({ keys: ['hello'] }) };
      })
      .and('a stub implementation', precondition => {
        return {
          ...precondition,
          implementation: defineImplementation(precondition.contract, {
            implement() {
              return { hello: (_aloha: string) => 'World!' };
            }
          })
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          marshalled: [] as any[],
          unmarshal: (value: unknown): unknown => {
            marshaller.unmarshalled.push(value);

            return (value as string[]).join('');
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            precondition.implementation,
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
            precondition.contract,
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
