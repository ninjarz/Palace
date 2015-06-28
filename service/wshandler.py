import random
import json
import tornado.websocket


users = {}
goblin = {
    "x": 32 + (random.random() * (787 - 64)),
    "y": 32 + (random.random() * (480 - 64))
}


class GameHandler(tornado.websocket.WebSocketHandler):
    def initialize(self):
        pass

    def open(self):
        self.set_nodelay(True)
        pass

    def data_received(self, chunk):
        pass

    def on_message(self, message):
        # identity
        # if self.get_secure_cookie("user"):
        name = str(self.request.remote_ip)
        if name not in users:
            users[name] = {
                "name": name,
                "point": 0
            }

        data = json.loads(message)
        user = users[name]
        user["x"] = data["x"]
        user["y"] = data["y"]

        if user["x"] <= goblin["x"] + 32 and goblin["x"] <= user["x"] + 32 and \
           user["y"] <= goblin["y"] + 32 and goblin["y"] <= user["y"] + 32:
            user["point"] += 1
            goblin["x"] = 32 + (random.random() * (787 - 64))
            goblin["y"] = 32 + (random.random() * (480 - 64))

        self.write_message(
            {
                "name": name,
                "users": users,
                "goblin": goblin
            }
        )