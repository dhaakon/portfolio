class Module
  container   : null
  closeButton     : document.getElementById 'dhaakon-close'
  constructor : (@id) ->
  start       : () ->
  close     : () ->
  addListeners : () ->

  createClose : ()->
    @closeButton.style.display = 'block'
    Animations.fade 'in', @closeButton, 0.6, 0.2

    @closeButton.onclick = @closeClickHandler

  closeClickHandler : (e)=>
    # Send out a close event for all listeners

    cb = () =>
      @closeButton.style.display = "none"
      window.location.hash = "main"
      EventManager.emitEvent Events.CLOSE_EVENT 

    # Fade the close button back out
    Animations.fade 'out', @closeButton, 0, 0.1, cb  

