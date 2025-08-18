$(function(){
        let slides = $('.icon-container')
        const container = $('.genre-container')

        const itemWidth = slides.outerWidth(true)
        let currentIndex = 0
        const totalSlides = slides.length
        
        slides = container.find('.icon-container')

        function move(step){
            currentIndex += step
            if(currentIndex >= totalSlides){
                currentIndex =0
            }
            if(currentIndex <0){
                currentIndex=totalSlides-1
            }
            $('.icon-container').css({
                'transition':'transform 0.4s ease-in-out',
                'transform':`translateX(-${itemWidth * currentIndex}px)`
            })
        }
    
        $('.btn').on('click',function(){      
            if($(this).hasClass("prev-btn")){
                move(-1)
            }else{
                move(1)
            }
        })


})


