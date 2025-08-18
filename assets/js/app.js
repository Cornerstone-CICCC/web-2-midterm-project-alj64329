const baseUrl = 'https://api.themoviedb.org/3'
const baseImgUrl = `https://image.tmdb.org/t/p/original`

$(function(){
    const currentTheme = localStorage.getItem('theme')

    if (currentTheme === 'dark') {
        $('body').addClass('dark-mode')
        $('.btn-mode').prop('checked',true)
    }

    // Get Trend
    $.ajax({
        url:`${baseUrl}/trending/movie/day`,
        method: "GET",
        headers:{
            accept: 'application/json',
            Authorization: `Bearer ${YOUR_TMDB_API_KEY}`
        },
        success: function(response){
            const movies = response.results.slice(0,20)
            displayMovies(movies, 'Trending')

        },
        error: function(error){
            console.log(error)
        }
    })

    // Genre List
    let genres =[]
    $.ajax({
        url:`${baseUrl}/genre/movie/list`,
        method: "GET",
        headers:{
            accept: 'application/json',
            Authorization: `Bearer ${YOUR_TMDB_API_KEY}`
        },
        success: function(response){
            genres = response.genres
        },
        error: function(error){
            console.log(error)
        }
    })

    // Event
    // Dark-Light mode
    $('.btn-mode').on('click', function(){
        $('body').toggleClass('dark-mode',this.checked)

        localStorage.setItem('theme', this.checked ? 'dark': 'light')
    })

    // Movie Search
    $('.btn-search').on('click',function(){
        const query = $('.search-container input').val()

        if(query!==""){
            $.ajax({
                url:`${baseUrl}/search/movie?query=${encodeURIComponent(query)}&sort_by=popularity.desc`,
                method: "GET",
                headers:{
                    accept: 'application/json',
                    Authorization: `Bearer ${YOUR_TMDB_API_KEY}`
                },
                success: function(response){
                    const results = response.results
                    $('.movies-container').html('')
                    $('.search-results-container').html('')
                    displayResults(results)
                    $('html, body').animate({
                        scrollTop: $('#search-results').offset().top
                    },500)
                },
                error: function(error){
                    console.log(error)
                }
            })

            $('.search-container input').val("")

        }
    })

    // Genre switch
    $('.icon-container').on('click',function(){
        const type = $(this).find('.genre-text').text()
        const genreId = genres.filter(obj=> obj.name === type)[0].id
        console.log(type,genreId)
 
        $.ajax({
        url:`${baseUrl}/discover/movie?with_genres=${genreId}&language=en-US&sort_by=popularity.desc`,
        method: "GET",
        headers:{
            accept: 'application/json',
            Authorization: `Bearer ${YOUR_TMDB_API_KEY}`
        },
        success: function(response){
            const movies = response.results
            $('.movies-container').html("")
            $('.search-results-container').html("")
            displayMovies(movies, type)
        },
        error: function(error){
            console.log(error)
        }
        })
    })

    // Show modal
    $('.movies-container,.search-results-container,.picks-container').on('click', '.movie-pic', function(){
        const movieId = $(this).find('img').attr('movieId')
        fetchVideo(baseUrl,movieId)
    })

    // Modal close
    $('.movies-container,.search-results-container, .picks-container').on('click','.modal-btn', function(){
        $('.movies-container div, .picks-container div').removeClass('overlay')
        $('.modal').css({
        'display':'none'
        })
    })

    $('.movies-container,.search-results-container, .picks-container').on('click', '.overview-text',function(){
        console.log('click')
        $('.modal-overview').slideToggle()
    })


})


function displayMovies(movies, h3Text){
    const container = $('.movies-container')

    const h3 = $('<h3></h3>')
    h3.text(h3Text)
    container.append(h3)

    const subContainer = $('<div></div>')
    subContainer.addClass('movies-list')
    container.append(subContainer)

    movies.forEach(movie => {
        const movieId = movie.id
        const imagePath = movie.poster_path
        const movieName = movie.title

        const div = $('<div></div>').addClass("movie-pic")
        subContainer.append(div)
        const img =$('<img>')
        img.attr("movieId", movieId)
        img.attr('src', `${baseImgUrl}/${imagePath}`)
        div.append(img)

        // add title for hover effect
        const titleDiv = $('<div></div>').text(movieName)
        titleDiv.addClass("title-line")
        $(img).after(titleDiv)

    });
}

function displayResults(movies){
    const container = $('.search-results-container')
    const num = movies.length
    const h3 = $('<h3></h3>')
    h3.text(num>0?"Results":"No Movies Found")
    h3.attr('id','result-head')
    container.append(h3)

    const subContainer = $('<div></div>')
    subContainer.addClass('movies-list')
    container.append(subContainer)

    movies.forEach(movie => {
    const movieId = movie.id
    const imagePath = movie.poster_path === null? './public/no-image.svg':`https://image.tmdb.org/t/p/original/${movie.poster_path}`
    const movieName = movie.title

    const div = $('<div></div>').addClass("movie-pic")
    subContainer.append(div)
    const img =$('<img>')
    img.attr("movieId", movieId)
    img.attr('src', imagePath)
    div.append(img)

    // add title for hover effect
    const titleDiv = $('<div></div>').text(movieName)
    titleDiv.addClass("title-line")
    $(img).after(titleDiv)

    });

}

function displayModal(movie, youtubeUrl){
    const container = $('.movies-container').length ? $('.movies-container'):$('.picks-container')

    const div = $('<div></div>')
    container.append(div)
    div.addClass('overlay')

    const modal = $('<div></div>')
    modal.addClass('modal')

    // extract some data
    const year = movie.release_date.split('-')[0]
    const category= movie.genres.map(genre => genre.name)
    
// ${youtubeUrl?`<iframe width="100%" height ="100%" src="${youtubeUrl}" frameborder = "0" allowfullscreen></iframe>`:
// <div class="video-container ${youtubeUrl?"":"no-video"} ">
    modal.html(`
        <div class="video-container ${youtubeUrl?"":"no-video"} ">
            ${youtubeUrl?`<iframe width="100%" height ="100%" src="${youtubeUrl}" frameborder = "0" allowfullscreen></iframe>`:
            `<div class="modal-novideo">${movie.title}</div>`}
        </div>
        <div class="modal-des">
            <div class ="subline">
                <div>${year}</div>
                <div>⭐${movie.vote_average}</div>
            </div>

            <div class="modal-tagline">${movie.tagline!==""? `"${movie.tagline}"` :""}</div>

            <div class="modal-genres">
            </div>

            <div class="overview-text">Overview: </div>
            <div class="modal-overview">${movie.overview}</div>

            <div class ="modal-btn">CLOSE</div>
        </div>

    `)

    div.append(modal)

    // append category
    $.each(category, function(i, value){
        $('.modal-genres').append("<div>"+value+"</div>")
    })

}

// video data
function fetchVideo(baseUrl,movieId){
    
    $.ajax({
        url:`${baseUrl}/movie/${movieId}/videos?language=en-US`,
        method: "GET",
        headers:{
            accept: 'application/json',
            Authorization: `Bearer ${YOUR_TMDB_API_KEY}`
        },
        success: function(response){
            const results = response.results

            let videoKey=null

            if(results.length !==0){
                const filteredResults = results.filter(el =>el.site.toLowerCase()==="youtube" && (el.type.toLowerCase() === "teaser"||el.type.toLowerCase() === "trailer"))
                videoKey = filteredResults[0].key
            }

            const youtubeUrl = videoKey?`https://www.youtube.com/embed/${videoKey}`:null

            fetchMovie(movieId, youtubeUrl)
        },
        error: function(error){
            console.log(error)
        }
    })
}

// movie detail
function fetchMovie(movieId, youtubeUrl){
    $.ajax({
        url:`${baseUrl}/movie/${movieId}`,
        method: "GET",
        headers:{
            accept: 'application/json',
            Authorization: `Bearer ${YOUR_TMDB_API_KEY}`
        },
        success: function(response){
            displayModal(response, youtubeUrl)
        },
        error: function(error){
            console.log(error)
        }
    })
}
