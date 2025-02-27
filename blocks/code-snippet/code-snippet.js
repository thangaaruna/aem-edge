export default async function decorate(block) {
  const copyButtonWrapper = document.createElement('div');
  copyButtonWrapper.classList.add('copy-code-wrapper');
  
  const copyButton = document.createElement('button');
  copyButton.classList.add('copy-code-button');
  copyButton.setAttribute('type', 'button');
  
  const buttonText = document.createElement('span');
  buttonText.textContent = 'Copy';
  copyButton.appendChild(buttonText);
  
  copyButtonWrapper.appendChild(copyButton);
  
  block.insertBefore(copyButtonWrapper, block.firstChild);

  function copyCodeToClipboard() {
    const codeContent = Array.from(block.querySelectorAll('p')).map(p => p.textContent.trim()).join('\n');
    
    navigator.clipboard.writeText(codeContent)
      .then(() => {
        buttonText.textContent = 'Copied!';
        setTimeout(() => {
          buttonText.textContent = 'Copy';
        }, 5000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  }

  copyButton.addEventListener('click', copyCodeToClipboard);
}