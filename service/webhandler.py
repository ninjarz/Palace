import random

from service.basehandler import *

users = {}
goblin = {
    "x": 0,
    "y": 0
}


class MainHandler(BaseHandler):
    def get(self):
        self.render("index.html")


class GameHandler(BaseHandler):
    # @tornado.web.authenticated
    def post(self):
        name = ""
        if not self.get_secure_cookie("user"):
            self.set_secure_cookie("user", self.request.remote_ip)
            name = str(self.request.remote_ip)
        else:
            name = str(self.get_secure_cookie("user"), encoding="utf-8")
        if name not in users:
            users[name] = {
                "name": name,
                "point": 0
            }

        user = users[name]
        user["x"] = float(self.get_argument("x"))
        user["y"] = float(self.get_argument("y"))

        if user["x"] <= goblin["x"] + 32 and goblin["x"] <= user["x"] + 32 and \
           user["y"] <= goblin["y"] + 32 and goblin["y"] <= user["y"] + 32:
            user["point"] += 1
            goblin["x"] = 32 + (random.random() * (787 - 64))
            goblin["y"] = 32 + (random.random() * (480 - 64))

        self.write(
            {
                "name": name,
                "users": users,
                "goblin": goblin
            }
        )