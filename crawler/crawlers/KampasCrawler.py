import urllib.parse
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

            crawler_id = self.options["id"]

            real_estates.append(
              RealEstate(title, link, price, area, None, None, crawler_id).to_json())

        return real_estates

    def create_url(self):
        options = self.options
        real_estate_type = options["realEstateType"]
        price_min = options["priceMin"]
        price_max = options["priceMax"]
        area_min = options["areaMin"]
        area_max = options["areaMax"]
        rooms_min = options["roomsMin"]
        rooms_max = options["roomsMax"]

        params = {}
        if price_min:
            params["priceFrom"] = price_min

        if price_max:
            params["priceTo"] = price_max

        if area_min:
            params["area_m2From"] = area_min

        if area_max:
            params["area_m2To"] = area_max

        if rooms_min:
            params["roomsFrom"] = rooms_min

        if rooms_max:
            params["roomsTo"] = rooms_max

        if real_estate_type == "house":
            url = 'https://www.kampas.lt/namai-vilniuje?'
        else:
            url = 'https://www.kampas.lt/butai-vilniuje?'

        print(url + urllib.parse.urlencode(params))
        return url + urllib.parse.urlencode(params)
