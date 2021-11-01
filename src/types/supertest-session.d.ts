declare module 'supertest-session' {
  import supertest from 'supertest';
  const session: (app: any) => supertest.SuperTest<supertest.Test>;
  export = session;
}
