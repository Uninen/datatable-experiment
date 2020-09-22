import { Server, Model, Factory } from 'miragejs'
import faker from 'faker'

export function makeServer() {
  new Server({
    routes() {
      this.get('/movies', (schema) => {
        return schema.movies.all()
      })
      this.get('/artists', (schema) => {
        return schema.artists.all()
      })
    },

    models: {
      artist: Model,
      movie: Model,
    },

    factories: {
      movie: Factory.extend({
        title(i: number) {
          return `Movie ${i}`
        },

        releaseDate() {
          return faker.date.past().toLocaleDateString()
        },

        genre(i: number) {
          const genres = ['Sci-Fi', 'Drama', 'Comedy']

          return genres[i % genres.length]
        },
      }),
      artist: Factory.extend({
        // {
        //   name: 'Danacat',
        //   photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/maxlinderman/128.jpg',
        //   eventsPlayed: 1,
        //   subscriptionType: 'Rockstar',
        //   isVip: false,
        //   created: '2020-09-15T11:50:04+0300',
        // }
        name() {
          return faker.name.findName()
        },

        photo() {
          return faker.image.avatar()
        },

        eventsPlayed() {
          return faker.random.number(200)
        },

        subscriptionType(i: number) {
          const subs = [null, 'Pro', 'Rockstar', 'Superstar']
          return subs[i % subs.length]
        },

        isVip() {
          return faker.random.boolean()
        },

        created() {
          return faker.date.past()
        },
      }),
    },

    seeds(server) {
      server.createList('artist', 150)
    },
  })
}
