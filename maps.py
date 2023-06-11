from selenium import webdriver
from time import sleep
from selenium.webdriver.common.by import By
from selenium import webdriver


import sys
import json


driver = webdriver.Chrome(r'C:\Users\fazal\Downloads\chromedriver_win32\chromedriver.exe')
driver.get('https://www.google.com/maps/@17.4192592,78.4639535,13.42z')


def source_addr(source,destination):
    sleep(6)
    driver.find_element(By.CSS_SELECTOR, '[name="q"]').send_keys(source)
    sleep(5)
    driver.find_element(By.ID, "searchbox-searchbutton").click()
    sleep(10)
    driver.find_element(By.CSS_SELECTOR, "#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.Pf6ghf.ecceSd.tLjsW > div.etWJQ.jym1ob.kdfrQc.pChizd.bWQG4d > button").click()

    sleep(3)
    driver.find_element(By.CSS_SELECTOR, "#sb_ifc50 > input").click()
    


    sleep(5)
    driver.find_element(By.CSS_SELECTOR, "#sb_ifc50 > input").send_keys(destination)
    sleep(5)
    driver.find_element(By.CSS_SELECTOR, "#directions-searchbox-0 > button.mL3xi").click()
    sleep(5)
    driver.find_element(By.CSS_SELECTOR, "#section-directions-trip-0 > div.MespJc > div > div:nth-child(4) > button").click()
    sleep(10)
    
    buttons=driver.find_elements(By.CSS_SELECTOR,"div.M3pmwc button.gRXflc")
    sleep(5)
    for button in buttons:
        button.click()
    sleep(15)
    #element = driver.find_element(By.CSS_SELECTOR, "#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf > div.M3pmwc")
    #elements = element.find_elements(By.CSS_SELECTOR, "div.M3pmwc ")
    elements= driver.find_elements(By.CSS_SELECTOR,"div.M3pmwc")
    sleep(5)
    texts = [element.text for element in elements]

    # Print the extracted texts
    for text in texts:
        return('Directions:',text)


# Read the JSON string from standard input
service_object_json = sys.stdin.read()

# Parse the JSON string to a JSON object
service_object = json.loads(service_object_json)

# Access the starting location and destination values
starting_location = service_object['startingLocation']
destination = service_object['destination']
response=source_addr(starting_location,destination)

response_json = json.dumps(response)

sys.stdout.write(response_json)
sys.stdout.flush()
