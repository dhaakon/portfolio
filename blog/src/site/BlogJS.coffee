class BlogJS 
  DELAY       : 300
  constructor : () ->
    console.log $ '.container' 
    $('.container').each (arr, el, idx)=>
      element = $(el)

      element.css 'transition-delay', ((arr * 0) + @DELAY).toString() + 'ms'
      element.css 'opacity', 1


$(document).ready ()=> new BlogJS()
