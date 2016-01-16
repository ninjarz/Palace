import time


class Player:
    def __init__(self, **info):
        self.name = ""
        self.alive = True
        self.x = 0.0
        self.y = 0.0
        self.speed = 8
        self.point = 0
        self.last_time = time.time()

        for key in info:
            self[key] = info[key]

    def __getitem__(self, key):
        return getattr(self, key)

    def __setitem__(self, key, value):
        setattr(self, key, value)