class Slide
  ID_PREFIX       : "slide-"
  SLIDE_CLASSNAME : 'slide'

  IMAGE_WIDTH     : 703
  IMAGE_HEIGHT    : 359

  SLIDESHOW_DELAY : 140
  SLIDE_MOVE_DURATION : 0.6
  SLIDE_MOVE_DELAY : 0.5

  container       : null
  title           : null
  button          : null

  currentImage    : 0

  images          : null
  imagesContainer : null
  imagesSlideshow : null

  startX          : 0
  endX            : 0
  timer           : 0
  isActive        : null

  constructor : ( @proj, id )->
    @id = id

    @createContainer()
    @createTitle()
    @createButton()
    @createImages()

    @isActive = false

    @addListeners()

  createContainer : ()->
    @container = document.createElement 'li'
    @container.className = @SLIDE_CLASSNAME
    @width = $(@container).width()
    @container.id = @ID_PREFIX + @proj.name.replace(' ', '-')

  createTitle : ()->
    @title = document.createElement 'h2'
    @title.innerHTML = @proj.name
    @container.appendChild @title

  createButton : ()->
    if @proj.link == "" then return
    @button = document.createElement 'button'
    @button.innerHTML = "go"
    @container.appendChild @button
    @button.onclick = ()=>
     @goToLink()

  goToLink     : ()->
    if @proj.link.split('http').length > 1 then window.open @proj.link, '_blank' else @showVideo()

  showVideo    : ()->
    @removeListeners()
    EventManager.addListener Events.VIDEO_CLOSE, @onVideoClose
    EventManager.emitEvent Events.BUTTON_GO_EVENT, [@proj]

  createImages : ()->
    vignette = new Image()
    vignette.className = "vignette"
    vignette.src = "img/vignette.png"

    @imagesContainer = document.createElement 'div'
    @imagesContainer.id = 'image-container'

    @imagesSlideshow = document.createElement 'div'
    @imagesSlideshow.id = 'image-slideshow'

    @container.appendChild @imagesContainer

    @imagesContainer.appendChild @imagesSlideshow
    #@imagesContainer.appendChild vignette

    @imagesLength = @proj.images.length
    if @proj.images.length == 0 then return

    @maxImages = @proj.images.length
    _width = 0

    for image in @proj.images
      img = new Image()
      img.src = image
      img.width = @IMAGE_WIDTH
      _width += @IMAGE_WIDTH
      @imagesSlideshow.appendChild img

    @imagesSlideshow.style.width = _width + @proj.images.length + "px"

  activate       : ()->
    @isActive = true
    @startSlideshow()
    #Animations.tween 'opacity', @imagesSlideshow, 0.5, 0.5, [0.4, 1]
    #Animations.tween 'opacity', @title, 0.47, 0.5, [0.4, 1]
    #Animations.tween 'opacity', @button, 0.5, 0.4, [0.4, 1]

  deactivate     : ()->
    @isActive = false

    window.cancelAnimationFrame @animFrame

    @timer = 0
    if @interval then clearInterval @interval
    @interval = null

    @move 0

    #Animations.tween 'opacity', @imagesSlideshow, 0, 0.3, [1, 0.4]
    #Animations.tween 'opacity', @title, 0, 0.3, [1, 0.4]
    #Animations.tween 'opacity', @button, 0, 0.3, [1, 0.4]

  update         : ()->
    @cb = ()=> @update()
    @animFrame = window.requestAnimationFrame @cb

    if !@isActive 
      window.cancelAnimationFrame @animFrame
      return
    if @timer <= @SLIDESHOW_DELAY
      @timer++ 
    else 
      @timer = 0
      if @currentImage + 1 < @maxImages then @move @currentImage + 1 else @move 0

  startSlideshow : ()->
    @update()

    return 
    cb = () =>
      if !@isActive
        clearInterval @interval
        return
      if @currentImage + 1 < @maxImages then @move @currentImage + 1 else @move 0

    @interval = setInterval (=>cb()), @SLIDESHOW_DELAY

  move           : ( targetImage )->
    @startX = -@currentImage * @IMAGE_WIDTH
    @endX = -targetImage * @IMAGE_WIDTH

    factor = Math.max Math.abs(targetImage - @currentImage), 1

    Animations.move @imagesSlideshow, @SLIDE_MOVE_DELAY, @SLIDE_MOVE_DURATION, y:0, x:[@startX, @endX]
    @currentImage = targetImage


  addListeners : ()->
    @container.onclick = (e) =>
      opts =
        id : @id
        x  : $(@container).position().left

      EventManager.emitEvent Events.SLIDE_EVENT_CLICK, [opts]

  removeListeners : ()->

  onVideoClose : ()=>
    EventManager.addListener Events.VIDEO_CLOSE, @onVideoClose
    @addListeners()
    

do ->
    w = window
    for vendor in ['ms', 'moz', 'webkit', 'o']
        break if w.requestAnimationFrame
        w.requestAnimationFrame = w["#{vendor}RequestAnimationFrame"]
        w.cancelAnimationFrame = (w["#{vendor}CancelAnimationFrame"] or
                                  w["#{vendor}CancelRequestAnimationFrame"])

    targetTime = 0
    w.requestAnimationFrame or= (callback) ->
        targetTime = Math.max targetTime + 16, currentTime = +new Date
        w.setTimeout (-> callback +new Date), targetTime - currentTime

    w.cancelAnimationFrame or= (id) -> clearTimeout id
