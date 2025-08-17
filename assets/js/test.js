$(function(){
        let slides = $('.icon-container')
        const container = $('.genre-container')

        const itemWidth = slides.outerWidth(true)
        let currentIndex = 1

        const firstClone = slides.first().clone()
        const lastClone = slides.last().clone()

        container.append(firstClone)
        container.prepend(lastClone)

        slides = container.find('.icon-container')

        function move(step){
            currentIndex += step
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

      // Reset instantly if on a clone
    container.on('transitionend webkitTransitionEnd oTransitionEnd', function() {
        if (slides.eq(currentIndex).is(firstClone)) {
        slides.css('transition', 'none');
        currentIndex = 1;
        slides.css('transform', `translateX(-${itemWidth * currentIndex}px)`);
        }
        if (slides.eq(currentIndex).is(lastClone)) {
        slides.css('transition', 'none');
        currentIndex = slides.length - 2;
        slides.css('transform', `translateX(-${itemWidth * currentIndex}px)`);
        }
    })


})


