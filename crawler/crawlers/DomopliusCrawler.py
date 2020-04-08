from Crawler import Crawler
from RealEstate import RealEstate


class DomopliusCrawler(Crawler):
    def set_data_containers(self):
        self.containers = self.page_soup.find("ul", {"class": "auto-list"}).findAll("div", {"class": "item"})

    def crawl_data(self):
        real_estates = []
        for container in self.containers:
            item_container = container.find("div", {"class": "item-section"})
            title = item_container.h2.a.text.strip()
            link = item_container.h2.a["href"]

            param_container = item_container.find("div", {"class": "param-list"})

            area = param_container.find("span", {"title": "Bendras pastato plotas"}).text.strip()

            price_container = item_container.find("div", {"class": "price"})
            price = price_container.strong.text.strip()

            real_estates.append(
                RealEstate(title, link, price, area, None).to_json())

        return real_estates
