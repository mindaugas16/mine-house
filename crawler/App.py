from crawlers.CrawlerFactory import CrawlerFactory
from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route('/run', methods=['POST'])
def run_crawlers():
    portals = request.get_json(force=True)["portals"]
    factory = CrawlerFactory()
    data = []
    for portal in portals:
        try:
            data.append(factory.create_crawler(portal).fetch_data())
        except AttributeError as err:
            print(err)
            return jsonify(err)
        except BaseException:
            return jsonify({"message": "Something went from in crawler"})
    return jsonify(flatten(data))


def flatten(input_array):
    result_array = []
    for element in input_array:
        if isinstance(element, list):
            result_array += flatten(element)
        else:
            result_array.append(element)
    return result_array


if __name__ == '__main__':
    app.run('0.0.0.0')
