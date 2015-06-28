from service.basehandler import *


class MainHandler(BaseHandler):
    def get(self):
        self.render("index.html")