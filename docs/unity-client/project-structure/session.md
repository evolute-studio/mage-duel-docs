---
sidebar_position: 3
---

# Session

The main session script is **SessionManager** which has a compositional structure and organizes modules that manage the session.
Main modules:
- **GameLoopManager** - fully responsible for turn changes and their processing
- **PlayersManager** - responsible for spawning, configuring, and appearance of players
- **JokerManager** - responsible for using jokers
- **ContestManager** - responsible for structure contests on the board

It also contains two important classes:
- **SessionManagerContext** - contains the main and additional modules of **SessionManager**. It's convenient to access from one module to another through this.
- **SessionContext** - contains all structures and fields needed for the session. 