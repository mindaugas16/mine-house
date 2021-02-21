import urllib.parse
from Crawler import Crawler
from RealEstate import RealEstate

class AlioCrawler(Crawler):
    def set_data_containers(self):
        self.containers = self.page_soup.findAll("div", {"class": "result"})

    def crawl_data(self):
        real_estates = []
        for container in self.containers:
            try:
                if container.img:
                    image_url = container.img["data-src"]
                else:
                    image_url = None

                link_container = container.find("div", {"class": "desc_m_a_b"}).find("a", {"class": "vertiselink"})
                title = link_container.text.strip()
                link = link_container["href"]

                param_data = container.find("div", {"class": "description"}).text.strip().split('|')
                area = param_data[0].strip()
                price = container.find("span", {"class": "main_price"}).text.strip()
                crawler_id = self.options["id"]

                real_estates.append(
                  RealEstate(title, link, price, area, None, image_url, crawler_id).to_json())

            except BaseException as err:
                print('Alio crawler', container, err)
                continue

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

        params = {
          "city_id": 228626,
          "search_block": 1,
          "search[eq][adresas_1]": 228626,
        }
        url = 'https://www.alio.lt/paieska/?'

        if real_estate_type == "house":
            params["category_id"] = 1433
        else:
            params["category_id"] = 1373

        if price_min:
            params["search[gte][kaina_1]"] = price_min

        if price_max:
            params["search[lte][kaina_1]"] = price_max

        if area_min:
            params["search[gte][bendras_plotas_m_1]"] = area_min

        if area_max:
            params["search[lte][bendras_plotas_m_1]"] = area_max

        if rooms_min:
            params["search[gte][kambariu_skaicius_1]"] = rooms_min

        if rooms_max:
            params["search[lte][kambariu_skaicius_1]"] = rooms_max

        print(url + urllib.parse.urlencode(params))
        return url + urllib.parse.urlencode(params)
