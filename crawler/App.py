from crawlers.CrawlerFactory import CrawlerFactory

factory = CrawlerFactory()

aruodasCrawler = factory.create_crawler('aruodas')
aruodasCrawler.fetch_data(
    "https://www.aruodas.lt/namai/vilniuje/?FPriceMin=50000&FPriceMax=175000&FOrder=AddDate&FRegionArea=462")

domopliusCrawler = factory.create_crawler('domoplius')
domopliusCrawler.fetch_data(
    "https://domoplius.lt/skelbimai/namai-kotedzai-sodai?action_type=1&address_1=461&sell_price_from=50000"
    "&sell_price_to=175000")

skelbiuCrawler = factory.create_crawler('skelbiu')
skelbiuCrawler.fetch_data(
    "https://www.skelbiu.lt/skelbimai/?autocompleted=1&keywords=&cost_min=50000&cost_max=175000&space_min=&space_max"
    "=&rooms_min=&rooms_max=&building_type=0&year_min=&year_max=&status=0&building=0&district=0&quarter=0&streets=0"
    "&ignorestreets=0&cities=465&distance=0&mainCity=1&search=1&category_id=42&type=0&user_type=0&ad_since_min=0"
    "&ad_since_max=0&visited_page=1&orderBy=-1&detailsSearch=1")

kampasCrawler = factory.create_crawler('kampas')
kampasCrawler.fetch_data("https://www.kampas.lt/namai-vilniuje?priceFrom=50000&priceTo=175000")