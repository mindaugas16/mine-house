class RealEstate:
    def __init__(self, title, link, price, area, building_status, image_url, crawler_id):
        self.title = title
        self.link = link
        self.price = price
        self.area = area
        self.building_status = building_status
        self.image_url = image_url
        self.crawler_id = crawler_id

    def to_json(self):
        return {
            "title": self.title,
            "link": self.link,
            "price": self.price,
            "area": self.area,
            "buildingStatus": self.building_status,
            "imageUrl": self.image_url,
            "crawlerId": self.crawler_id,
        }
