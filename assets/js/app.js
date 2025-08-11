$(function(){
     const baseUrl = 'https://api.themoviedb.org/3'
    $.ajax({
        url:`${baseUrl}/trending/movie/day`,
        method: "GET",
        headers:{
            accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYmY1ZDNhYjhmODc2ODA4M2JjZGE5NjFlZmFlYzg4MyIsIm5iZiI6MTc1MTc1NTg0Ni41MDg5OTk4LCJzdWIiOiI2ODY5YWM0NmQwMjQ5MzllYzJjZWRlYzEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vBj2VAqD26ak79QDo-Hj5_farUOwsJJ19Kcf1HHBO9c'
        },
        success: function(response){
            const movies = response.results
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
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYmY1ZDNhYjhmODc2ODA4M2JjZGE5NjFlZmFlYzg4MyIsIm5iZiI6MTc1MTc1NTg0Ni41MDg5OTk4LCJzdWIiOiI2ODY5YWM0NmQwMjQ5MzllYzJjZWRlYzEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vBj2VAqD26ak79QDo-Hj5_farUOwsJJ19Kcf1HHBO9c'
        },
        success: function(response){
            genres = response.genres
        },
        error: function(error){
            console.log(error)
        }
    })


    // movie detail
    function fetchMovie(movieId, ){
        $.ajax({
            url:`${baseUrl}/movie/${movieId}`,
            method: "GET",
            headers:{
                accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYmY1ZDNhYjhmODc2ODA4M2JjZGE5NjFlZmFlYzg4MyIsIm5iZiI6MTc1MTc1NTg0Ni41MDg5OTk4LCJzdWIiOiI2ODY5YWM0NmQwMjQ5MzllYzJjZWRlYzEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vBj2VAqD26ak79QDo-Hj5_farUOwsJJ19Kcf1HHBO9c'
            },
            success: function(response){
                console.log(response)
                displayModal(response, genres)
            },
            error: function(error){
                console.log(error)
            }
        })
    }


    // Event
    // Dark-Light mode
    $('.btn-mode').on('click', function(){
        $('.main-container').toggleClass('dark')
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
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYmY1ZDNhYjhmODc2ODA4M2JjZGE5NjFlZmFlYzg4MyIsIm5iZiI6MTc1MTc1NTg0Ni41MDg5OTk4LCJzdWIiOiI2ODY5YWM0NmQwMjQ5MzllYzJjZWRlYzEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vBj2VAqD26ak79QDo-Hj5_farUOwsJJ19Kcf1HHBO9c'
                },
                success: function(response){
                    const results = response.results
                    $('.movies-container').addClass('hide')
                    displayResults(results)
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
 
        $.ajax({
        url:`${baseUrl}/discover/movie?with_genres=${genreId}&language=en-US&sort_by=popularity.desc`,
        method: "GET",
        headers:{
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYmY1ZDNhYjhmODc2ODA4M2JjZGE5NjFlZmFlYzg4MyIsIm5iZiI6MTc1MTc1NTg0Ni41MDg5OTk4LCJzdWIiOiI2ODY5YWM0NmQwMjQ5MzllYzJjZWRlYzEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vBj2VAqD26ak79QDo-Hj5_farUOwsJJ19Kcf1HHBO9c'
        },
        success: function(response){
            const movies = response.results
            $('.movies-container').html("")
            displayMovies(movies, type)
        },
        error: function(error){
            console.log(error)
        }
        })


    })


    // Show modal
    $('.movies-container').on('click', '.movie-pic', function(){
        const movieId = $(this).find('img').attr('movieId')
        fetchMovie(movieId)
    },)

    // Modal close
    $('.movies-container').on('click','.modal-btn', function(){
        $('.movies-container div').removeClass('overlay')
        $('.modal').css({
        'display':'none'
        })
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
        img.attr('src', `https://image.tmdb.org/t/p/original/${imagePath}`)
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
    h3.text(num>0?`${num} Movies Found`:"No Movies Found")
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
    img.attr("id", movieId)
    img.attr('src', imagePath)
    div.append(img)

    // add title for hover effect
    const titleDiv = $('<div></div>').text(movieName)
    titleDiv.addClass("title-line")
    $(img).after(titleDiv)

    });

}

function displayModal(movie){
    const container = $('.movies-container')

    const div = $('<div></div>')
    container.append(div)
    div.addClass('overlay')

    const modal = $('<div></div>')
    modal.addClass('modal')

    // extract some data
    const year = movie.release_date.split('-')[0]
    const category= movie.genres.map(genre => genre.name)


    modal.html(`
        <div>
            <img src=https://image.tmdb.org/t/p/original/${movie.backdrop_path} alt ="backdrop img" class="modal-img">
        </div>
        <div>
            <div class="modal-title">${movie.title}</div>
            <div>${year}</div>

            <div class="modal-genres">
            </div>

            <div class ="modal-overview">${movie.tagline}</div>

        </div>
        <div  class ="modal-btn">CLOSE</div>
    `)

    div.append(modal)

    // append category
    $.each(category, function(i, value){
        $('.modal-genres').append("<div>"+value+"</div>")
    })

}