let currentPageUrl = 'https://swapi.dev/api/people/';

class LoadingClass {
  constructor() {

    this.preloader = document.querySelector('.preloader');
    this.loader = document.querySelector('.loader');
    this.loading = true;
  }

  timeOut() {

    this.preloader.style.visibility = 'hidden';
    this.loader.style.visibility = 'hidden';
  };
}

const newLoading = new LoadingClass();

window.onload = async () => {

  let buttons = document.querySelector('.buttons');
  let footer = document.querySelector('.footer-logo');
  
  try {
  
    await loadCharacters(currentPageUrl);

    buttons.style.visibility = 'visible';
    footer.style.visibility = 'visible';
    
    newLoading.loading = false;

    if (!newLoading.loading) {
      newLoading.timeOut();
    }
    
  } catch (error) {
    console.log(error);
    alert('Erro ao carregar cards');
  }

  const nextButton = document.getElementById('next-button');

  nextButton.addEventListener('click', function() {
      loadNextPage();
      scrollToTop(); 
  });

  const backButton = document.getElementById('back-button');

  backButton.addEventListener('click', function() {
    loadPreviousPage();
    scrollToTop();
  });

};

async function loadCharacters(url) {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = ''; // Limpa os resultados anteriores

  try {

    const response = await fetch(url);
    const responseJson = await response.json();

    responseJson.results.forEach((character) => {

      const card = document.createElement("div");
      card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
      card.className = "cards";

      const characterNameBG = document.createElement("div")
      characterNameBG.className = "character-name-bg"

      const characterName = document.createElement("span")
      characterName.className = "character-name"
      characterName.innerText = `${character.name}`

      characterNameBG.appendChild(characterName)
      card.appendChild(characterNameBG)

      card.onclick = () => {

        const modal = document.getElementById("modal")
        modal.style.visibility = "visible"

        const modalContent = document.getElementById("modal-content")
        modalContent.innerHTML = ''

        const characterImage = document.createElement("div")
        characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
        characterImage.className = "character-image"

        const name = document.createElement("span")
        name.className = "character-details"
        name.innerText = `Nome: ${character.name}`

        const characterHeight = document.createElement("span")
        characterHeight.className = "character-details"
        characterHeight.innerText = `Altura: ${convertHeight(character.height)}`

        const mass = document.createElement("span")
        mass.className = "character-details"
        mass.innerText = `Peso: ${convertMass(character.mass)}`

        const eyeColor = document.createElement("span")
        eyeColor.className = "character-details"
        eyeColor.innerText = `Cor dos olhos: ${convertEyeColor(character.eye_color)}`

        const birthYear = document.createElement("span")
        birthYear.className = "character-details"
        birthYear.innerText = `Nascimento: ${convertBirthYear(character.birth_year)}`

        modalContent.appendChild(characterImage)
        modalContent.appendChild(name)
        modalContent.appendChild(characterHeight)
        modalContent.appendChild(mass)
        modalContent.appendChild(eyeColor)
        modalContent.appendChild(birthYear)
      }
      const mainContent = document.getElementById('main-content');
      mainContent.appendChild(card);

    });

    // Habilita ou desabilita os botões de acordo com a presença de URLs de próxima e página anterior
    const nextButton = document.getElementById('next-button');
    const backButton = document.getElementById('back-button');
    nextButton.disabled = !responseJson.next;
    backButton.disabled = !responseJson.previous;

    backButton.style.visibility = responseJson.previous ? "visible" : "hidden";

    currentPageUrl = url;
  } catch (error) {
    throw new Error('Erro ao carregar personagens');
  }
}

function hideModal() {
  const modal = document.getElementById("modal")
  modal.style.visibility = "hidden"
}

async function loadNextPage() {
  if (!currentPageUrl) return;

  try {

    let buttons = document.querySelector('.buttons');
    let backButton = document.getElementById('back-button');
    let footer = document.querySelector('.footer-logo');

    backButton.style.visibility = 'hidden';
    buttons.style.visibility = 'hidden';
    footer.style.visibility = 'hidden';

    newLoading.preloader.style.visibility = 'visible';
    newLoading.loader.style.visibility = 'visible';

    const response = await fetch(currentPageUrl);
    const responseJson = await response.json();

    await loadCharacters(responseJson.next);

    backButton.style.visibility = 'visible';
    buttons.style.visibility = 'visible';
    footer.style.visibility = 'visible';

    newLoading.loading = false;

    if (!newLoading.loading) {
      newLoading.timeOut();
    }

  } catch (error) {
    console.log(error);
    alert('Erro ao carregar a próxima página');
  }
}

async function loadPreviousPage() {
  if (!currentPageUrl) return;

  try {

    let buttons = document.querySelector('.buttons');
    let backButton = document.getElementById('back-button');
    let footer = document.querySelector('.footer-logo');

    backButton.style.visibility = 'hidden';
    buttons.style.visibility = 'hidden';
    footer.style.visibility = 'hidden';

    newLoading.preloader.style.visibility = 'visible';
    newLoading.loader.style.visibility = 'visible';

    const response = await fetch(currentPageUrl);
    const responseJson = await response.json();

    await loadCharacters(responseJson.previous);

    buttons.style.visibility = 'visible';
    footer.style.visibility = 'visible';

    newLoading.loading = false;

    if (!newLoading.loading) {
      newLoading.timeOut();
    }

  } catch (error) {
    console.log(error);
    alert('Erro ao carregar a página anterior');
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Rola suavemente para o topo
  });
}

function convertEyeColor(eyeColor) {
  const cores = {
    blue: "azul",
    brown: "castanho",
    green: "verde",
    yellow: "amarelo",
    black: "preto",
    pink: "rosa",
    red: "vermelho",
    orange: "laranja",
    hazel: "avela",
    unknown: "desconhecida"
  };

   return cores[eyeColor.toLowerCase()] || eyeColor;
}

function convertHeight(height) {
  if (height === "unknown") {
    return "desconhecida";
  }
  
  return (height / 100).toFixed(2);
}

function convertMass(mass) {
  if (mass === "unknown") {
    return "desconhecido";
  }
  
  return `${mass} kg`;
}

function convertBirthYear(birthYear) {
  if (birthYear === "unknown") {
    return "desconhecido";
  }
  
  return birthYear;
}

