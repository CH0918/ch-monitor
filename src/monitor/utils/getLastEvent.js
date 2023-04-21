let lastEvent;
[
  'click',
  'pointerdown',
  'touchstart',
  'mousedown',
  'keydown',
  'mouseover',
].forEach((event) => {
  document.addEventListener(
    event,
    (event) => {
      lastEvent = event;
    },
    {
      capture: true, //capture 控制监听器是在捕获阶段执行还是在冒泡阶段执行
      passive: true, //passive 的意思是顺从的，表示它不会对事件的默认行为说 no
    }
  );
});
export default function () {
  return lastEvent;
}
