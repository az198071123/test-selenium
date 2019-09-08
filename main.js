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
let game_id_map = new Map();
function selectOption(driver, selector, item) {
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('ts hello world');
        const driver = new selenium_webdriver_1.Builder()
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options()
            .setMobileEmulation({ deviceName: 'Pixel 2' }))
            .build();
        return Promise.all([
            driver.get('http://103.230.243.68:11898/page/ares_game.htm'),
            driver.findElement(selenium_webdriver_1.By.id('user_id'))
                .then(e => {
                e.clear();
                e.sendKeys('test111');
            })
                .catch(() => console.error('find gold_id error')),
            driver.findElement(selenium_webdriver_1.By.id('gold_id'))
                .then(e => {
                e.clear();
                e.sendKeys('10000');
            })
                .catch(() => console.error('find user_id error')),
            selectOption(driver, selenium_webdriver_1.By.id('game_id'), '5503'),
            driver.findElement(selenium_webdriver_1.By.id('kind_h'))
                .then(e => {
                e.click();
            })
                .catch(() => console.error('find kind_h error')),
        ]).then(() => {
            return driver.findElement(selenium_webdriver_1.By.className('btn-login-game'))
                .then(e => {
                e.click();
            })
                .catch(() => console.error('find btn-login-game error'));
        }).then(() => __awaiter(this, void 0, void 0, function* () {
            // await new Promise(resolve => setTimeout(resolve, 1000));
            yield driver.sleep(1000);
            return driver.getAllWindowHandles()
                .then(handles => {
                driver.switchTo().window(handles[1]);
            });
        })).then(() => {
            return driver.wait(() => {
                return driver.executeScript("return ares && ares.socket.sock && ares.socket.sock.readyState == WebSocket.OPEN");
            }, 50000)
                .then(() => console.log('find Cocos2dGameContainer !!'));
        }).then(() => driver.close());
    });
}
main().catch((e) => console.log('something error', e));
