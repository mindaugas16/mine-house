from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup
import requests

API_ENDPOINT = "http://localhost:3000/api/real-estate"


def post_data(payload):
    response = requests.post(url=API_ENDPOINT, json=payload)
    print('payload', payload)
    print(response.json())


class Crawler:
    def __init__(self):
        self.containers = None
        self.page_soup = None

    def fetch_data(self, url):
        self.parse_html(url)
        data = self.crawl_data()
        post_data(data)

    def parse_html(self, url):
        u_client = uReq(url)
        page_html = u_client.read()
        u_client.close()
        self.page_soup = soup(page_html, "html.parser")
        self.set_data_containers()

    def set_data_containers(self):
        pass

    def crawl_data(self):
        pass
