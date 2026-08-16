const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function renameAndGenerateAll22() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  const artifactsDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\0c71bcb8-f9c4-46c7-93c8-29b393773a41';

  // Clean old un-numbered or screenshot files in directory
  if (fs.existsSync(screenshotsDir)) {
    const files = fs.readdirSync(screenshotsDir);
    for (const f of files) {
      if (f.startsWith('Screenshot 2026') || f.startsWith('Screenshot_')) {
        fs.unlinkSync(path.join(screenshotsDir, f));
      }
    }
  } else {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();
  const baseURL = 'http://localhost:3253';
  const sampleCarId = '65801d8050291ee1b1681025';

  async function setTheme(themeName) {
    await page.evaluate((th) => {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(th);
      localStorage.setItem('torque_theme', th);
      localStorage.setItem('torque_theme_legacy', th);
    }, themeName);
    await page.waitForTimeout(400);
  }

  async function saveScreenshot(filename, options = {}) {
    const p1 = path.join(screenshotsDir, filename);
    const p2 = path.join(artifactsDir, filename);
    await page.screenshot({ path: p1, ...options });
    fs.copyFileSync(p1, p2);
    console.log(`[SERIALIZED] Saved: ${filename}`);
  }

  console.log('--- GENERATING & RENAMING ALL 22 SCREENSHOTS WITH SERIAL NUMBERS ---');

  // 01. Home Page (Light Mode)
  await page.goto(`${baseURL}/`);
  await page.waitForLoadState('networkidle');
  await setTheme('light');
  await saveScreenshot('01_home_page_light.png');

  // 02. Home Page (Dark Mode)
  await setTheme('dark');
  await saveScreenshot('02_home_page_dark.png');

  // 03. Fleet Gallery (Light Mode)
  await page.goto(`${baseURL}/cars`);
  await page.waitForLoadState('networkidle');
  await setTheme('light');
  await saveScreenshot('03_fleet_gallery_light.png');

  // 04. Fleet Gallery (Dark Mode)
  await setTheme('dark');
  await saveScreenshot('04_fleet_gallery_dark.png');

  // 05. Showroom Filters (Light Mode)
  await setTheme('light');
  await saveScreenshot('05_showroom_filters_light.png');

  // 06. Filtered Fleet (Dark Mode)
  await page.goto(`${baseURL}/cars?category=SUV`);
  await page.waitForLoadState('networkidle');
  await setTheme('dark');
  await saveScreenshot('06_filtered_fleet_dark.png');

  // 07. Car Details Page (Light Mode)
  await page.goto(`${baseURL}/cars/${sampleCarId}`);
  await page.waitForLoadState('networkidle');
  await setTheme('light');
  await saveScreenshot('07_car_details_page_light.png');

  // 08. Car Details + Reviews (Dark Mode)
  await setTheme('dark');
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(300);
  await saveScreenshot('08_car_details_reviews_dark.png');

  // LOGIN USER
  await page.goto(`${baseURL}/login`);
  await page.fill('input[type="email"]', 'punittak2005@gmail.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1200);

  // 09. Booking Form (Light Mode)
  await page.goto(`${baseURL}/booking/${sampleCarId}`);
  await page.waitForLoadState('networkidle');
  await setTheme('light');
  await saveScreenshot('09_booking_form_light.png');

  // 10. Booking Confirmation Voucher (Dark Mode)
  await setTheme('dark');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continue') || b.textContent.includes('Next') || b.textContent.includes('Proceed'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continue') || b.textContent.includes('Next') || b.textContent.includes('Proceed'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Confirm') || b.textContent.includes('Complete') || b.textContent.includes('Pay'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(1500);
  await saveScreenshot('10_booking_confirmation_dark.png');

  // 11. Booking History (Light Mode)
  await page.goto(`${baseURL}/my-bookings`);
  await page.waitForLoadState('networkidle');
  await setTheme('light');
  await saveScreenshot('11_booking_history_light.png');

  // 12. Booking History (Dark Mode)
  await setTheme('dark');
  await saveScreenshot('12_booking_history_dark.png');

  // LOGOUT USER
  await page.evaluate(() => {
    localStorage.removeItem('torque_auth');
    localStorage.removeItem('torque_token');
    localStorage.removeItem('torque_user');
  });

  // 13. Login Page (Light Mode)
  await page.goto(`${baseURL}/login`);
  await page.waitForLoadState('networkidle');
  await setTheme('light');
  await saveScreenshot('13_login_light.png');

  // 14. Signup Page (Dark Mode)
  await page.goto(`${baseURL}/register`);
  await page.waitForLoadState('networkidle');
  await setTheme('dark');
  await saveScreenshot('14_signup_dark.png');

  // LOGIN ADMIN
  await page.goto(`${baseURL}/login`);
  await page.fill('input[type="email"]', 'admin@torque.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1200);

  // 15. Admin Dashboard Overview (Dark Mode)
  await page.goto(`${baseURL}/admin`);
  await page.waitForLoadState('networkidle');
  await setTheme('dark');
  await saveScreenshot('15_admin_dashboard_dark.png');

  // 16. Admin Dashboard Overview (Light Mode)
  await setTheme('light');
  await saveScreenshot('16_admin_dashboard_light.png');

  // 17. Admin Fleet Catalog (Dark Mode)
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Fleet Catalog'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(400);
  await setTheme('dark');
  await saveScreenshot('17_admin_fleet_management_dark.png');

  // 18. Admin Fleet Catalog (Light Mode)
  await setTheme('light');
  await saveScreenshot('18_admin_fleet_management_light.png');

  // 19. Admin Bookings Feed (Dark Mode)
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Bookings'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(400);
  await setTheme('dark');
  await saveScreenshot('19_admin_bookings_dark.png');

  // 20. Admin Bookings Feed (Light Mode)
  await setTheme('light');
  await saveScreenshot('20_admin_bookings_light.png');

  // 21. Admin Users Directory (Light Mode)
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Users'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(400);
  await setTheme('light');
  await saveScreenshot('21_admin_users_light.png');

  // 22. Admin Reviews (Dark Mode)
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Reviews'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(400);
  await setTheme('dark');
  await saveScreenshot('22_admin_reviews_dark.png');

  await browser.close();
  console.log('--- ALL 22 SERIALIZED SCREENSHOTS COMPLETED ---');
}

renameAndGenerateAll22().catch(console.error);
