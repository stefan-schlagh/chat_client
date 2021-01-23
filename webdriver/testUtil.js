const fs = require('fs');

async function takeScreenshot(driver,path){
    const data = await driver.takeScreenshot();
    //https://stackoverflow.com/a/16882197/12913973
    const base64Data = data.replace(/^data:image\/png;base64,/,"");

    await new Promise((resolve, reject) => {
        fs.writeFile(path, base64Data, 'base64', function(err) {
            if(err)
                reject(err);
            else
                resolve();
        });
    });
}

