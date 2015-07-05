import random

from game.goblin.map import *
from game.goblin.player import *
from game.goblin.enemy import *


class Game():
    def __init__(self):
        self.map = Map()
        self.players = {}
        self.enemies = []
        self.create_enemy()

    def create_player(self, name):
        self.players[name] = Player(name=name)

    def create_enemy(self):
        enemy = Goblin(x=random.random() * (self.map.width - 1), y=random.random() * (self.map.height - 1))
        self.enemies.append(enemy)

    def recast_enemy(self, enemy):
        enemy.x = random.random() * (self.map.width - 1)
        enemy.y = random.random() * (self.map.height - 1)

    def action(self, name, actions):
        player = self.players[name]
        actions = list(set(actions))

        time_delta = min(time.time() - player.last_time, 1)
        if 38 in actions:
            player.y -= player.speed * time_delta
        if 40 in actions:
            player.y += player.speed * time_delta
        if 37 in actions:
            player.x -= player.speed * time_delta
        if 39 in actions:
            player.x += player.speed * time_delta
        player.last_time += time_delta

        for enemy in self.enemies:
            if enemy.alive and \
               player.x <= enemy.x + 1 and enemy.x <= player.x + 1 and \
               player.y <= enemy.y + 1 and enemy.y <= player.y + 1:
                player.point += 1
                self.recast_enemy(enemy)
