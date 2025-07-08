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
document.addEventListener("DOMContentLoaded", () => {
  //----------//
  const searchForm = document.querySelector("#search");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.querySelector("#pokeInput");
    displayPoke(input.value);
  });

  const getRandPokemon = document.querySelector("#getRandPokemon");
  getRandPokemon.addEventListener("click", () => {
    const id = getRandomInt(1, 1025);
    displayPoke(id);
  });

  async function displayPoke(pokemon) {
    const displayBox = document.querySelectorAll(".PokemoninfoContainer");
    for (item of displayBox) {
      item.remove();
    }
    const data = await getPokemon(pokemon);
    const colorData = await getPokemonColor(pokemon);
    const container = document.createElement("div");
    container.className = "PokemoninfoContainer";
    for (let sheet of document.styleSheets) {
      try {
        for (let rule of sheet.cssRules) {
          if (rule.selectorText === ".PokemoninfoContainer") {
            if (colorData.color.name !== "white") {
              rule.style.border = "5px solid " + colorData.color.name;
              rule.style.backgroundColor = tinycolor
                .mix(colorData.color.name, "white", 50)
                .toHexString();
            } else {
              rule.style.backgroundColor = "white";
              rule.style.border = "5px solid lightgray";
            }
          }
        }
      } catch (e) {
        if (e.name !== "SecurityError") throw e; // only skip SecurityErrors
        continue; // skip inaccessible stylesheets
      }
    }

    const artwork_url = data.sprites.other["official-artwork"].front_default;
    const PokeName = document.createElement("p");
    const description = document.createElement("p");
    const img = document.createElement("img");
    let abilityText = data.abilities[0].ability.name;

    if (abilityText.includes("-")) {
      abilityText = abilityText.replace("-", " ");
    }
    img.src = artwork_url;
    let nameText = data.name;
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

    document.getElementById("containerArea").appendChild(container);
  }

  //Async function to return a random pokemon
  async function getPokemon(name) {
    url = "https://pokeapi.co/api/v2/pokemon/" + name;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error!`);
      } else {
        const json = await response.json();
        return json;
      }
    } catch (e) {
      const err = document.querySelector("#errMsg");
      err.innerText = `Pokemon id/name '${name}' out of range or incorrect.`;
      err.style.visibility = "visible";
      const menu = document.querySelector("#main_menu");
      menu.appendChild(err);
    }
    return;
  }

  async function getPokemonColor(name) {
    url = "https://pokeapi.co/api/v2/pokemon-species/" + name;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error!`);
      } else {
        const json = await response.json();
        return json;
      }
    } catch (e) {
      console.log(e);
    }
    return;
  }
});
