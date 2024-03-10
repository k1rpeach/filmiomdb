let themeBtn = document.querySelector('.themeChange')
themeBtn.addEventListener('click', changeTheme)

let loader = document.querySelector('.loader')

function changeTheme() {
    let body = document.querySelector('body')
    // let currentTheme = body.getAttribute('data-theme')
    let currentTheme = localStorage.getItem('theme')
    if(currentTheme == "dark") {
        body.setAttribute('data-theme', 'white')
        localStorage.setItem('theme', 'white');
    } else {
        body.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark');
    }
}

function startTheme() {
    let theme =  localStorage.getItem('theme')
    let body = document.querySelector('body')
    if(theme == "dark") {
        body.setAttribute('data-theme', 'dark')
    } else {
       body.setAttribute('data-theme', 'white')
    }
}

startTheme()

async function sendRequest(url, method, data) {

    if(method == "POST") {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    
        response = await response.json()
        return response
    } else if(method == "GET") {
        url = url+"?"+ new URLSearchParams(data)
        let response = await fetch(url, {
            method: "GET",
            // headers: {
            //     'Accept': 'application/json',
            //     'Content-Type': 'application/json'
            // }
        })
        response = await response.json()
        return response
    }
}

let searchForm = document.querySelector('#searchForm')
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    search()
})


async function search() {
    let searchQuery = document.getElementsByName('search')[0].value

    loader.classList.add('active')

    let movie = document.querySelector('.movie')
    movie.classList.remove('active')
    let similar = document.querySelector('.similar')
    similar.innerHTML = ""

    let response = await sendRequest('https://www.omdbapi.com/', "GET", {"apikey":"1b7ff984", "t": searchQuery})
    if(response.Response == "False") {
        let error = document.querySelector('.error')
        error.classList.add('active')
        error.innerHTML = "Фильм не найден"
        loader.classList.remove('active')
    } else {
        let error = document.querySelector('.error')
        error.classList.remove('active')

        showFilm(response)

        similarResult(searchQuery)
        loader.classList.remove('active')
    }
}

function showFilm(obj) {

    let movieTitle = document.querySelector('.movieTitle')
    movieTitle.innerHTML = obj.Title

    let poster = document.querySelector('.movieCover')
    poster.setAttribute('src', obj.Poster)

    let favBtn = document.querySelector('.movieData .favorite')
    favBtn.setAttribute('data-title', obj.Title)
    favBtn.setAttribute('data-poster', obj.Poster)
    favBtn.setAttribute('data-imdbID', obj.imdbID)


    let movieFullData = document.querySelector('.movieFullData')
    movieFullData.innerHTML = ""

    let arr = ['Genre', 'imdbRating', 'Year', 'Released', 'Type', 'Runtime', 'Writer', 'Plot', 'Language', 'Country', 'Actors']

    for(let elem of arr) {
        if(obj[elem]) {
            movieFullData.innerHTML = movieFullData.innerHTML + `
            <div class="movieLine">
                <div class="lineTitle">
                    ${elem}
                </div>
                <div class="lineData">
                    ${obj[elem]}
                </div>
            </div>` 
        }
    }

    let movie = document.querySelector('.movie')
    movie.classList.add('active')
}

async function similarResult(query) {
    let response = await sendRequest('https://www.omdbapi.com/', "GET", {"apikey":"1b7ff984", "s": query})
    if(response.Response == "False") {
        let similarLine = document.querySelector('.similarLine')
        similarLine.innerHTML = 'Похожих фильмов 0'
    } else {
        showSimilarFilms(response.Search)
        let similarLine = document.querySelector('.similarLine')
        similarLine.innerHTML = `Похожих фильмов ${response.totalResults}`
    }
}

function showSimilarFilms(arr) {
    let similar = document.querySelector('.similar')
    similar.innerHTML = ""

    for(let movie of arr) {
        similar.innerHTML = similar.innerHTML + `
        <div class="similarMovie">
            <div class="favorite"
            data-title="${movie.Title}"
            data-poster="${movie.Poster}"
            data-imdbID="${movie.imdbID}">
            </div>
            <img src="${movie.Poster}">
            <div class="title">${movie.Title}</div>
        </div>`
    }
    let favoriteBtns = document.querySelectorAll('.favorite')
    favoriteBtns.forEach((btn) => {
    btn.addEventListener('click', addFav)
})
}

function addFav() {
    let elem = event.target;

    let title = elem.getAttribute('data-title');
    let poster = elem.getAttribute('data-poster');
    let imdbID = elem.getAttribute('data-imdbID');

    let obj = {title, poster, imdbID};

    let favs = localStorage.getItem('favs');
    if (!favs) {
        favs = [];
    } else {
        favs = JSON.parse(favs);
    }

    const index = favs.findIndex(movie => movie.imdbID === imdbID);

    if (index !== -1) {
        favs.splice(index, 1);
        elem.classList.remove('active'); 
    } else {
        favs.push(obj);
        elem.classList.add('active'); 
    }

    localStorage.setItem('favs', JSON.stringify(favs));
}

function addFavToLS(movie) {
    let favs = localStorage.getItem('favs')
    if(!favs) {
        favs = []
        favs.push(movie)
        localStorage.setItem('favs', JSON.stringify(favs))
    } else {
        favs = JSON.parse(favs)
        favs.push(movie)
        localStorage.setItem('favs', JSON.stringify(favs))
    }
}


