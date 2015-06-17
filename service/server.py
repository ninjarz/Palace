import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.httputil
import tornado.autoreload

from config import *
from service.webhandler import *

if __name__ == "__main__":
    application = tornado.web.Application(
        [
            (r"/", MainHandler),
            (r"/web/(.*)", tornado.web.StaticFileHandler, dict(path=config_data['template_path'])),
        ],
        template_path=config_data['template_path']
    )
    application.listen(8080)
    loop = tornado.ioloop.IOLoop.instance()
    tornado.autoreload.start(loop)
    loop.start()