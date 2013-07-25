#<< PortfolioData
#<< Slide
#<< Slideshow

##
#   about
##

class About extends Module
  VIDEO_PLAYER_ID : "about-video-player"

  container       : document.getElementById 'dhaakon-about-container'
  sectionContainer: document.getElementById 'about-content-section-container'
  videoContaienr  : document.getElementById 'video-section'

  videos          : ['video/loop.mp4', 'video/post_slow.mp4','video/bike.mp4']
  videoPlayer     : null
  
  currentIndex    : 0
  maxIndex        : 0

  close           : (e) =>
    @removeListeners()
    @videoPlayer.pause()
    cb = () => @container.style.display = 'none'
    #Animations.fade 'out', @wrapper, 0, 0.25, cb 
    Animations.fade 'out', @container, 0, 0.25, cb

  onVideoComplete : (e) =>
    if @currentIndex < @maxIndex then @currentIndex++ else @currentIndex = 0
    @videoJS.src @videos[@currentIndex]
    @videoJS.play()

  addListeners    : () ->
    EventManager.addListener Events.CLOSE_EVENT, @close
    EventManager.addListener Events.WINDOW_RESIZE, @onResize
    EventManager.addListener Events.KEYBOARD_EVENT, @onKeyPress


  removeListeners : () ->
    EventManager.removeListener Events.CLOSE_EVENT, @close
    EventManager.removeListener Events.WINDOW_RESIZE, @onResize
    EventManager.removeListener Events.KEYBOARD_EVENT, @onKeyPress

  start           : () ->
    @container.style.display = "block"
    Animations.fade 'in', @container, 0, 1.0
    @addListeners()

    @createClose()
    if !@videoPlayer then @createVideo() else @videoPlayer.play()


  createVideo     : () ->
    @videoPlayer = document.createElement 'video'
    @videoPlayer.id = @VIDEO_PLAYER_ID

    source = document.createElement 'source'
    source.type = 'video/mp4'
    source.src = @videos[0]

    @container.appendChild @videoPlayer
    @videoPlayer.appendChild source
    
    @container.style.width = window.innerWidth + "px"
    @container.style.height = window.innerHeight + "px"
    @videoPlayer.style.width = window.innerWidth + "px"
    @videoPlayer.style.height = window.innerHeight + "px"

    videoOptions =
      'autoplay'  :true,
      'loop'      : false,
      'controls'  : false,
      'width'     : $(window).width(),
      'height'    : $(window).height()

    cb = ()=>
      Animations.fade 'in', document.getElementById(@VIDEO_PLAYER_ID), 0.8, 1.2, null, 0.4
      setTimeout (=>
        @onResize()
        @videoJS.on 'ended', @onVideoComplete), 700

      #@onResize()

    @videoJS = videojs @VIDEO_PLAYER_ID, videoOptions, cb
    @onResize()



  constructor     : () ->
    @maxIndex = @videos.length - 1
    super()

  onResize        : (e) =>
    cont = $ @container
    vidplayer = $ @videoPlayer
 
    win_height = $(window).height()
    win_width = $(window).width()
    cont.css 'width', win_width
    cont.css 'height', win_height

    #if !vidplayer[0] then return

    vid_container = $ vidplayer.parentNode

    video_aspect_ratio = vidplayer[0].videoWidth/vidplayer[0].videoHeight
    target_aspect_ratio = win_width/win_height
    adjustment_ratio = target_aspect_ratio/video_aspect_ratio

    vid_container.css 'width', win_width
    vid_container.css 'height', win_height
    vidplayer.css 'width', win_width
    vidplayer.css 'height', win_height

    @sectionContainer.style.marginTop = @calcYOffset() + "px"

    #return

    if video_aspect_ratio < target_aspect_ratio
      vidplayer.css '-webkit-transform', 'scaleX(' + target_aspect_ratio / video_aspect_ratio + ')'
    else
      vidplayer.css '-webkit-transform', 'scaleY(' + video_aspect_ratio / target_aspect_ratio  + ')'

  onKeyPress      : (e) =>
    switch e.keyCode
      when 27
        @close()
        @closeClickHandler(e)

  calcYOffset      : (int) ->
    slideContainer = $(@sectionContainer)
    containerHeight = $(@container).height()
    height = $(window).height()
    slideHeight = slideContainer.height()
    y = slideContainer.position().top
    slideDiff = height - slideHeight

    return -(y - slideDiff/2)

##
#   work
##

class Work extends Slideshow
  wrapper         : document.getElementById 'dhaakon-work-container'
  container       : document.getElementById 'portfolio-container'
  slideContainer  : document.getElementById 'work-templates'

  data            : PortfolioData
  constructor     : ()-> super(@data, @wrapper, @container, @slideContainer)

##
#   experiments
##

class Experiments extends Slideshow
  wrapper         : document.getElementById 'dhaakon-experiments-container'
  container       : document.getElementById 'experiments-container'
  slideContainer  : document.getElementById 'experiments-work-templates'

  data            : ExperimentsData
  constructor     : ()-> super(@data, @wrapper, @container, @slideContainer)
