from Crawler import Crawler
from RealEstate import RealEstate


class KampasCrawler(Crawler):
    def set_data_containers(self):
        self.containers = self.page_soup.select('div[class*="ad-card"]')

    def crawl_data(self):
        real_estates = []
        for container in self.containers:
            title = container.find("p", {"class": "small-line"}).text.strip()
            link = "https://www.kampas.lt" + container.a["href"]
            param_data = container.find("div", {"class": "attributes-icons"}).select("div")
            area = param_data[1].text.strip()
            price = container.find("p", {"class": "third-line"}).text.strip()
            real_estates.append(
                RealEstate(title, link, price, area, None, None).to_json())

        return real_estates

    def create_url(self, price_min, price_max):
        return f"https://www.kampas.lt/namai-vilniuje?priceFrom={price_min}&priceTo={price_max}"
