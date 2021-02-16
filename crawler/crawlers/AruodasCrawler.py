import urllib.parse
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
            building_status = None
            building_status_value_container = container.find("td", {"class": "list-HouseStates"});
            if building_status_value_container:
                building_status = building_status_value_container.text.strip()

            price_container = address_container.find("div", {"class": "price"})
            price = price_container.find("span", {"class": "list-item-price"}).text.strip()
            crawler_id = self.options["id"]

            real_estates.append(
                RealEstate(title, link, price, area, building_status, image_url, crawler_id).to_json())

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
          "FOrder": "AddDate",
          "FRegionArea": 462,
        }
        if price_min:
            params["FPriceMin"] = price_min

        if price_max:
            params["FPriceMax"] = price_max

        if area_min:
            params["FAreaOverAllMin"] = area_min

        if area_max:
            params["FAreaOverAllMax"] = area_max

        if rooms_min:
            params["FRoomNumMin"] = rooms_min

        if rooms_max:
            params["FRoomNumMax"] = rooms_max

        if real_estate_type == "house":
            url = 'https://www.aruodas.lt/namai/vilniuje/?'
        else:
            url = 'https://www.aruodas.lt/butai/vilniuje/?'

        print(url + urllib.parse.urlencode(params))
        return url + urllib.parse.urlencode(params)
