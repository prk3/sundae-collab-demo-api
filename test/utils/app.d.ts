declare module NodeJS {
  interface Global {
    getApp: () => import('express').Application;
  }
}
declare let getApp: NodeJS.Global['getApp'];
