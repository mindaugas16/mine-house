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
            image_url = container.img["src"]
            address_container = container.find("td", {"class": "list-adress"})
            link = address_container.a["href"]

            area = container.find("td", {"class": "list-AreaOverall"}).text.strip()
            building_status = container.find("td", {"class": "list-HouseStates"}).text.strip()

            price_container = address_container.find("div", {"class": "price"})
            price = price_container.find("span", {"class": "list-item-price"}).text.strip()

            real_estates.append(
                RealEstate(title, link, price, area, building_status, image_url).to_json())

        return real_estates

    def create_url(self, price_min, price_max):
        return f"https://www.aruodas.lt/namai/vilniuje/?FPriceMin={price_min}&FPriceMax={price_max}&FOrder=AddDate&FRegionArea=462"
