import onload from '../utils/onload';
import tracker from '../utils/tracker';

function getSelector(element) {
  var selector;
  if (element.id) {
    selector = `#${element.id}`;
  } else if (element.className && typeof element.className === 'string') {
    selector = `.${element.className
      .split(' ')
      .filter((item) => !!item)
      .join('.')}`;
  } else {
    selector = element.nodeName.toLowerCase();
  }
  return selector;
}

export function blankScreen(options = {}) {
  if (!options.monitorBlankScreenErr) return;
  const config = options.config;
  const containerSelectors = ['body', 'html', '#app', '#root'];
  let emptyPoints = 0;
  function isContainer(element) {
    let selector = getSelector(element);
    if (containerSelectors.indexOf(selector) >= 0) {
      emptyPoints++;
    }
  }
  onload(function () {
    let xElements, yElements;
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;
    for (let i = 1; i <= 9; i++) {
      xElements = document.elementsFromPoint(
        (innerWidth * i) / 10,
        innerHeight / 2
      );
      yElements = document.elementsFromPoint(
        innerWidth / 2,
        (innerHeight * i) / 10
      );
      isContainer(xElements[0]);
      // 中间点只需要检测一次
      if (i !== 5) {
        isContainer(yElements[0]);
      }
      if (emptyPoints === 17) {
        // 认为是白屏
        let centerElements = document.elementsFromPoint(
          innerWidth / 2,
          innerHeight / 2
        );

        tracker.send(
          {
            kind: 'stability',
            type: 'blank',
            emptyPoints: '' + emptyPoints,
            screen: window.screen.width + 'x' + window.screen.height,
            viewPoint: innerWidth + 'x' + innerHeight,
            selector: getSelector(centerElements[0]),
          },
          config
        );
      }
    }
  });
}
