// Arrow functions and promise

let PokeAPI = "https://pokeapi.co/api/v2/pokemon";

//-----Helpers-----//
function getRandomInt(min, max) {
  min = Math.ceil(min); // Ensure min is an integer
  max = Math.floor(max); // Ensure max is an integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function title(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

//----------//

//Find random pokemon ID and display name and default front image
function setup() {
  noCanvas();
  getAll() // feel like this is unnecessary to get all. Could just call API with pokemon id and skip this step
    .then((results) => {
      if (results) {
        let pokemonList = results.results;
        document
          .getElementById("button")
          .addEventListener("click", () => dotheThing(pokemonList));
      }
    })
    .catch((err) => console.error(err));
}

function getAll() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=1302"; //1302 is current total of all pokemon
  return fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("failed to fetch Pokemon list.");
      return response.json();
    })
    .catch((err) => console.error(err));
}

function dotheThing(pokeArr) {
  let urls = [];
  for (let i = 0; i < 3; i++) {
    urls.push(pokeArr[getRandomInt(0, pokeArr.length)].url);
  }

  for (let i = 0; i < 3; i++) {
    drawBox(urls[i]);
  }
}

function drawBox(url) {
  const container = document.createElement("div");
  container.className = "PokemoninfoContainer";
  fetch(url)
    .then((results) => results.json())
    .then((json) => {
      let artwork_url = json.sprites.other["official-artwork"].front_default;
      const PokeName = document.createElement("p");
      const description = document.createElement("p");
      const img = document.createElement("img");
      let abilityText = json.abilities[0].ability.name;

      if (abilityText.includes("-")) {
        abilityText = abilityText.replace("-", " ");
      }
      img.src = artwork_url;
      let nameText = json.name;
      if (nameText.includes("-hisui")) {
        nameText = nameText.replace("-hisui", "");
        nameText = "Hisuian " + nameText;
      }
      if (nameText.includes("-galar")) {
        nameText = nameText.replace("-galar", "");
        nameText = "Galarian " + nameText;
      }
      if (nameText.includes("-mega")) {
        nameText = nameText.replace("-mega", "");
        nameText = "Mega " + nameText;
      }
      if (nameText.includes("-alola")) {
        nameText = nameText.replace("-alola", "");
        nameText = "Alolan " + nameText;
      }
      PokeName.textContent = title(nameText);
      description.textContent = `Ability: ${title(abilityText)}`;
      container.appendChild(PokeName);
      container.appendChild(img);
      container.appendChild(description);

      document.getElementById("ContainerArea").appendChild(container);
    });
}

//testing Promises.all
// let promises = [
//   getPokemon(getRandomInt(1, 2000)),
//   getPokemon(getRandomInt(1, 2000)),
//   getPokemon(getRandomInt(1, 2000)),
// ];
// Promise.all(promises)
//   .then((results) => {
//     for (let i = 0; i < results.length; i++) {
//       if (results[i]) {
//         let img = createImg(results[i].img_url);
//         img.size(500, 500);
//         createP(`ID ${results[i].id}: ${title(results[i].name)}`);
//       }
//     }
//   })
//   .catch((err) => console.error(err));
//}

//Async function to return a random pokemon
// async function getPokemon(id) {
//   console.log(id);
//   url = "https://pokeapi.co/api/v2/pokemon/" + id;
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`HTTP error!`);
//     } else {
//       const json = await response.json();
//       return {
//         name: json.name,
//         img_url: json.sprites.other["official-artwork"].front_default,
//         id: id,
//       };
//     }
//   } catch (e) {
//     console.error(`Pokemon id/name '${id}' out of range or incorrect.`);
//   }
//   return;
// }
