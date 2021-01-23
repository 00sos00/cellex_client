export function getPopupFunctions() {
    const popupShow = (elemId, speed) => {
      const elem = document.getElementById(elemId);
      const overlay = document.getElementById('overlay');

      if (overlay) overlay.style.display = 'block';
      elem.style.pointerEvents = 'auto';
      elem.style.animation = `popupShow ${speed / 1000}s`;
      elem.style.transition = `opacity ${speed / 1000}s`;
      elem.style.opacity = 1;
    }
    const popupHide = (elemId, speed) => {
      const elem = document.getElementById(elemId);
      const overlay = document.getElementById('overlay');

      if (overlay) overlay.style.display = 'none';
      elem.style.pointerEvents = 'none';
      elem.style.animation = `popupHide ${speed / 1000}s`;
      elem.style.transition = 'opacity ' + speed / 1000 + 's';
      elem.style.opacity = 0;
    }

    return { popupShow, popupHide }
}