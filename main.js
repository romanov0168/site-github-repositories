console.clear();

class Counter {
  count = 1;

  inc = () => {
    this.count += Counter.incStep;
    console.log(this.count);
  };

  static incStep = 2;

  static incrementAll = function (arr) {
    arr.forEach((c) => c.inc());
  };
}

const cnt = new Counter();
console.log(cnt.count);
cnt.inc();
setTimeout(cnt.inc, 1000);

Counter.incrementAll([cnt]);
