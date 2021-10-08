const {Builder, By, Key, util, WebDriver, until} = require('selenium-webdriver');
const excelToJson = require('convert-excel-to-json');
const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options();
const path = require('path');
const fs = require('fs');
const { PDFNet } = require('@pdftron/pdfnet-node');

const readXlsx = async (i) => {
    var lines = [];
    let result
    try {
        result = excelToJson({
            sourceFile: './temp/' + 'temp'+i+'.xlsx'
        });  
    } catch (e) {
        setTimeout(1000);
        result = excelToJson({
            sourceFile: './temp/' + 'temp'+i+'.xlsx'
        }); 
    }
    
    Object.keys(result).forEach(v => {
        Object.keys(result[v]).forEach(c => {
            lines.push(result[v][c]);
        })
    })
    console.log(lines);
    fs.unlinkSync(path.join(__dirname, 'temp/temp'+i+'.xlsx'));
    return lines;
}


async function data(pages) {

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
                                "download.default_directory": path.join(__dirname, "temp")
                                });    
    // options.setChromeBinaryPath('C:\\webDrivers\\chromedriver.exe'); 
    // let serviceBuilder = new chrome.ServiceBuilder('C:\\webDrivers\\chromedriver.exe')    

    let driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
    //let driver = WebDriver.chrome('C:\\webDrivers\\chromedriver.exe');
    await driver.get('https://www.onlineocr.net/es/');

    await driver.manage().setTimeouts( { implicit: 100000 } );

    await driver.sleep(200);    

    let lines = [];

    for (let i = 1; i <= pages; i++){
        const getImages = async () => {
            const doc = await PDFNet.PDFDoc.createFromFilePath(path.join(__dirname, 'jin crow 50 years after.pdf'));
            await doc.initSecurityHandler();
            // set the output resolution
            const pdfdraw = await PDFNet.PDFDraw.create(150);
        
            // Rasterize the first page in the document and save the result as PNG.
            const pg = await doc.getPage(i);
            await pdfdraw.export(pg, path.join(__dirname, 'temp'+i+'.png'), "PNG");
        }
        
        await PDFNet.runWithCleanup(getImages, 'demo:1630594838770:78ffbcab03000000008cb2856f2c0182e6dae50c44d40f021f8532b3a4').then(async () => {
            await driver.findElement(By.xpath('//*[@id="MainContent_comboOutput"]')).click();
            await driver.findElement(By.xpath('//*[@id="MainContent_comboOutput"]/option[2]')).click();
            let uploadElement = await driver.findElement(By.id('fileupload'));
            await uploadElement.sendKeys(path.join(__dirname, 'temp'+i+'.png'));

            let disabled = await driver.findElement(By.xpath('//*[@id="MainContent_btnOCRConvert"]'));

            await driver.wait(until.elementIsEnabled(disabled), 100000);
            await driver.findElement(By.xpath('//*[@id="MainContent_btnOCRConvert"]')).click();

            //await driver.sleep(1000)

            let downloadButton = await driver.findElement(By.xpath('//*[@id="MainContent_lnkBtnDownloadOutput"]'));
            
            try {
                await driver.wait(until.elementIsVisible(downloadButton), 1000000);
                await driver.sleep(2000);
                await driver.findElement(By.xpath('//*[@id="MainContent_lnkBtnDownloadOutput"]')).click();
            } catch (e) {
                await driver.wait(until.elementIsVisible(downloadButton), 1000000);
                await driver.sleep(2000);
                await driver.findElement(By.xpath('//*[@id="MainContent_lnkBtnDownloadOutput"]')).click();
            }

            await driver.sleep(1000);

            lines = [...lines, ...await readXlsx(i)];

            fs.unlinkSync(path.join(__dirname, 'temp'+i+'.png'));
            
            //await driver.manage().setTimeouts( { implicit: 100000 } );    

            if (i % 15 === 0){
                driver.close();
                driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
                await driver.get('https://www.onlineocr.net/es/');
                await driver.manage().setTimeouts( { implicit: 100000 } );

                await driver.sleep(200); 
            }else{
                await driver.navigate().refresh();
                await driver.sleep(1000);
            }
            
        }).catch(err => {
            console.log(err);
            return;
        })
    }

    driver.close();
    console.log(lines);
    console.log('finish');


    
}
data(20);