// script.js
// This file contains all the logic to generate the personalised Ramadan greeting
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
  background.src = 'assets/greeting-bg.png';

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

    // Draw the brand/company name even lower so it appears in the open area of the background
    ctx.fillStyle = '#F7DA5D';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = 'bold 44px "Aref Ruqaa"';
    ctx.fillText('سات للعطور والجمال', canvas.width / 2, 430);

    // Draw the main greeting "Ramadan Mubarak" below the brand text
    ctx.font = 'bold 96px "Aref Ruqaa"';
    ctx.fillStyle = '#F7DA5D';
    ctx.fillText('رمضان مبارك', canvas.width / 2, 600);

    // Decorative divider line beneath the greeting
    ctx.strokeStyle = 'rgba(247, 218, 93, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.15, 700);
    ctx.lineTo(canvas.width * 0.85, 700);
    ctx.stroke();

    // Congratulatory message over multiple lines placed further down
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '32px "Noto Kufi Arabic"';
    ctx.textAlign = 'center';
    const messageLines = [
      'تتقدم شركة سات للعطور والجمال بأسمى آيات التهاني والتبريكات',
      'بحلول شهر رمضان المبارك، سائلين المولى عز وجل',
      'أن يتقبل منا ومنكم صالح الأعمال'
    ];
    let messageY = 730;
    const messageLineHeight = 50;
    messageLines.forEach((line) => {
      ctx.fillText(line, canvas.width / 2, messageY);
      messageY += messageLineHeight;
    });

    // Another divider under the message
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.2, messageY + 20);
    ctx.lineTo(canvas.width * 0.8, messageY + 20);
    ctx.strokeStyle = 'rgba(247, 218, 93, 0.6)';
    ctx.stroke();

    // Draw the user's name prominently beneath the message
    ctx.font = 'bold 84px "Aref Ruqaa"';
    ctx.fillStyle = '#F7DA5D';
    ctx.textBaseline = 'top';
    ctx.fillText(name, canvas.width / 2, messageY + 60);

    // Draw sponsor/brand names at the bottom in smaller text
    ctx.font = '26px "Noto Kufi Arabic"';
    ctx.fillStyle = '#FFFFFF';
    ctx.textBaseline = 'bottom';
    ctx.fillText('LA MER  |  CLASY  |  CLARA LINE  |  SELECTIVE COLLECTION', canvas.width / 2, canvas.height - 70);

    // Prepare download link for the generated image
    const dataURL = canvas.toDataURL('image/png');
    downloadLink.href = dataURL;
    downloadLink.download = `Ramadan_greeting_${Date.now()}.png`;
    downloadLink.textContent = 'تحميل البطاقة';
    downloadLink.style.display = 'inline-block';

    // Scroll to the canvas to show the user their card
    // Use requestAnimationFrame to ensure the browser has laid out the element before scrolling
    requestAnimationFrame(() => {
      canvas.scrollIntoView({ behavior: 'smooth' });
    });
  }
});