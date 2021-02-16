from crawlers.CrawlerFactory import CrawlerFactory
from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route('/run', methods=['POST'])
def run_crawlers():
    portals = request.get_json(force=True)["portals"]
    options = request.get_json(force=True)["options"]
    factory = CrawlerFactory()
    data = []
    for portal in portals:
        try:
            data.append(factory.create_crawler(portal, options).fetch_data())
        except AttributeError as err:
            print(err)
            return jsonify(err), 400
        except BaseException as err:
            print(err)
            return jsonify({"message": "Something went wrong in crawler"}), 400
    if not data:
        return jsonify(data)
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
