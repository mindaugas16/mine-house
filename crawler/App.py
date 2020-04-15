import requests
from crawlers.CrawlerFactory import CrawlerFactory

factory = CrawlerFactory()

response = requests.get(url="http://localhost:3000/api/portals")
print(response.json())
for portal in response.json():
    factory.create_crawler(portal["name"]).fetch_data()
