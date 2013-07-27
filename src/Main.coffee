## @author  dhaakon (David Poyner)

# Dependencies

#<< PortfolioVideo
#<< TypePath
#<< PhysicsDemo
#<< Utils
#<< Modules

class Portfolio
  ## Site enters with a black background and transitions to
  ## a gradient background once the size is set.
  ##

  MIN_HEIGHT      : 768
  MIN_WIDTH       : 1024

  BODY_BACKGROUND : [
    "radial-gradient(ellipse at center, rgba(175,30,30,1.0) 0%,#0e0e0e 100%)",
    "-moz-radial-gradient(center, ellipse cover, rgba(175,30,30,1.0) 0%, #0e0e0e 100%)",
    "-webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%,rgba(175,30,30,1.0)), color-stop(100%,#0e0e0e))",
    "-webkit-radial-gradient(center, ellipse cover,rgba(175,30,30,1.0) 0%,#0e0e0e 100%)"
  ]

  heading         : document.getElementById 'dhaakon-heading'
  footer          : document.querySelectorAll('footer')[0]
  title           : document.getElementById('dhaakon-heading').querySelectorAll('h1')[0]
  navigationLinks : document.getElementById 'dhaakon-title-navigation'
  sketchContainer : document.getElementById 'dhaakon-sketch-container'
  info            : document.getElementById 'dhaakon-info'
  portfolioVideo  : null

  heightOffset    : 80
  Modules         : 'work' : Work, 'experiments' : Experiments, 'about' : About
  activeModules   : 'work' : null, 'experiments' : null, 'about' : null
  Utils           : Utils
  physix          : null
  isActive        : true
  constructor : ()->
    # Create the physics

    # Set the background
    for bg in @BODY_BACKGROUND
      document.body.style.background = bg

    # Setup the GUI
    @setupNavigationLinks()
    @setupTitleBar()
    @setupInfo()

    # Set the size of the sketch container
    @sketchContainer.style.height = (window.innerHeight - @heightOffset) + "px"
    @sketchContainer.style.width = (window.innerWidth) + "px"

    #console.log 'main'
    @portfolioVideo = new PortfolioVideo()

    # Fade in sketch container
    Animations.fade 'in', @sketchContainer, 0.1, 0.4

    # Add Listeners
    @addListeners()

  addListeners  : ()->
    EventManager.addListener Events.WINDOW_RESIZE, @onResize
    EventManager.addListener Events.CLOSE_EVENT, @onModuleClose
    EventManager.addListener Events.BUTTON_GO_EVENT, @onShowVideo
    EventManager.addListener Events.URL_CHANGE, @onURLChange

  onURLChange   : (e)=>
    console.log e

  setupInfo     : ()->
    # Fade in info bar
    #Animations.fade 'in', @info, 0.4, 0.1

    @info.onclick = ()=>
      Animations.fade 'out', @info, 0, 0.1

  setupTitleBar : ()->
    # Fade in Title bar
    Animations.fade 'in', @title, 0.4, 0.1

    @heading.style.top = '0px'
    @footer.style.bottom = '0px'

  setupNavigationLinks : ()->

    # Fade in navigation links
    Animations.fade 'in', @navigationLinks, 0.8, 0.3
    @addNavigationListeners()

  addNavigationListeners : ()->
    # Add its listeners
    @navigationLinks.onclick = @navigateToLink
    event = target : href : window.location.href
    if window.location.hash == "" then event.target.href += "#main"
    @navigateToLink event


  navigateToLink : (e)=> 
    # TODO: Better hash location
    if !@isActive then return

    if e.target.href? else return
    destName = e.target.href.split('#')[1]
    if destName? else return
    if destName == "main"
      if !@physix
        @typePath = new TypePath document.getElementById 'svgElement'
        @physix = new PhysicsDemo @typePath.getPaths()
      return

    #console.log destName
    if @physix? then @physix.destroySketch()

    @isActive = false
    # Create the appropriate module
    @createModule destName

    cb = ()=>
      @navigationLinks.style.display = 'none'

    # Fade out Navigation links
    Animations.fade 'out', @navigationLinks, 0, 0.2, cb

  createModule        : ( str ) ->
    if !@activeModules[str]
      module = new @Modules[ str ](str)
      @activeModules[str] = module
    else
      module = @activeModules[str]

    module.start()

  restartPhysix : ()->
    @physix.createSketch()

  onResize      : (event)=>
    @sketchContainer.style.height = (window.innerHeight - @heightOffset) + "px"
    @sketchContainer.style.width = (window.innerWidth) + "px"
  
  onModuleClose : (event)=>
    @isActive = true
    if @physix? then @restartPhysix()
    if !@physix
      @typePath = new TypePath document.getElementById 'svgElement'
      @physix = new PhysicsDemo @typePath.getPaths()


    @navigationLinks.style.display = "block"
    # Fade in navigation links
    Animations.fade 'in', @navigationLinks, 0.2, 0.2

  onShowVideo   : (proj) =>
    @portfolioVideo.changeVideo( proj.link )
    @portfolioVideo.changeTitle( proj.name )
    @portfolioVideo.videoJS.play()
    @portfolioVideo.show()




window.onload = (=> 
  new Portfolio())
