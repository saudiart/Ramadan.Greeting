// script.js
// This file contains all the logic to generate the personalised Eid Al Fitr greeting
// card using the HTML canvas. It listens for a click on the generate button,
// draws the card with the selected background and overlays the relevant text
// elements including the user's name, then exposes a download link.

window.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('name-input');
  const generateBtn = document.getElementById('generate-btn');
  const canvas = document.getElementById('result-canvas');
  const ctx = canvas.getContext('2d');
  const downloadLink = document.getElementById('download-link');

  // Preload the greeting card background image
  const background = new Image();
  background.src = 'IMG_20260319_222253.png';

  // When the user clicks the generate button, draw the card
  generateBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    if (!name) {
      alert('الرجاء إدخال الاسم أولاً');
      return;
    }
    // Limit extremely long names for aesthetic purposes
    const trimmedName = name.substring(0, 30);
    await drawCard(trimmedName);
  });

  /**
   * Draws the card with the provided name. It waits for the background
   * and fonts to load before rendering. The design layout is inspired
   * by the provided example: header, greeting calligraphy, message,
   * user name, and sponsor names.
   *
   * @param {string} name The name to display on the card
   */
  async function drawCard(name) {
    // Reveal the canvas once drawing starts
    canvas.hidden = false;
    downloadLink.style.display = 'none';

    // Ensure the background image is fully loaded
    await new Promise((resolve) => {
      if (background.complete) {
        resolve();
      } else {
        background.onload = () => resolve();
        background.onerror = () => resolve();
      }
    });

    // Wait for any fonts to finish loading
    await document.fonts.ready;

    // Clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background covering the entire canvas
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Set text direction to RTL for proper Arabic shaping (supported in modern browsers)
    if ('direction' in ctx) {
      ctx.direction = 'rtl';
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;

    let nameFontSize = 104;
    ctx.font = `bold ${nameFontSize}px "Noto Kufi Arabic"`;
    const measured = ctx.measureText(name);

    if (measured.width > canvas.width * 0.72) {
      nameFontSize = Math.floor(nameFontSize * (canvas.width * 0.72) / measured.width);
      ctx.font = `bold ${nameFontSize}px "Noto Kufi Arabic"`;
    }

    ctx.fillStyle = '#FFFFFF';
    const nameY = canvas.height * 0.76;
    ctx.fillText(name, canvas.width / 2, nameY);
    ctx.shadowColor = 'transparent';

    // Prepare download link for the generated image
    const dataURL = canvas.toDataURL('image/png');
    downloadLink.href = dataURL;
    downloadLink.download = `Eid_Al_Fitr_greeting_${Date.now()}.png`;
    downloadLink.textContent = 'تحميل البطاقة';
    downloadLink.style.display = 'inline-block';

    // Scroll to the canvas to show the user their card
    // Use requestAnimationFrame to ensure the browser has laid out the element before scrolling
    requestAnimationFrame(() => {
      canvas.scrollIntoView({ behavior: 'smooth' });
    });
  }
});