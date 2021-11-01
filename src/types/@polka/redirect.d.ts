declare module '@polka/redirect' {
  import { ServerResponse } from 'http';
  const redirect: (res: ServerResponse, location: string) => any;

  export = redirect;
}
