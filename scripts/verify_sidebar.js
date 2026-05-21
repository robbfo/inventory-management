const { chromium } = require('/Users/robbfournier/anthropic-basecamp/inventory-management/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const screenshotDir = '/tmp/sidebar_verify';
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  // ---- Step 1 + 2: Navigate and inspect initial state ----
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${screenshotDir}/01_home.png`, fullPage: false });

  // Check for sidebar
  const sidebar = await page.$('[class*="sidebar"], nav[class*="side"], aside, .sidebar, #sidebar');
  const topNav = await page.$('header, nav[class*="top"], .top-nav, .navbar');
  const sidebarBg = sidebar ? await sidebar.evaluate(el => getComputedStyle(el).backgroundColor) : null;
  const sidebarWidth = sidebar ? await sidebar.evaluate(el => el.offsetWidth) : null;
  const sidebarLeft = sidebar ? await sidebar.evaluate(el => el.getBoundingClientRect().left) : null;

  console.log('=== STEP 2: Initial State ===');
  console.log('Sidebar element found:', !!sidebar);
  console.log('Sidebar background color:', sidebarBg);
  console.log('Sidebar width:', sidebarWidth);
  console.log('Sidebar left position:', sidebarLeft);
  console.log('Top nav / header found:', !!topNav);

  // Check sidebar color matches dark (#0f172a)
  // rgb(15, 23, 42) = #0f172a
  if (sidebarBg) {
    const isDark = sidebarBg.includes('15, 23, 42') || sidebarBg === '#0f172a';
    console.log('Sidebar is dark (#0f172a):', isDark);
  }

  // Check main content positioning
  const mainContent = await page.$('main, .main-content, #main, [class*="main"]');
  const mainLeft = mainContent ? await mainContent.evaluate(el => el.getBoundingClientRect().left) : null;
  console.log('Main content left offset:', mainLeft, '(should be >= 240 if sidebar is there)');

  // ---- Step 3: Click Inventory ----
  const inventoryLink = await page.$('a[href*="inventory"], a:has-text("Inventory")');
  if (inventoryLink) {
    await inventoryLink.click();
    await page.waitForTimeout(500);
  } else {
    console.log('WARNING: Could not find Inventory nav link');
    // Try text
    await page.click('text=Inventory');
    await page.waitForTimeout(500);
  }

  const urlAfterInventory = page.url();
  await page.screenshot({ path: `${screenshotDir}/03_inventory.png`, fullPage: false });

  // Check active link color
  const activeLink = await page.$('a.router-link-active, a.active, [aria-current="page"]');
  const activeLinkColor = activeLink ? await activeLink.evaluate(el => getComputedStyle(el).color) : null;
  const activeLinkBg = activeLink ? await activeLink.evaluate(el => getComputedStyle(el).backgroundColor) : null;

  console.log('\n=== STEP 4: Inventory Active State ===');
  console.log('URL after clicking Inventory:', urlAfterInventory);
  console.log('Active link color:', activeLinkColor);
  console.log('Active link background:', activeLinkBg);

  // ---- Step 5: Click Orders ----
  try {
    await page.click('a[href*="orders"], a:has-text("Orders")');
    await page.waitForTimeout(500);
  } catch {
    console.log('WARNING: Could not click Orders link directly');
  }

  const urlAfterOrders = page.url();
  await page.screenshot({ path: `${screenshotDir}/05_orders.png`, fullPage: false });

  console.log('\n=== STEP 6: Orders Active State ===');
  console.log('URL after clicking Orders:', urlAfterOrders);

  const activeAfterOrders = await page.$('a.router-link-active, a.active, [aria-current="page"]');
  const ordersActiveBg = activeAfterOrders ? await activeAfterOrders.evaluate(el => getComputedStyle(el).backgroundColor) : null;
  console.log('Orders active link background:', ordersActiveBg);

  // ---- Step 7: Check filter dropdowns ----
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  const filterLabels = ['Time Period', 'Location', 'Category', 'Status', 'Warehouse'];
  console.log('\n=== STEP 7: Filter Dropdowns ===');
  for (const label of filterLabels) {
    const found = await page.$(`text=${label}`);
    if (found) {
      const rect = await found.evaluate(el => {
        const r = el.getBoundingClientRect();
        return { left: r.left, top: r.top, width: r.width };
      });
      console.log(`Filter "${label}" found at left=${rect.left}, top=${rect.top}`);
    } else {
      console.log(`Filter "${label}": NOT FOUND`);
    }
  }

  // ---- Step 8: Language switcher ----
  await page.screenshot({ path: `${screenshotDir}/07_filters.png`, fullPage: false });

  // Find language switcher - often at bottom of sidebar
  const langBtn = await page.$('button[class*="lang"], button[class*="locale"], [class*="language"], button:has-text("EN"), button:has-text("English")');
  console.log('\n=== STEP 8: Language Switcher ===');
  console.log('Language switcher found:', !!langBtn);

  if (langBtn) {
    await langBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${screenshotDir}/08_lang_dropdown.png`, fullPage: false });

    // Check if dropdown is within viewport
    const dropdown = await page.$('[class*="dropdown"], [class*="menu"], [role="listbox"], [role="menu"]');
    if (dropdown) {
      const rect = await dropdown.evaluate(el => el.getBoundingClientRect());
      console.log('Language dropdown left position:', rect.left, '(should be >= 0 to not clip)');
      console.log('Language dropdown is clipping:', rect.left < 0);
    }

    // Close by pressing Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } else {
    // Take screenshot anyway to see what's at bottom of sidebar
    await page.screenshot({ path: `${screenshotDir}/08_lang_dropdown.png`, fullPage: false });
    console.log('Could not find language switcher button - screenshot taken for manual inspection');
  }

  // ---- Step 9: Profile button ----
  const profileBtn = await page.$('button[class*="profile"], button[class*="user"], [class*="avatar"], button[class*="account"]');
  console.log('\n=== STEP 9: Profile Button ===');
  console.log('Profile button found:', !!profileBtn);

  if (profileBtn) {
    await profileBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${screenshotDir}/09_profile_dropdown.png`, fullPage: false });

    const profileDropdown = await page.$('[class*="dropdown"], [class*="menu"], [role="listbox"], [role="menu"]');
    if (profileDropdown) {
      const rect = await profileDropdown.evaluate(el => el.getBoundingClientRect());
      console.log('Profile dropdown left position:', rect.left, '(should be >= 0 to not clip)');
      console.log('Profile dropdown is clipping:', rect.left < 0);
    }

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } else {
    await page.screenshot({ path: `${screenshotDir}/09_profile_dropdown.png`, fullPage: false });
    console.log('Could not find profile button - screenshot taken for manual inspection');
  }

  // ---- Step 10: Final screenshot ----
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${screenshotDir}/10_final.png`, fullPage: false });

  // Final layout check
  const sidebarFinal = await page.$('[class*="sidebar"], aside, .sidebar, #sidebar');
  const sidebarWidthFinal = sidebarFinal ? await sidebarFinal.evaluate(el => el.offsetWidth) : null;
  const sidebarColorFinal = sidebarFinal ? await sidebarFinal.evaluate(el => getComputedStyle(el).backgroundColor) : null;

  console.log('\n=== STEP 10: Final State ===');
  console.log('Sidebar width:', sidebarWidthFinal);
  console.log('Sidebar background:', sidebarColorFinal);

  // Dump all classes on page to help debug
  const allNavLinks = await page.$$eval('nav a, aside a, .sidebar a', els =>
    els.map(el => ({
      text: el.textContent.trim().substring(0, 30),
      href: el.getAttribute('href'),
      classes: el.className
    }))
  );
  console.log('\n=== All sidebar/nav links found ===');
  allNavLinks.forEach(l => console.log(`  "${l.text}" href="${l.href}" class="${l.classes}"`));

  // Report on layout issues
  console.log('\n=== LAYOUT ISSUE SUMMARY ===');
  if (!sidebar) {
    console.log('ISSUE: No sidebar element found with expected selectors');
  }
  if (sidebarWidth && (sidebarWidth < 200 || sidebarWidth > 300)) {
    console.log(`ISSUE: Sidebar width is ${sidebarWidth}px, expected ~240px`);
  }
  if (mainLeft !== null && mainLeft < 200) {
    console.log(`ISSUE: Main content starts at ${mainLeft}px, may be hidden behind sidebar`);
  }

  console.log('\nScreenshots saved to:', screenshotDir);
  await browser.close();
})();
