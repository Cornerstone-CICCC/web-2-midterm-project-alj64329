$(function(){
    $('.btn').on('click',function(){
        const container = $('.genre-container')
        const type = $(this).attr('class').split(' ').filter(el => el!=="btn")

        const itemWidth = $(".icon-container").outerWidth(true)
        const speed = 300
        
        if(type === "prev-btn"){
            container.prepend(container.children().last())
            container.css('left', -itemWidth)
            container.animate({left: 0}, speed, 'swing')

        }else{
            container.animate({left:-itemWidth}, speed,'swing', function(){
                container.append(container.children().first())
                container.css('left', 0)
            })
        }
    })
})