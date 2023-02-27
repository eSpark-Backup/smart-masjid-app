import { createMachine, assign } from 'xstate';

async function invokeFetchJoke() {
  return fetch('https://official-joke-api.appspot.com/random_joke')
    .then(response => response.json())
    .then(data => data)
    .catch(error => error);
}

const jokeMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCsD2BrMBZAhgYwAsBLAOzAGIAxAUQBUBhACQH0ApAeQGlqBtABgC6iUAAdUsIgBciqEsJAAPRABYATABoQAT0QBGXQDYAdAE4A7AYCsB1ZYC+dzWky5CpMEYA2qHBFJRyCFkPUgA3DBCScMwAWgAzMElCGOcwfiEkEDEJaVl5JQQAZisjS0LdW00dBAAOXVKHJwjXYjIvHz8SALAAJx7UHqMRTxxJOIGAWyMwiPjE5NT0+WypGTlMguLLUvLK7T0zZSNlMor7RpASVAg4eVSW92XxVbyNxBiDKveDC-v8VpCEE8YCeOTW+UQlhMRjMhWUhTMli+CF0ZjMxws1lsv2a-3c7V8kFBL3WoAKlhqhSMhRMfBsSP2KL4VNUqis9JxLjxbTiOCIwIgxNypMUkMp1Np9ORqKpJ125yaXLcbW8vn8QvBbwQqj49WUBhqiORJip5nZ2IcdiAA */
  createMachine({
    predictableActionArguments: true,
    id: 'jokeMachine',
    initial: 'idle',
    context: {
      joke: {},
      empty: 'Nope',
    },
    states: {
      idle: {},
      loaded: {},
      failed: {},
      loading: {
        invoke: {
          id: 'invoke-fetch-joke',
          src: invokeFetchJoke,
          onDone: {
            target: 'loaded',
            actions: assign({
              empty: 'Yahoo',
              joke: (context, event) => event.data,
            }),
          },
          onError: 'failed',
        },
      },
    },
    on: {
      FETCH_JOKE: 'loading',
    },
  });
export default jokeMachine;
