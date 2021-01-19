const {Builder, By, Key, until,Capabilities} = require('selenium-webdriver');
const fs = require('fs');

(async function example() {

    console.log("start");

    const chromeCapabilities = Capabilities.chrome();
    //setting chrome options to start the browser fully maximized
    const  chromeOptions = {
        'args': ['--headless','--no-sandbox','--disable-setuid-sandbox','--disable-gpu','--disable-extensions']
    };
    chromeCapabilities.set('chromeOptions', chromeOptions);
    const driver = new Builder().withCapabilities(chromeCapabilities).build();

    //let driver = await new Builder().forBrowser('chrome').build();
    try {
        /*
            status:
                works with firefox,
                chrome:
                    [0116/190841.644:ERROR:process_reader_win.cc(123)] NtOpenThread: {Zugriff verweigert} Ein Prozess hat einen Zugriff auf ein Objekt angefordert, aber ihm wurden nicht die Rechte für den Zugriff erteilt. (0xc0000022)
                    [0116/190841.649:ERROR:exception_snapshot_win.cc(99)] thread ID 19880 not found in process
                    [0116/190841.653:ERROR:process_reader_win.cc(123)] NtOpenThread: {Zugriff verweigert} Ein Prozess hat einen Zugriff auf ein Objekt angefordert, aber ihm wurden nicht die Rechte für den Zugriff erteilt. (0xc0000022)
                    [0116/190841.653:ERROR:exception_snapshot_win.cc(99)] thread ID 19464 not found in process
             //TODO:
                github actions
                docker image
         */

        await driver.get('http://localhost:3000');

        console.log("login");
        //login
        await driver.wait(until.elementLocated(By.name('username')), 10000);
        await driver.findElement(By.name('username')).sendKeys('stefan', Key.RETURN);
        await driver.findElement(By.name('password')).sendKeys('password', Key.RETURN);

        console.log("success");

        //wait until chats loaded
        await driver.wait(until.elementLocated(By.className('chat-item')),10000);
        //const chatList = await driver.findElements(By.className('chat-item'));

        const data = await driver.takeScreenshot();
        //https://stackoverflow.com/a/16882197/12913973
        var base64Data = data.replace(/^data:image\/png;base64,/,"")
        fs.writeFile("out.png", base64Data, 'base64', function(err) {
            if(err) console.log(err);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await driver.quit();
    }
})();