class RealEstate:
    def __init__(self, title, link, price, area, building_status):
        self.title = title
        self.link = link
        self.price = price
        self.area = area
        self.building_status = building_status

    def to_json(self):
        return {
            "title": self.title,
            "link": self.link,
            "price": self.price,
            "area": self.area,
            "buildingStatus": self.building_status,
        }
