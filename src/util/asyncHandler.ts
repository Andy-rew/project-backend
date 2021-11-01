const asyncUtil = (fn: (...args: any[]) => any) =>
  function asyncUtilWrap(...args: any[]): Promise<any> {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch(next);
  };

export default asyncUtil;
