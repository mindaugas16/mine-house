import urllib.parse
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
            image_url = container.img["src"]

            param_container = item_container.find("div", {"class": "param-list"})

            area = param_container.find_all("span")[0].text.strip()

            price_container = item_container.find("div", {"class": "price"})
            price = price_container.strong.text.strip()

            crawler_id = self.options["id"]

            real_estates.append(
              RealEstate(title, link, price, area, None, image_url, crawler_id).to_json())

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
        "action_type": 1,
        "address_1": 461,
      }
      if price_min:
        params["sell_price_from"] = price_min

      if price_max:
        params["sell_price_to"] = price_max

      if area_min:
        params["flat_size_from"] = area_min

      if area_max:
        params["flat_size_to"] = area_max

      if rooms_min:
        params["flat_rooms_from"] = rooms_min

      if rooms_max:
        params["flat_rooms_to"] = rooms_max

      if real_estate_type == "house":
        url = 'https://domoplius.lt/skelbimai/namai-kotedzai-sodai?'
      else:
        url = 'https://domoplius.lt/skelbimai/butai?'

      print(url + urllib.parse.urlencode(params))
      return url + urllib.parse.urlencode(params)
