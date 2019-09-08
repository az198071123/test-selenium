import { Builder, By, ThenableWebDriver } from 'selenium-webdriver';
/**
 * main 入口
 * 
 * 测试!
 */
function selectOption(driver: ThenableWebDriver, selector: By, item: string) {
    let selectList = driver.findElement(selector);
    selectList.click();
    return selectList.findElements(By.tagName('option'))
        .then(options => {
            let options_promises = options.map(option => {
                return option.getAttribute("value")
                    .then(text => {
                        console.log(text);
                        if (item == text) option.click();
                    });
            });
            return Promise.all(options_promises);
        })
}
async function main() {
    console.log('ts hello world');

    const driver = new Builder()
        .forBrowser('chrome')
        .build();

    Promise.all([
        driver.get('http://103.230.243.68:11898/page/ares_game.htm'),
        driver.findElement(By.id('user_id'))
            .then(e => {
                e.clear();
                e.sendKeys('test111');
            })
            .catch(() => console.error('find gold_id error')),
        driver.findElement(By.id('gold_id'))
            .then(e => {
                e.clear();
                e.sendKeys('10000');
            })
            .catch(() => console.error('find user_id error')),
        selectOption(driver, By.id('game_id'), '5503'),
        driver.findElement(By.id('kind_h'))
            .then(e => {
                e.click();
            })
            .catch(() => console.error('find kind_h error')),
    ]).then(() => {
        return driver.findElement(By.className('btn-login-game'))
            .then(e => {
                e.click();
            })
            .catch(() => console.error('find btn-login-game error'))
    });
}

main().catch(() => console.log('something error'));