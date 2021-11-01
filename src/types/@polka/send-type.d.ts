declare module '@polka/send-type' {
  import { ServerResponse } from 'http';
  const sendtype: (
    res: ServerResponse,
    code: number,
    data?: any,
    headers?: any
  ) => any;

  export = sendtype;
}
