from Crawler import Crawler
from RealEstate import RealEstate


class AruodasCrawler(Crawler):
    def set_data_containers(self):
        self.containers = self.page_soup.findAll("tr", {"class": "list-row"})

    def crawl_data(self):
        real_estates = []
        for container in self.containers:
            if not container.img:
                continue

            title = container.img["alt"]
            address_container = container.find("td", {"class": "list-adress"})
            link = address_container.a["href"]

            area = container.find("td", {"class": "list-AreaOverall"}).text.strip()
            building_status = container.find("td", {"class": "list-HouseStates"}).text.strip()

            price_container = address_container.find("div", {"class": "price"})
            price = price_container.find("span", {"class": "list-item-price"}).text.strip()

            real_estates.append(
                RealEstate(title, link, price, area, building_status).to_json())

        return real_estates
