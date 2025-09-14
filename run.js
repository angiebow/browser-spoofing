const path = require('path');
const fs = require('fs');
const {Builder, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function() {
  let driverPath;
  try {
    driverPath = require('chromedriver').path;
  } catch (e) {
    console.error("chromedriver npm package not found. Install with: npm install chromedriver");
    process.exit(1);
  }

  const service = new chrome.ServiceBuilder(driverPath).build();
  chrome.setDefaultService(service);

  let options = new chrome.Options();
  // options.addArguments('--headless=new'); // uncomment to run headless
  options.addArguments('--disable-blink-features=AutomationControlled');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    const fileUrl = 'file://' + path.join(__dirname, 'test.html');
    await driver.get(fileUrl);

    const out = await driver.wait(until.elementLocated(By.id('out')), 5000);
    await driver.wait(async () => {
      const text = await out.getText();
      return text && text.trim().length > 0 && !text.includes('loading');
    }, 5000);

    const text = await out.getText();
    console.log("Page output:\n", text);

    const screenshot = await driver.takeScreenshot();
    const outPng = path.join(__dirname, 'screenshot.png');
    fs.writeFileSync(outPng, Buffer.from(screenshot, 'base64'));
    console.log("Saved screenshot to", outPng);

    const obj = JSON.parse(text);
    if (obj.maxTouchPoints === 1 && obj.screen.width === 600 && obj.screen.height === 800 && obj.screen.colorDepth === 24) {
      console.log("Basic spoof verification PASSED (navigator/screen)");
    } else {
      console.warn("Basic spoof verification FAILED for navigator/screen");
    }
    if (obj.battery && obj.battery.level === 0.56) {
      console.log("Battery spoof verification PASSED");
    } else {
      console.warn("Battery spoof verification FAILED");
    }

  } catch (err) {
    console.error(err);
  } finally {
    setTimeout(async () => {
      await driver.quit();
    }, 1000);
  }
})();
