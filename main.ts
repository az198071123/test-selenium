import { Builder, By, ThenableWebDriver } from 'selenium-webdriver';
/**
 * main 入口
 * 
 * 测试!
 */
async function selectOption(driver: ThenableWebDriver, selector: By, item: string) {
    let selectList = driver.findElement(selector);
    selectList.click();
    await selectList.findElements(By.tagName('option'))
        .then(async (options) => {
            console.log('0');
            for (let index = 0; index < options.length; index++) {
                const option = options[index];
                console.log('1');
                let find = false;
                await option.getAttribute("value")
                    .then((text) => {
                        console.log('2');
                        if (item === text) {
                            console.log('3');
                            option.click();
                            find = true;
                        }
                    });
                if (find) break;
            }
        })
        .then(() => {
            console.log('4');
        })
    console.log('5');
}
async function main() {
    console.log('ts hello world');

    const driver = new Builder()
        .forBrowser('chrome')
        .build();

    await driver.get('http://103.230.243.68:11898/page/ares_game.htm')

    await driver.findElement(By.id('user_id'))
        .then(e => {
            e.clear();
            e.sendKeys('test111');
        })
        .catch(() => console.error('find gold_id error'));


    await driver.findElement(By.id('gold_id'))
        .then(e => {
            e.clear();
            e.sendKeys('10000');
        })
        .catch(() => console.error('find user_id error'));

    await selectOption(driver, By.id('game_id'), '5503');

    await driver.findElement(By.id('kind_h'))
        .then(e => {
            e.click();
        })
        .catch(() => console.error('find kind_h error'));

    await driver.findElement(By.className('btn-login-game'))
        .then(e => {
            e.click();
        })
        .catch(() => console.error('find btn-login-game error'));
}

main();