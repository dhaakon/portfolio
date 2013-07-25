Utils =
  vendors             : ['webkit','ms','Moz','o']

  transform           : (obj, matrix)->
     for vendor in @vendors
       obj.style[vendor + 'Transform'] = matrix

  addCSSEventListener : (obj, propName, cb)->
    for vendor in @vendors
      obj.addEventListener vendor + "TransitionEnd", (e) => 
        cb e if e.propertyName == propName

  setTransitionDelay : (obj, delay)->
    for vendor in @vendors
      obj.style[vendor + 'TransitionDelay'] = delay + 'ms'

  getCSS             : (obj, prop)->
    return obj.style[prop]

  parseLocation      : ()->
    if window.location.hash then locationHash = window.location.hash else
      locationHash = "#" + window.location.href.split("#")[1]
    
    location = locationHash

    return location.split("#")[1]
