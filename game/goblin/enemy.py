

class Goblin():
    def __init__(self, **info):
        self.alive = True
        self.x = 0.0
        self.y = 0.0

        for key in info:
            self[key] = info[key]

    def __getitem__(self, key):
        return getattr(self, key)

    def __setitem__(self, key, value):
        setattr(self, key, value)