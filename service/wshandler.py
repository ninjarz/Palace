import json
import tornado.websocket

from game.goblin.goblin import *


class GoblinHandler(tornado.websocket.WebSocketHandler):
    game = Game()

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
        if name not in self.game.players:
            self.game.create_player(name)

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
                    "map": self.game.map.__dict__,
                    "name": name,
                    "players": dict([[key, self.game.players[key].__dict__] for key in self.game.players]),
                    "enemies": [enemy.__dict__ for enemy in self.game.enemies],
                }
            )

    def action(self, name, actions):
        self.game.action(name, actions)
        self.write_message(
            {
                "name": name,
                "players": dict([[key, self.game.players[key].__dict__] for key in self.game.players]),
                "enemies": [enemy.__dict__ for enemy in self.game.enemies],
            }
        )


class PianoHandler(tornado.websocket.WebSocketHandler):
    clients = []

    def initialize(self):
        pass

    def open(self):
        PianoHandler.clients.append(self)
        self.set_nodelay(True)
        pass

    def data_received(self, chunk):
        pass

    def on_message(self, message):
        data = json.loads(message)

        for client in PianoHandler.clients:
            client.write_message(
                data
            )

    def on_close(self):
        PianoHandler.clients.remove(self)