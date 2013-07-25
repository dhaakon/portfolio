#<< Module

class Slideshow extends Module
  SLIDE_DELAY     : 0.1
  SLIDE_DURATION  : 0.3
  OFFSET          : 700

  SLIDE_WIDTH     : 740
  SLIDE_PADDING   : 42

  SLIDE_BUFFER_SIZE : 2
  FIRST_SLIDE     : 2

  MIN_HEIGHT      : 768
  MIN_WIDTH       : 1024

  isOnLastSlide   : false
  isOnFirstSlide  : false

  wrapper         : null
  container       : null
  slideContainer  : null
  data            : null
  slides          : []
  currentSlide    : 2
  maxSlides       : 5
  timer           : 0

  #navigation      :
    #previousButton : $ '#previous-btn'
    #nextButton           : $ '#next-btn'

  startX : 0
  endX   : 0

  constructor : (data, wrapper, container, slideContainer) ->
    super()
    EventManager.addListener Events.WINDOW_RESIZE, @onResize

    @data = data
    @wrapper = wrapper
    @container = container
    @slideContainer = slideContainer

    @slides = []

    @maxSlides = @data.projects.length
    if @slides.length == 0
      @createSlides()

  onShowVideo     : () =>
    @removeListeners()
    EventManager.addListener Events.VIDEO_CLOSE, @onVideoClose

  onVideoClose    : () =>
    EventManager.removeListener Events.VIDEO_CLOSE, @onVideoClose
    @addListeners()

  addListeners    : () ->
    EventManager.addListener Events.CLOSE_EVENT,        @close
    EventManager.addListener Events.SLIDE_EVENT_CLICK, @onSlideClick
    EventManager.addListener Events.KEYBOARD_EVENT, @onKeyPress
    EventManager.addListener Events.BUTTON_GO_EVENT, @onShowVideo

  removeListeners : () ->
    #EventManager.removeListener Events.WINDOW_RESIZE, @onResize
    EventManager.removeListener Events.CLOSE_EVENT, @close
    EventManager.removeListener Events.SLIDE_EVENT_CLICK, @onSlideClick
    EventManager.removeListener Events.KEYBOARD_EVENT, @onKeyPress
    EventManager.removeListener Events.BUTTON_GO_EVENT, @onShowVideo


  onResize        : () =>
    @wrapper.style.width = $(window).width() + "px"
    @wrapper.style.height = $(window).height() + "px"

    Utils.transform @container, new CSSMatrix().translate(@calcXOffset(@currentSlide), @calcYOffset(@currentSlide)).toString()
    @startX = @calcXOffset(@currentSlide)

  onKeyPress      : ( e ) =>
    switch e.keyCode
      when 37
        @move @currentSlide - 1
      when 39
        @move @currentSlide + 1
      when 32
        if @slides[@currentSlide].proj.link != "" then @slides[@currentSlide].goToLink()
      when 27
        @close()
        @closeClickHandler e

  onSlideClick    : ( e ) =>
    @slides[@currentSlide].deactivate()
    @move e.id

  animateSlides   : () ->
    count = 0

    for slide in @slides
      count++
      Animations.fade 'in', slide.container, count * 0.2 + @SLIDE_DELAY, 0.5

  createBufferSlide : (slide, int) ->
    _slide = new Slide slide, int
    @slides.push _slide
    @slideContainer.appendChild _slide.container

  createSlides    : () ->
    _width = @SLIDE_WIDTH * 5

    count = @SLIDE_BUFFER_SIZE

    for bufferSlide in [@data.projects.length-2..@data.projects.length-1]
      @createBufferSlide @data.projects[bufferSlide], @data.projects.length-bufferSlide

    for project in @data.projects
      slide = new Slide project, count
      @slides.push slide
      @slideContainer.appendChild slide.container
      _width += @SLIDE_WIDTH + (@SLIDE_PADDING * 2)
      count++

    for bufferSlide in [0..1]
      @createBufferSlide @data.projects[bufferSlide], @slides.length + bufferSlide

    @container.style.width = _width + "px"

  setupSlideNavigation : () ->
    return

    @navigation.previousButton.click () => 
      if @currentSlide != 0 then @move @currentSlide - 1
    @navigation.nextButton.click () => 
      if @currentSlide != @slides.length then @move @currentSlide + 1

  kill            : () ->
    @removeListeners()
    cb = () => @wrapper.style.display = 'none'
    Animations.fade 'out', @wrapper, 0, 0.25, cb 
    @currentSlide = @FIRST_SLIDE
    #@onResize()

  close           : () =>
    @slides[@currentSlide].deactivate()

    @kill()
    count = 0
    for slide in @slides
      count++
      if count == @slides.length
        cb = () => @kill()
      else cb = null

      Animations.fade 'out', slide.container, 0, 0.3, cb

  start           : () ->
    @wrapper.style.display = "block"
    @wrapper.style.left = '0px'
    @wrapper.style.width = $(window).width() + "px"
    @wrapper.style.height = $(window).height() + "px"
    Animations.fade 'in', @wrapper, 0, 0.4

    @setupSlideNavigation()

    @addListeners()
    @animateSlides()
    @createClose()

    # Start at the first slide
    @slides[@FIRST_SLIDE].activate()
    @onResize()

  move            : ( targetSlide, duration ) =>
    @removeListeners()
    @endX = @calcXOffset targetSlide

    if targetSlide == @SLIDE_BUFFER_SIZE - 1 then @isOnFirstSlide = true
    if targetSlide == @slides.length - @SLIDE_BUFFER_SIZE then @isOnLastSlide = true
    @slides[@currentSlide].deactivate()

    cb = () => 
      if @isOnFirstSlide
        previousSlide = @currentSlide
        @currentSlide = @slides.length - (@SLIDE_BUFFER_SIZE + 1)
        @isOnFirstSlide = false
        @isOnLastSlide = false
        @slides[previousSlide].deactivate()
        setTimeout (=>@onResize()),1
        @slides[@currentSlide].activate()


      if @isOnLastSlide
        previousSlide = @currentSlide
        @currentSlide = @SLIDE_BUFFER_SIZE
        @isOnFirstSlide = false
        @isOnLastSlide = false
        @slides[previousSlide].deactivate()
        setTimeout (=>@onResize()),1
        @slides[@currentSlide].activate()

      @startX = @endX
      @addListeners()

    if duration is undefined then duration = @SLIDE_DURATION

    Animations.move @container, 0, duration, y:@calcYOffset(targetSlide),x:[@startX, @endX], cb, 10

    @currentSlide = targetSlide
    @slides[@currentSlide].activate()


  calcXOffset      : (int) ->
    slideContainer = $(@slides[int].container)
    containerWidth = $(@container).width()
    width = $(window).width()
    slideWidth = slideContainer.width()
    x = slideContainer.position().left + @SLIDE_PADDING
    slideDiff = width - slideWidth

    return -(x - slideDiff/2)

  calcYOffset      : (int) ->
    slideContainer = $(@slides[int].container)
    containerHeight = $(@container).height()
    height = $(window).height()
    slideHeight = slideContainer.height()
    y = slideContainer.position().top
    slideDiff = height - slideHeight

    return -(y - slideDiff/2)


