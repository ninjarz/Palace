import tornado.web


class MainHandler(tornado.web.RequestHandler):
    def initialize(self):
        pass

    def data_received(self, chunk):
        print("data:", chunk)
        pass

    def on_finish(self):
        pass

    def get(self):
        print("ip:", self.request.remote_ip)
        self.render("index.html")