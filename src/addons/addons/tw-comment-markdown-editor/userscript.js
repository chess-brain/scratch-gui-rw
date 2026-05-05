export default async function ({ addon, console }) {
  console.log('=== Markdown Editor Addon: Starting ===');

  const findCommentElements = () => {
    const elements = [];
    
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      const parent = textarea.closest('[aria-label*="comment"], .blocklyBubble, .scratchComment, [class*="Bubble"]');
      if (parent) {
        elements.push({ textarea, parent });
      } else {
        const bubbleCanvas = textarea.closest('.blocklyBubbleCanvas');
        if (bubbleCanvas) {
          const groups = bubbleCanvas.querySelectorAll('g');
          groups.forEach(group => {
            if (group.contains(textarea)) {
              elements.push({ textarea, parent: group });
            }
          });
        }
      }
    });
    
    return elements;
  };

  const addControls = (textarea, parent) => {
    if (parent.dataset.markdownProcessed) return;
    
    const existingToggle = parent.querySelector('.tw-md-toggle');
    if (existingToggle) return;

    console.log('Markdown Editor: Found comment textarea');

    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'tw-md-toggle';
    toggleContainer.style.cssText = `
      position: absolute !important;
      top: 4px !important;
      right: 8px !important;
      z-index: 9999 !important;
      display: flex !important;
      gap: 8px !important;
      background: rgba(255, 255, 255, 0.95) !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
    `;

    const modeText = document.createElement('span');
    modeText.textContent = '编辑';
    modeText.style.cssText = `
      font-size: 12px !important;
      color: #666 !important;
      font-weight: 600 !important;
      user-select: none !important;
    `;

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '预览';
    toggleBtn.style.cssText = `
      background: #4c97ff !important;
      color: white !important;
      border: none !important;
      border-radius: 3px !important;
      padding: 3px 10px !important;
      font-size: 12px !important;
      cursor: pointer !important;
      font-weight: 600 !important;
    `;

    const previewDiv = document.createElement('div');
    previewDiv.style.cssText = `
      display: none !important;
      width: 100% !important;
      height: 100% !important;
      padding: 10px !important;
      box-sizing: border-box !important;
      color: #333 !important;
      font-family: sans-serif !important;
      font-size: 14px !important;
      line-height: 1.6 !important;
      white-space: pre-wrap !important;
      background: #fffacd !important;
    `;

    toggleContainer.appendChild(modeText);
    toggleContainer.appendChild(toggleBtn);

    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    
    if (parent.parentElement) {
      parent.parentElement.insertBefore(wrapper, parent);
      wrapper.appendChild(parent);
    } else {
      document.body.appendChild(wrapper);
      wrapper.appendChild(parent);
    }
    wrapper.appendChild(toggleContainer);

    const textareaParent = textarea.parentElement;
    textareaParent.appendChild(previewDiv);

    parent.dataset.markdownProcessed = 'true';

    toggleBtn.addEventListener('click', () => {
      if (toggleBtn.textContent === '预览') {
        toggleBtn.textContent = '编辑';
        modeText.textContent = '预览';
        textarea.style.display = 'none';
        previewDiv.style.display = 'block';
        previewDiv.innerHTML = textarea.value.replace(/\n/g, '<br>');
      } else {
        toggleBtn.textContent = '预览';
        modeText.textContent = '编辑';
        textarea.style.display = 'block';
        previewDiv.style.display = 'none';
      }
    });

    console.log('Markdown Editor: Controls added successfully');
  };

  const processComments = () => {
    if (addon.self.disabled) return;
    
    const comments = findCommentElements();
    console.log('Markdown Editor: Found', comments.length, 'comments');
    
    comments.forEach(({ textarea, parent }) => {
      addControls(textarea, parent);
    });
  };

  setTimeout(() => {
    console.log('Markdown Editor: Initial processing');
    processComments();
  }, 500);

  setInterval(processComments, 1000);

  const observer = new MutationObserver(() => {
    setTimeout(processComments, 100);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  console.log('=== Markdown Editor Addon: Ready ===');
}
