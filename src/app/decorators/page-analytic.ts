export function PageAnalytics(pageName: string) {
  return function (constructor: Function) {
    // console.log('decorator=', constructor.prototype, pageName);
    const originalNgOnInit = constructor.prototype.ngOnInit;

    constructor.prototype.ngOnInit = function () {
      // console.log('TRACK2');
      originalNgOnInit && originalNgOnInit.apply(this);
      //   originalNgOnInit && originalNgOnInit.call(this);
    };
  };
}
