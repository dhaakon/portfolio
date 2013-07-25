#<< EventManager
class PortfolioVideo
  VIDEO_ID  :   "portfolio-video"
  videoWidth : 960
  videoHeight : 540


  videoJS   :   null
  container :   document.getElementById 'dhaakon-video-container'
  wrapper   :   document.getElementById 'dhaakon-video-wrapper'
  videoURL  :   null
  videoElement : null
  videos    :   null
  title     :   document.getElementById 'dhaakon-video-title'

  close     :   document.getElementById 'close'
  isActive  :   false

  show      :   () ->
    @addListeners()
    @wrapper.style.display = "block"
    cb = () => @onResize()
    Animations.fade 'in', @wrapper, 0, 0.4, cb

  hide      :   () ->
    cb = () => @wrapper.style.display = "none"
    Animations.fade 'out', @wrapper, 0, 0.4, cb
    EventManager.emitEvent Events.VIDEO_CLOSE
    @removeListeners()

  constructor : ()->
    #return
    @createVideo()
    #@addListeners()

  kill            : ()->
    @videoJS.pause()
    @hide()

  onKeyboardPress : (e) =>
    if e.keyCode == 27 then @kill()

  onVideoComplete : () =>
    @hide()

  createVideo : ()->
    @videoElement = document.createElement "video"
    @videoElement.id = @VIDEO_ID
    @videoElement.className = 'vjs-default-skin vid'

    source = document.createElement "source"
    source.type = 'video/mp4'
    source.src = 'video/ubs.mp4'

    @container.appendChild @videoElement
    @videoElement.appendChild source

    videoOptions =
      'autoplay'  : false,
      'loop'      : false,
      'controls'  : true,
      'width'     : @videoWidth,
      'height'    : @videoHeight

    cb = ()=>
      setTimeout (=>
        @videoJS.on 'ended', @onVideoComplete), 10

      @onResize()

    @videoJS = videojs @VIDEO_ID, videoOptions, cb
    #@onResize()

  addListeners: ->
    EventManager.addListener Events.WINDOW_RESIZE, @onResize
    EventManager.addListener Events.KEYBOARD_EVENT, @onKeyboardPress
    @close.onclick = ()=> @kill()

  removeListeners : ->
    EventManager.removeListener Events.WINDOW_RESIZE, @onResize
    EventManager.removeListener Events.KEYBOARD_EVENT, @onKeyboardPress


  changeVideo : (url) ->
    @videoJS.src url

  changeTitle : (title) ->
    @title.innerHTML = title


  onResize    : (e)=>
    #console.log @calcYOffset()
    @container.style.marginTop = @calcYOffset() + "px"

  calcYOffset      : (int) ->
    slideContainer = $(@container)
    containerHeight = $(@container).height()
    height = $(window).height()
    slideHeight = slideContainer.height()
    y = slideContainer.position().top
    slideDiff = height - slideHeight

    return -(y - slideDiff/2)



