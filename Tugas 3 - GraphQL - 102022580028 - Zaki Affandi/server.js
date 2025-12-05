const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
app.use(cors());

const schema = buildSchema(`
  type KucingBuronan {
    id: ID
    nama: String
    kejahatan: String
    imbalan: String
    urlGambar: String
  }

  type Query {
    ambilSemuaBuronan: [KucingBuronan]
    ambilBuronan(id: ID): KucingBuronan
  }

  type Mutation {
    laporBuronan(nama: String!, kejahatan: String!, imbalan: String!): KucingBuronan
  }
`);

const databaseKriminal = [
  { 
    id: 1, 
    nama: "Oyen Destruktor", 
    kejahatan: "Memecahkan Vas Bunga Ibu", 
    imbalan: "2 Sachet Whiskas",
    urlGambar: "https://robohash.org/OyenDestruktor?set=set4&size=150x150"
  },
  { 
    id: 2, 
    nama: "Si Belang", 
    kejahatan: "Tidur di Atas Keyboard", 
    imbalan: "Elusan Perut 5 Menit",
    urlGambar: "https://robohash.org/SiBelang?set=set4&size=150x150"
  }
];

const root = {
  ambilSemuaBuronan: () => databaseKriminal,
  
  ambilBuronan: ({ id }) => databaseKriminal.find(k => k.id == id),

  laporBuronan: ({ nama, kejahatan, imbalan }) => {
    const idBaru = databaseKriminal.length + 1;
    const gambarOtomatis = `https://robohash.org/${nama.replace(/\s/g, '')}?set=set4&size=150x150`;
    
    const buronanBaru = {
      id: idBaru,
      nama,
      kejahatan,
      imbalan,
      urlGambar: gambarOtomatis
    };
    databaseKriminal.push(buronanBaru);
    return buronanBaru;
  }
};

app.use("/graphql", graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));

app.listen(4003, () => console.log("API Siap di http://localhost:4003/graphql"));