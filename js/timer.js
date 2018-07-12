function Timer(count,
  onTick = () => {},
  onDone = () => {},
){
  console.log(this);
  onTick(count)
  const updateTimer = () => {
    count--;
    onTick(count);
    if (count === 0) {
      this.stop();
      onDone('done');
    }
  };
  this.timer = setInterval(updateTimer, 1000);
  this.stop = () => clearInterval(this.timer);
  return this;
}

export default Timer;
