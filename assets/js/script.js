const country = "CA"

$(function(){

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

    // Platform List
    let providers =[]
    $.ajax({
        url:`${baseUrl}/watch/providers/movie?watch_region=${country}&language=en-US`,
        method: "GET",
        headers:{
            accept: 'application/json',
            Authorization: `Bearer ${YOUR_TMDB_API_KEY}`
        },
        success: function(response){
            providers = response.results.slice(0,10)
            showIcons(providers)
        },
        error: function(error){
            console.log(error)
        }
    })


    // Submit
    $(".query-form").on ('submit', function(e){
        e.preventDefault()
        $('.picks-container').html('')

        const form = $(this)
        const inputs = Object.fromEntries(new FormData(form[0]).entries())

        let myProviders =[]

        $('input[name="provider"]:checked').each(function(){
            myProviders.push($(this).val())
        })

        inputs.provider = myProviders

        slotMovie(genres, providers, inputs)

        $('html, body').animate({
            scrollTop: $('#picks').offset().top -45
        },1000)

        form[0].reset()
    })


})

function showIcons(providers){
    $.each($('.checkbox-section div'),function(){
        const label = $(this).find('label')
        const inputTag = $(this).find('input')

        // fetch the logo path and id
        const name = inputTag.attr('value').toLowerCase()

        const providerData = providers.filter(obj =>
            obj.provider_name.toLowerCase() === name)[0]

        // Add id and image to html
        const logoId = providerData.logo_path.split('.')[0]
        const img = $('<img>').attr('src',`${baseImgUrl}${providerData.logo_path}`)
        label.append(img)
        inputTag.attr('providerId', providerData.provider_id)
    })
}


// Random movie generator
function slotMovie(genres, providers, inputs){
    const yearFrom=inputs["year-from"]?inputs["year-from"]:""
    const yearTo=inputs["year-to"]?inputs["year-to"]:new Date().getFullYear()
    const randomYear = yearFrom!==""?Math.floor(Math.random()*(yearTo-yearFrom+1))+parseInt(yearFrom):""
    
    const genreIndex = Math.floor(Math.random()*genres.length)
    const genre=inputs.genre? inputs.genre:genres[genreIndex].name

    const genreId = genres.filter(obj=> obj.name === genre)[0].id

    const lowerProvider = inputs.provider.map(el=>el.toLowerCase())

    const platformIds = inputs.provider!==""? 
            lowerProvider.map(el=>
                    providers.filter(obj =>
                        obj.provider_name.toLowerCase()===el
                    )[0].provider_id): ""
    
    const platformQuery =$.each(platformIds, function(index, value){
            return index < platformIds.length-1?`${value} |`:value })

    const queriedUrl=randomYear!==""?
        `${baseUrl}/discover/movie?include_adult=false&vote_average.gte=1&with_genres=${genreId}&sort_by=popularity.desc&primary_release_year=${randomYear}&watch_region=${country}&with_watch_provider=
        ${platformQuery}`: 
        `${baseUrl}/discover/movie?include_adult=false&with_genres=${genreId}&sort_by=popularity.desc&watch_region=${country}&with_watch_provider=
        ${platformQuery}`

    $.ajax({
        url:queriedUrl,
        method: "GET",
        headers:{
            accept: 'application/json',
            Authorization: `Bearer ${YOUR_TMDB_API_KEY}`
        },
        success: function(response){
            const results = response.results
            results.sort(()=> 0.5-Math.random())
            
            const picks = results.slice(0,3)
            displayPicks(picks)
        },
        error: function(error){
            console.log(error)
        }
    })

}

function displayPicks(movies){
    const container = $('.picks-container')
    const h3 = $('<h3></h3>')
    h3.text("Picked Movies")
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