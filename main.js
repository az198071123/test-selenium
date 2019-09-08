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
/**
 * main 入口
 *
 * 测试!
 */
function selectOption(driver, selector, item) {
    return __awaiter(this, void 0, void 0, function* () {
        let selectList = driver.findElement(selector);
        selectList.click();
        yield selectList.findElements(selenium_webdriver_1.By.tagName('option'))
            .then((options) => __awaiter(this, void 0, void 0, function* () {
            console.log('0');
            for (let index = 0; index < options.length; index++) {
                const option = options[index];
                console.log('1');
                let find = false;
                yield option.getAttribute("value")
                    .then((text) => {
                    console.log('2');
                    if (item === text) {
                        console.log('3');
                        option.click();
                        find = true;
                    }
                });
                if (find) {
                    break;
                }
            }
        }))
            .then(() => {
            console.log('4');
        });
        console.log('5');
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('ts hello world');
        const driver = new selenium_webdriver_1.Builder()
            .forBrowser('chrome')
            .build();
        yield driver.get('http://103.230.243.68:11898/page/ares_game.htm');
        yield driver.findElement(selenium_webdriver_1.By.id('user_id'))
            .then(e => {
            e.clear();
            e.sendKeys('test111');
        })
            .catch(() => console.error('find gold_id error'));
        yield driver.findElement(selenium_webdriver_1.By.id('gold_id'))
            .then(e => {
            e.clear();
            e.sendKeys('10000');
        })
            .catch(() => console.error('find user_id error'));
        yield selectOption(driver, selenium_webdriver_1.By.id('game_id'), '5503');
        yield driver.findElement(selenium_webdriver_1.By.id('kind_h'))
            .then(e => {
            e.click();
        })
            .catch(() => console.error('find kind_h error'));
        yield driver.findElement(selenium_webdriver_1.By.className('btn-login-game'))
            .then(e => {
            e.click();
        })
            .catch(() => console.error('find btn-login-game error'));
    });
}
main();
