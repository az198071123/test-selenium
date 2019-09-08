import { Builder, By, ThenableWebDriver, WebElement } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
/**
 * main 入口
 * 
 * 测试!
 */
const config = {
    browser: 'chrome',
    deviceName: 'Pixel 2',
    html_login_url: 'http://103.230.243.68:11898/page/ares_game.htm',
    user_id: 'test111',
    gold_id: '0',
    game_id_map: new Map<string, WebElement>(),
    check_script: 'return ares && ares.room["1"] != "ws://127.0.0.1:12001/"'
    // check_script: 'return ares && ares.socket.sock && ares.socket.sock.readyState == WebSocket.OPEN'
}

function push_game_id_map(driver: ThenableWebDriver, selector: By) {
    let selectList = driver.findElement(selector);
    return selectList.findElements(By.tagName('option'))
        .then(options => {
            let options_promises = options.map(option => {
                return option.getAttribute("value")
                    .then(game_id => {
                        config.game_id_map.set(game_id, option);
                    })
            });
            return Promise.all(options_promises);
        })
}

// function selectOption(driver: ThenableWebDriver, selector: By, item: string) {
//     console.log('selectOption', item);
//     let selectList = driver.findElement(selector);
//     return selectList.click()
//         .then(() => {
//             const btn = config.game_id_map.get(item);
//             if (btn) return btn.click();
//             else return Promise.reject('game id not found');
//         })
// }
function selectOption(driver: ThenableWebDriver, selector: By, item: string) {
    console.log('selectOption', item);
    let selectList = driver.findElement(selector);
    selectList.click();
    return selectList.findElements(By.tagName('option'))
        .then(options => {
            let options_promises = options.map(option => {
                return option.getAttribute("value")
                    .then(text => {
                        if (item == text) option.click();
                    });
            });
            return Promise.all(options_promises);
        })
}

function start_loop_game(driver: ThenableWebDriver) {
    console.log('start_loop_game for ', config.game_id_map);
    // config.game_id_map.clear();
    // config.game_id_map.set('5503', new WebElement(driver, "test"));
    // config.game_id_map.set('5504', new WebElement(driver, "test"));
    let loop_game_promises = Promise.resolve();
    for (let [game_id, btn] of config.game_id_map.entries()) {
        loop_game_promises = loop_game_promises
            .then(() => selectOption(driver, By.id('game_id'), game_id))
            .then(() => driver.findElement(By.className('btn-login-game'))
                .then(e => e.click()))
            .then(() => driver.sleep(1000))
            // await new Promise(resolve => setTimeout(resolve, 1000));
            .then(() => driver.getAllWindowHandles()
                .then(handles => driver.switchTo().window(handles[1])))
            .then(() => driver.wait(() => {
                return driver.executeScript(config.check_script)
            }, 50000))
            .then(() => driver.close())
            .then(() => driver.sleep(1000))
            .then(() => driver.getAllWindowHandles()
                .then(handles => driver.switchTo().window(handles[0])))
    }
    return loop_game_promises;
}

async function main() {
    console.log('ts hello world');

    const driver = new Builder()
        .forBrowser(config.browser)
        .setChromeOptions(new chrome.Options()
            .setMobileEmulation({ deviceName: config.deviceName }))
        .build();

    return Promise.all([
        driver.get(config.html_login_url),
        driver.findElement(By.id('user_id'))
            .then(e => {
                e.clear();
                e.sendKeys(config.user_id);
            }),
        driver.findElement(By.id('gold_id'))
            .then(e => {
                e.clear();
                e.sendKeys(config.gold_id);
            }),
        driver.findElement(By.id('kind_v'))
            .then(e => e.click()),
        push_game_id_map(driver, By.id('game_id'))
    ]).then(() => start_loop_game(driver))
}

main().catch((e) => console.log('something error:', e));