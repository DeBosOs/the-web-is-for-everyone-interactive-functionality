// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine('liquid', engine.express());

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')


console.log('Let op: Er zijn nog geen routes. Voeg hier dus eerst jouw GET en POST routes toe.')

/*
// Zie https://expressjs.com/en/5x/api.html#app.get.method over app.get()
app.get(…, async function (request, response) {
  
  // Zie https://expressjs.com/en/5x/api.html#res.render over response.render()
  response.render(…)
})
*/

/*
// Zie https://expressjs.com/en/5x/api.html#app.post.method over app.post()
app.post(…, async function (request, response) {

  // In request.body zitten alle formuliervelden die een `name` attribuut hebben in je HTML
  console.log(request.body)

  // Via een fetch() naar Directus vullen we nieuwe gegevens in

  // Zie https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch over fetch()
  // Zie https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify over JSON.stringify()
  // Zie https://docs.directus.io/reference/items.html#create-an-item over het toevoegen van gegevens in Directus
  // Zie https://docs.directus.io/reference/items.html#update-an-item over het veranderen van gegevens in Directus
  await fetch(…, {
    method: …,
    body: JSON.stringify(…),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });

  // Redirect de gebruiker daarna naar een logische volgende stap
  // Zie https://expressjs.com/en/5x/api.html#res.redirect over response.redirect()
  response.redirect(303, …)
})
*/


// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// homepagina
app.get('/', async function (request, response) {
  const personResponse = await fetch ('https://fdnd-agency.directus.app/items/dropandheal_task')
  
  const personResponseJSON = await personResponse.json()

  response.render('index.liquid', { persons: personResponseJSON.data })
})

app.get('/schrijfopdracht', async function (request, response) {
  const personResponse = await fetch ('https://fdnd-agency.directus.app/items/dropandheal_task')
  
  const personResponseJSON = await personResponse.json()

  response.render('schrijfopdracht.liquid', { persons: personResponseJSON.data })
})

app.get('/community-drop', async function (request, response) {
  console.log("GET community drops")
  const messagesAPI = await fetch ('https://fdnd-agency.directus.app/items/dropandheal_messages?limit=-1&sort=-date_created')
  
  const messagesJSON = await messagesAPI.json()

  response.render('community-drop.liquid', { messages: messagesJSON.data })
})

app.get('/all-drops', async function (request, response) {

  const messagesAPI = await fetch ('https://fdnd-agency.directus.app/items/dropandheal_messages?limit=-1&sort=-date_created')
  
  const messagesJSON = await messagesAPI.json()

  response.render('all-drops.liquid', { messages: messagesJSON.data })
})


/*
  await fetch('https://fdnd.directus.app/items/messages/', {
    method: 'POST',
    body: JSON.stringify({
      for: `Team ${teamName}`,
      from: request.body.from,
      text: request.body.text
    }),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });

  response.redirect(303, '/')

Directus url: https://fdnd-agency.directus.app/items/dropandheal_messages
      {
      "concept": false,
      "id": 130,
      "exercise": null,
      "text": "31/3",
      "from": "Mikiyas",
      "date_created": "2025-03-31T19:05:33.153Z"
    }
*/

app.post('/messages/', async function (request, response) {
  console.log("POST messages")
  console.log(request.body)
 
  const postResponse = await fetch('https://fdnd-agency.directus.app/items/dropandheal_messages?limit=-1', {
    method: 'POST',
    body: JSON.stringify({
      from: request.body.from,
      text: request.body.text
    }),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
  console.log(postResponse);
 // Redirect de gebruiker daarna naar een logische volgende stap
  response.redirect(303, `/community-drop`);
})

app.use((req, res, next) => {
  res.status(404).render("error.liquid")
  })

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console
  console.log(`Daarna kun je via http://localhost:${app.get('port')}/ jouw interactieve website bekijken.\n\nThe Web is for Everyone. Maak mooie dingen 🙂`)
})

