from crawlers.AlioCrawler import AlioCrawler
from crawlers.AruodasCrawler import AruodasCrawler
from crawlers.DomopliusCrawler import DomopliusCrawler
from crawlers.KampasCrawler import KampasCrawler
from crawlers.SkelbiuCrawler import SkelbiuCrawler


class CrawlerFactory:
    def create_crawler(self, name, options):
        if name == 'aruodas':
            return AruodasCrawler(options)
        elif name == 'domoplius':
            return DomopliusCrawler(options)
        elif name == 'skelbiu':
            return SkelbiuCrawler(options)
        elif name == 'kampas':
            return KampasCrawler(options)
        elif name == 'alio':
            return AlioCrawler(options)
