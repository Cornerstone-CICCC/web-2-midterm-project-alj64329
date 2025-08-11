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
            displayTrending(movies)
        },
        error: function(error){
            console.log(error)
        }
    })

    // Genre List
    $.ajax({
        url:`${baseUrl}/genre/movie/list`,
        method: "GET",
        headers:{
            accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYmY1ZDNhYjhmODc2ODA4M2JjZGE5NjFlZmFlYzg4MyIsIm5iZiI6MTc1MTc1NTg0Ni41MDg5OTk4LCJzdWIiOiI2ODY5YWM0NmQwMjQ5MzllYzJjZWRlYzEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vBj2VAqD26ak79QDo-Hj5_farUOwsJJ19Kcf1HHBO9c'
        },
        success: function(response){
        
            console.log(response)
        },
        error: function(error){
            console.log(error)
        }
    })

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
        $.ajax({
        url:`${baseUrl}/discover/movie?with_genres=28&sort_by=popularity.desc`,
        method: "GET",
        headers:{
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYmY1ZDNhYjhmODc2ODA4M2JjZGE5NjFlZmFlYzg4MyIsIm5iZiI6MTc1MTc1NTg0Ni41MDg5OTk4LCJzdWIiOiI2ODY5YWM0NmQwMjQ5MzllYzJjZWRlYzEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vBj2VAqD26ak79QDo-Hj5_farUOwsJJ19Kcf1HHBO9c'
        },
        success: function(response){
            console.log(response)
        },
        error: function(error){
            console.log(error)
        }
        })


    })

})

function displayTrending(movies){
    const container = $('.movies-container')
    const h3 = $('<h3></h3>')
    h3.text('Trending')
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
        img.attr("id", movieId)
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