from crawlers.AruodasCrawler import AruodasCrawler
from crawlers.DomopliusCrawler import DomopliusCrawler
from crawlers.KampasCrawler import KampasCrawler
from crawlers.SkelbiuCrawler import SkelbiuCrawler


class CrawlerFactory:
    def create_crawler(self, name):
        if name == 'aruodas':
            return AruodasCrawler()
        elif name == 'domoplius':
            return DomopliusCrawler()
        elif name == 'skelbiu':
            return SkelbiuCrawler()
        elif name == 'kampas':
            return KampasCrawler()
