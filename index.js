const {Builder, By, Key, util, WebDriver, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options();
const path = require('path');


async function data(pages) {

    let lines = [];

    // options.setPreference("browser.download.dir", "c:\\seleniumdownloads");
    // options.setPreference("browser.download.folderList", 2);
    // options.setPreference("browser.helperApps.neverAsk.saveToDisk", "text/csv");
    // options.setPreference("browser.download.useDownloadDir", true);
    // options.setPreference("browser.download.manager.showWhenStarting", false);
    // options.setPreference("browser.download.defaultFolder", "c:\\seleniumdownloads");
    // options.setPreference("browser.helperApps.alwaysAsk.force", false);
    // options.setPreference("browser.download.downloadDir", "c:\\seleniumdownloads");
    // options.setPreference("browser.download.manager.alertOnEXEOpen", false);
    // options.setPreference("browser.download.panel.shown", false);
    // options.setPreference("browser.download.viewableInternally.enabledTypes", "");
    // options.setPreference("browser.helperApps.neverAsk.openFile", "text/csv");
    // options.setPreference("browser.download.manager.focusWhenStarting", false);
    // options.setPreference("browser.download.manager.useWindow", false);
    // options.setPreference("browser.download.manager.showAlertOnComplete", false);
    // options.setPreference("browser.download.manager.closeWhenDone", false);
    // options.setPreference("pdfjs.disabled", true);
    // options.setPreference("services.sync.prefs.sync.browser.download.manager.showWhenStarting", false);
    // options.setPreference("download.prompt_for_download", false);
    // options.addArguments("--headless");
    // options.addArguments("--disable-gpu");
    // options.addArguments("--no-sandbox");
    options.addArguments('--disable-dev-shm-usage');
    options.setUserPreferences({"Browser.setDownloadBehavior": "allow",
                                "download.prompt_for_download": false,
                                "download.directory_upgrade": true,
                                //"download.default_directory": path.join(__dirname, "public", "temp")
                                });    
    // options.setChromeBinaryPath('C:\\webDrivers\\chromedriver.exe'); 
    // let serviceBuilder = new chrome.ServiceBuilder('C:\\webDrivers\\chromedriver.exe')    

    let driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
    //let driver = WebDriver.chrome('C:\\webDrivers\\chromedriver.exe');
    await driver.get('https://www.newocr.com/');

    let uploadElement = await driver.findElement(By.id('userfile'));
    await uploadElement.sendKeys(path.join(__dirname, 'jin crow 50 years after.pdf'))

    await driver.findElement(By.xpath('//*[@id="preview"]')).click();

    for (let i = 1; i <= pages; i++){
        if (i !== 1){
            await driver.sleep(1000)
            await driver.findElement(By.xpath('//*[@id="page"]')).click();
            //await dropDown.selectByVisibleText(i.toString());
            await driver.findElement(By.xpath('//*[@id="page"]/option['+i.toString()+']')).click();
            let previewBox = await driver.findElement(By.xpath('//*[@id="thumbnail"]'));
            await driver.wait(until.elementIsVisible(previewBox), 100000);
            await driver.sleep(6000)
            
        }else{
            let element = await driver.findElement(By.xpath('//*[@id="ocr"]'));
            //console.log(element)
            await driver.wait(until.elementIsVisible(element), 100000)
            
        }
        await driver.sleep(1000)
        //console.log('here')
        await driver.findElement(By.xpath('//*[@id="ocr"]')).click();
        let loading = await driver.findElement(By.xpath('//*[@id="ocr-result"]'))
        await driver.wait(until.elementIsVisible(loading), 100000);

        let text = await driver.findElement(By.xpath('//*[@id="ocr-result"]'));

        console.log(await text.getAttribute('value')); 

        let data = await text.getAttribute('value');
        lines = [...lines, ...data.split('\n')]
        await driver.navigate().refresh();
        await driver.sleep(2000);        
    }
    console.log(lines);
    driver.close();

    
    // await driver.findElement(By.name("Username")).sendKeys(email);
    // await driver.findElement(By.name("Password")).sendKeys(password, Key.RETURN);       
    // await driver.manage().setTimeouts( { implicit: 10000 } );
    // await driver.findElement(By.xpath("//a[@id='ext-gen43']")).click();
    // // await driver.findElements("//*[@id='ext-gen46']/tbody/tr").then(function(elements){
    // //     var rows = elements.length;
    // // });
    
    // // //var col = await driver.findElements("//*[@id='ext-gen46']/tbody/tr[1]/tr");
    // valor = await driver.findElement(By.xpath("//*[@id='ext-gen46']/tbody/tr")).getText();
    // console.log(valor);
}
data(20);

// /html/body/div[10]/h3