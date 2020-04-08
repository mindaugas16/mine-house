from Crawler import Crawler
from RealEstate import RealEstate


class SkelbiuCrawler(Crawler):
    def set_data_containers(self):
        self.containers = self.page_soup.select('li[class*="Ads"]')

    def crawl_data(self):
        real_estates = []
        for container in self.containers:
            item_container = container.find("div", {"class": "adsTexts"})
            title = item_container.find("div", {"class": "adsTextReview"}).text.strip()
            link = "https://www.skelbiu.lt" + container.a["href"]

            param_container = item_container.find("div", {"class": "adsTextMoreDetails"})

            param_data = param_container.text.strip().split('|')
            area = param_data[0].strip()
            building_status = param_data[3].strip()

            price = container.find("div", {"class": "adsPrice"}).text.split('(')[0].strip()

            real_estates.append(
                RealEstate(title, link, price, area, building_status).to_json())

        return real_estates
