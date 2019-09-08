var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

driver.get('http://103.230.243.68:11898/page/ares_game.htm');
driver.findElement(By.id('user_id'))
    .then(e => {
        e.clear();
        e.sendKeys('test111');
    })
    .catch(() => console.error('find user_id error'));

driver.findElement(By.id('gold_id'))
    .then(e => {
        e.clear();
        e.sendKeys('10000');
    })
    .catch(() => console.error('find gold_id error'));

function selectOption(selector, item) {
    var selectList, desiredOption;

    selectList = this.findElement(selector);
    selectList.click();

    selectList.findElements(By.tagName('option'))
        .then(function findMatchingOption(options) {
            options.some(function (option) {
                option.getText().then(function doesOptionMatch(text) {
                    console.log(text);
                    if (item === text) {
                        desiredOption = option;
                        return true;
                    }
                });
            });
        })
        .then(function clickOption() {
            if (desiredOption) {
                desiredOption.click();
            }
        });
}
driver.selectOption = selectOption.bind(driver);
driver.selectOption(By.id('game_id'), '5505');

// driver.findElement(By.id('user_id')).sendKeys('test111');
// driver.findElement(By.id('kw')).sendKeys('webdriver');
// driver.findElement(By.id('su')).click();
// driver.wait(until.titleIs('webdriver_百度搜索'), 1000);
// driver.quit();