from Crawler import Crawler
from RealEstate import RealEstate


class AlioCrawler(Crawler):
    def set_data_containers(self):
        self.containers = self.page_soup.findAll("div", {"class": "result"})

    def crawl_data(self):
        real_estates = []
        for container in self.containers:
            image_url = container.img["data-src"]
            link_container = container.find("div", {"class": "desc_m_a_b"}).find("a", {"class": "vertiselink"})
            title = link_container.text.strip()
            link = link_container["href"]

            param_data = container.find("div", {"class": "description"}).text.strip().split('|')
            area = param_data[0].strip()
            price = container.find("span", {"class": "main_price"}).text.strip()
            real_estates.append(
                RealEstate(title, link, price, area, None, image_url).to_json())

        return real_estates

    def create_url(self, price_min, price_max):
        return f"https://www.alio.lt/paieska/?category_id=1433&city_id=228626&search_block=1&search%5Beq%5D%5Badresas_1%5D=228626&search%5Bgte%5D%5Bkaina_1%5D={price_min}&search%5Blte%5D%5Bkaina_1%5D={price_max}&order=ad_id"
