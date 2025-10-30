function counter() {
  let count = 0;
  return function () {
    count++;
    console.log(count);
  };
}
const c = counter();
c(); // 1
c(); // 2
