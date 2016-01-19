import tornado.ioloop
import tornado.web
import tornado.httputil
import tornado.autoreload
import base64
import uuid

from config import *
from service.webhandler import *
from service.wshandler import *


class Server:
    def __init__(self):
        self.application = tornado.web.Application(
            [
                (r"/", MainHandler),
                (r"/goblin", GoblinHandler),
                (r"/piano", PianoHandler),
                (r"/web/(.*)", tornado.web.StaticFileHandler, dict(path=config_data['template_path'])),
            ],
            template_path=config_data['template_path'],
            cookie_secret=base64.b64encode(uuid.uuid4().bytes + uuid.uuid4().bytes),
            login_url=r"/",
        )

    def run(self):
        self.application.listen(8080)
        tornado.ioloop.IOLoop.instance().start()
