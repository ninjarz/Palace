

class Map():
    def __init__(self, **info):
        self.width = 30
        self.height = 15
        self.map = [[0 for x in range(self.width)] for y in range(self.height)]

        for key in info:
            self[key] = info[key]

    def __getitem__(self, key):
        return getattr(self, key)

    def __setitem__(self, key, value):
        setattr(self, key, value)