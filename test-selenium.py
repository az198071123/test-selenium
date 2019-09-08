from selenium import webdriver
driver = webdriver.Chrome(r"C:\ProgramData\chocolatey\bin\chromedriver.exe")
driver.get("http://103.230.243.68:11898/page/ares_game.htm")

driver.find_element_by_xpath("//input[@id='user_id']").send_keys("test111")
driver.find_element_by_xpath("//input[@id='gold_id']").send_keys("1000")
driver.find_element_by_xpath("//select[@id='game_id']").send_keys("5505")

driver.find_element_by_xpath(
    "//*[@id='login_tab']/form/table/tbody/tr[7]/td/div[1]").submit()
