from Crawler import Crawler
from RealEstate import RealEstate


class SkelbiuCrawler(Crawler):
    def set_data_containers(self):
        self.containers = self.page_soup.select('li[class*="Ads"]')

    def crawl_data(self):
        real_estates = []
        for container in self.containers:
            item_container = container.find("div", {"class": "adsTexts"})
            image_url = container.img["src"]
            title = item_container.find("div", {"class": "adsTextReview"}).text.strip()
            link = "https://www.skelbiu.lt" + container.a["href"]

            param_container = item_container.find("div", {"class": "adsTextMoreDetails"})

            param_data = param_container.text.strip().split('|')
            area = param_data[0].strip()
            building_status = param_data[3].strip()

            price = container.find("div", {"class": "adsPrice"}).text.split('(')[0].strip()

            real_estates.append(
                RealEstate(title, link, price, area, building_status, image_url).to_json())

        return real_estates

    def create_url(self, price_min, price_max):
        return f"https://www.skelbiu.lt/skelbimai/?autocompleted=1&keywords=&cost_min={price_min}&cost_max={price_max}&space_min=&space_max=&rooms_min=&rooms_max=&building_type=0&year_min=&year_max=&status=0&building=0&district=0&quarter=0&streets=0&ignorestreets=0&cities=465&distance=0&mainCity=1&search=1&category_id=42&type=0&user_type=0&ad_since_min=0&ad_since_max=0&visited_page=1&orderBy=-1&detailsSearch=1"
