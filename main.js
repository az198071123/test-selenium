"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
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
    game_id_map: new Map(),
    check_script: 'return ares && ares.room["1"] != "ws://127.0.0.1:12001/"'
    // check_script: 'return ares && ares.socket.sock && ares.socket.sock.readyState == WebSocket.OPEN'
};
function push_game_id_map(driver, selector) {
    let selectList = driver.findElement(selector);
    return selectList.findElements(selenium_webdriver_1.By.tagName('option'))
        .then(options => {
        let options_promises = options.map(option => {
            return option.getAttribute("value")
                .then(game_id => {
                config.game_id_map.set(game_id, option);
            });
        });
        return Promise.all(options_promises);
    });
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
function selectOption(driver, selector, item) {
    console.log('selectOption', item);
    let selectList = driver.findElement(selector);
    selectList.click();
    return selectList.findElements(selenium_webdriver_1.By.tagName('option'))
        .then(options => {
        let options_promises = options.map(option => {
            return option.getAttribute("value")
                .then(text => {
                if (item == text)
                    option.click();
            });
        });
        return Promise.all(options_promises);
    });
}
function start_loop_game(driver) {
    console.log('start_loop_game for ', config.game_id_map);
    // config.game_id_map.clear();
    // config.game_id_map.set('5503', new WebElement(driver, "test"));
    // config.game_id_map.set('5504', new WebElement(driver, "test"));
    let loop_game_promises = Promise.resolve();
    for (let [game_id, btn] of config.game_id_map.entries()) {
        loop_game_promises = loop_game_promises
            .then(() => selectOption(driver, selenium_webdriver_1.By.id('game_id'), game_id))
            .then(() => driver.findElement(selenium_webdriver_1.By.className('btn-login-game'))
            .then(e => e.click()))
            .then(() => driver.sleep(1000))
            // await new Promise(resolve => setTimeout(resolve, 1000));
            .then(() => driver.getAllWindowHandles()
            .then(handles => driver.switchTo().window(handles[1])))
            .then(() => driver.wait(() => {
            return driver.executeScript(config.check_script);
        }, 50000))
            .then(() => driver.close())
            .then(() => driver.sleep(1000))
            .then(() => driver.getAllWindowHandles()
            .then(handles => driver.switchTo().window(handles[0])));
    }
    return loop_game_promises;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('ts hello world');
        const driver = new selenium_webdriver_1.Builder()
            .forBrowser(config.browser)
            .setChromeOptions(new chrome.Options()
            .setMobileEmulation({ deviceName: config.deviceName }))
            .build();
        return Promise.all([
            driver.get(config.html_login_url),
            driver.findElement(selenium_webdriver_1.By.id('user_id'))
                .then(e => {
                e.clear();
                e.sendKeys(config.user_id);
            }),
            driver.findElement(selenium_webdriver_1.By.id('gold_id'))
                .then(e => {
                e.clear();
                e.sendKeys(config.gold_id);
            }),
            driver.findElement(selenium_webdriver_1.By.id('kind_v'))
                .then(e => e.click()),
            push_game_id_map(driver, selenium_webdriver_1.By.id('game_id'))
        ]).then(() => start_loop_game(driver));
    });
}
main().catch((e) => console.log('something error:', e));
