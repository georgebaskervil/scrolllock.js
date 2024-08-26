(function() {
    let observer;
    let isConnected = false;
    let originalBodyPosition;
  
    function saveBodyPosition() {
      originalBodyPosition = document.body.style.position;
    }
  
    function checkContentHeight() {
      if (document.body.scrollHeight > window.innerHeight) {
        unlockScroll();
      } else {
        lockScroll();
      }
    }
  
    function lockScroll() {
      saveBodyPosition();
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    }
  
    function unlockScroll() {
      document.body.style.overflow = 'auto';
      document.body.style.position = originalBodyPosition || 'static';
      const scrollY = document.body.style.top;
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  
    function connect() {
      if (!isConnected) {
        checkContentHeight();
        window.addEventListener('resize', checkContentHeight);
        observer = new MutationObserver(checkContentHeight);
        observer.observe(document.body, { 
          childList: true, 
          subtree: true, 
          attributes: true, 
          characterData: true 
        });
        isConnected = true;
      }
    }
  
    function disconnect() {
      if (isConnected) {
        window.removeEventListener('resize', checkContentHeight);
        observer.disconnect();
        document.body.style.position = originalBodyPosition || 'static';
        document.body.style.overflow = 'visible';
        document.body.style.top = '';
        window.scrollTo(0, 0);
        isConnected = false;
      }
    }
  
    document.addEventListener('DOMContentLoaded', connect);
  
    window.scrollLock = {
      checkContentHeight,
      lockScroll,
      unlockScroll,
      disconnect,
      connect
    };
  
  })();
