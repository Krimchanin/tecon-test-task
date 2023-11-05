from flask import Flask, jsonify, request
from flask_socketio import SocketIO
from flask_cors import CORS


class ShoppingListApp:
    def __init__(self):
        self.app = Flask(__name__)
        self.socketio = SocketIO(self.app, cors_allowed_origins='*')
        CORS(self.app, resources={r"/api/*": {"origins": "*"}})
        self.shopping_list = []

        self.setup_routes()

    def setup_routes(self):
        self.app.route('/api/shopping_list', methods=['GET'])(self.get_shopping_list)
        self.app.route('/api/shopping_list', methods=['POST'])(self.add_shopping_item)
        self.app.route('/api/shopping_list/<int:index>', methods=['DELETE'])(self.delete_shopping_item)
        self.app.route('/api/shopping_list/<int:index>', methods=['PUT'])(self.edit_shopping_item)

    def get_shopping_list(self):
        return jsonify(self.shopping_list)

    def add_shopping_item(self):
        data = request.json
        if not isinstance(data, dict) or not data.get('item'):
            return jsonify({'error': 'Invalid data. Expected format: {"item": "item_name"}'}), 400

        item = data['item']
        self.shopping_list.append(item)
        self.socketio.emit('update_shopping_list', self.shopping_list)
        return jsonify({'message': 'Item added successfully'}), 201

    def delete_shopping_item(self, index):
        try:
            del self.shopping_list[index]
            self.socketio.emit('update_shopping_list', self.shopping_list)
            return jsonify({'message': 'Item deleted successfully'}), 200
        except IndexError:
            return jsonify({'error': 'Index out of range'}), 400

    def edit_shopping_item(self, index):
        data = request.json
        if not isinstance(data, dict) or not data.get('item'):
            return jsonify({'error': 'Invalid data. Expected format: {"item": "item_name"}'}), 400

        item = data['item']
        try:
            self.shopping_list[index] = item
            self.socketio.emit('update_shopping_list', self.shopping_list)
            return jsonify({'message': 'Item edited successfully'}), 200
        except IndexError:
            return jsonify({'error': 'Index out of range'}), 400

    def run(self):
        self.socketio.run(self.app, debug=False, port=5000, allow_unsafe_werkzeug=True)


if __name__ == '__main__':
    app = ShoppingListApp()
    app.run()
