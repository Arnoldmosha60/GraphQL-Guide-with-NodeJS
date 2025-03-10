import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import _db from "./_db.js";

const resolvers = {
    Query: {
        games() {
            return _db.games
        },
        game(_, args) {
            return _db.games.find((game) => game.id === args.id)
        },
        authors() {
            return _db.authors
        },
        author(_, args) {
            return _db.authors.find((author) => author.id === args.id)
        },
        reviews() {
            return _db.reviews
        },
        review(_, args) {
            return _db.reviews.find((review) => review.id === args.id)
        }
    },
    Game: {
        reviews(parent) {
            return _db.reviews.filter((r) => r.game_id === parent.id)
        }
    },
    Author: {
        reviews(parent) {
            return _db.reviews.filter((a) => a.author_id === parent.id)
        }
    },
    Review: {
        author(parent) {
            return _db.authors.find((a) => a.id === parent.author_id)
        },
        game(parent) {
            return _db.games.find((g) => g.id === parent.game_id)
        }
    },
    Mutation: {
        deleteGame(_, args) {
            _db.games = _db.games.filter((game) => game.id !== args.id)
            return _db.games
        },
        addGame(_, args) {
            const newGame = {
                ...args.game,
                id: Math.floor(Math.random() * 1000).toString()
            }
            _db.games.push(newGame)

            return newGame
        },
        updateGames(_, args) {
            _db.games = _db.games.map((game) => {
                if (game.id === args.id) {
                    return {
                        ...game,
                        ...args.edits
                    }
                }
                return game
            })
            return _db.games.find((game) => game.id === args.id)
        }
    }
}

const server = new ApolloServer({
    typeDefs,  // definition of your schemas
    resolvers  // map the typeDefs to get the data from db
});

const { url } = await startStandaloneServer(server, {
    listen: {
        port: 4000
    }
});

console.log("Server listening at port", 4000);