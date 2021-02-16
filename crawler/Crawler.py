from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup


class Crawler:
    def __init__(self, options):
        self.containers = None
        self.page_soup = None
        self.options = options

    def parse_html(self, url):
        u_client = uReq(url)
        page_html = u_client.read()
        u_client.close()
        self.page_soup = soup(page_html, "html.parser")
        self.set_data_containers()

    def fetch_data(self):
        self.parse_html(self.create_url())
        return self.crawl_data()

    def create_url(self):
        pass

    def set_data_containers(self):
        pass

    def crawl_data(self):
        pass
