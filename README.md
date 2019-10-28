# Afterdark

### Game:
- Unreal Engine 4
- Third Person
- Multiplayer Survival Horror
- Matchmaking through Node.JS server


### NodeJS (matchmaking):
Used by the game to find players and connect them to a game server. The game client connects through sockets to this server and waits until enough players are found for a match. The NodeJS application then instantiates a Game server and instructs all players of a match to go join its specific ip and port.

- Node.JS
- Sockets
- Child Process
