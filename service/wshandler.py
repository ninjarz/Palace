import json
import tornado.websocket

from game.goblin.game import *


game = Game()


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
        if name not in game.players:
            game.create_player(name)

        data = json.loads(message)
        if "commands" in data:
            commands = data["commands"]
            self.command(name, commands)
            return
        if "actions" in data:
            actions = data["actions"]
            self.action(name, actions)

    def command(self, name, commands):
        if 0 in commands:
            self.write_message(
                {
                    "map": game.map.__dict__,
                    "name": name,
                    "players": dict([[key, game.players[key].__dict__] for key in game.players]),
                    "enemies": [enemy.__dict__ for enemy in game.enemies],
                }
            )

    def action(self, name, actions):
        game.action(name, actions)
        self.write_message(
            {
                "name": name,
                "players": dict([[key, game.players[key].__dict__] for key in game.players]),
                "enemies": [enemy.__dict__ for enemy in game.enemies],
            }
        )


clients = []


class PianoHandler(tornado.websocket.WebSocketHandler):
    def initialize(self):
        pass

    def open(self):
        clients.append(self)
        self.set_nodelay(True)
        pass

    def data_received(self, chunk):
        pass

    def on_message(self, message):
        data = json.loads(message)

        for client in clients:
            client.write_message(
                data
            )