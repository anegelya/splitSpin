function Spin(wrapper, wrapper2, options) {
    
    var _this = this;
    
    this.isMoving = false;
    this.isPaused = false;
    this.isLoaded = false;
    this.doAfterLoad = false;
    
    this.wrapper  = wrapper;
    this.wrapper2 = wrapper2;
    this.options  = options;
    
    this.currentSlide = 0;
    
    this.buildHTML();
    this.addEventListeners();

}
Spin.prototype = {
    buildHTML: function() {
        
        var _this = this;
        
        this.loadedSlides = 0;
        
        for(var i=0; i<=this.options.nSlides; i++) {
            
            var src =  this.options.pattern + (1000 + i).toString().substr(1);//create image src using pattern
            
            var img = document.createElement('img'),
                img2 = document.createElement('img');// create image elements
            img.src = 'src/index360/'+src+'.jpg';
            img2.src = 'src/index361/'+src+'.jpg';//set src
            
            this.wrapper.appendChild(img);
            this.wrapper2.appendChild(img2);//append image to wrapper
            
            img.onload = function() {//trigger function once image loaded
                _this.loadedSlides += 1;//count loaded images
                if(_this.loadedSlides == _this.options.nSlides) {//if all images are loaded set spin.isLoaded to true;   
                    _this.isLoaded = true;
                    _this.flyTo(0,1);
                    _this.wrapper.style.opacity = 1;
                    _this.wrapper2.style.opacity = 1;
                    if(_this.doAfterLoad) {//if there any functions that was called before images were load it will be stored as spin.doAfterLoad
                        _this.doAfterLoad();//run function
                    }
                }
                    
            }
        }

    },
    play: function(velocity) {//slide per second

        var _this = this;

        if(this.isLoaded) {
            var timeInterval = 1000/velocity;

            _this.playInterval = requestInterval(function(timePassed) {

                _this.wrapper.children[_this.currentSlide].style.opacity = 0;
                _this.wrapper.children[_this.currentSlide].style.zIndex = 0;
                _this.wrapper2.children[_this.currentSlide].style.opacity = 0;
                _this.wrapper2.children[_this.currentSlide].style.zIndex = 0;
                
                
                _this.currentSlide++;
                if(_this.currentSlide >= _this.options.nSlides)
                    _this.currentSlide = 0;
                
                _this.wrapper.children[_this.currentSlide].style.opacity = 1;
                _this.wrapper.children[_this.currentSlide].style.zIndex = 100;
                _this.wrapper2.children[_this.currentSlide].style.opacity = 1;
                _this.wrapper2.children[_this.currentSlide].style.zIndex = 100;

            }, timeInterval);  
        } else {
            this.doAfterLoad = function() {
                _this.play(velocity);
            }
        }
    },
    stop: function(interval) {
        if(interval)
            window.requestAnimationFrame ? window.cancelAnimationFrame(interval.value) : clearInterval(interval.value);
        
        interval = interval;
    },
    addEventListeners: function(path, callback) {
        var _this = this;
        
        this.ratio = window.innerWidth/2;
        this.startX = 0;
        this.prevSlide = 0;

        this.wrapper.parentNode.addEventListener('mousedown', function(e) {
            _this.isMoving = true;
            _this.startX = e.clientX;
            _this.prevSlide = _this.currentSlide;
            _this.stop(_this.playInterval);
            _this.stop(_this.flyInterval);
        });

        this.wrapper.parentNode.addEventListener('mouseup', function(e) {
            _this.prevSlide = _this.currentSlide;
            if(e.clientX === _this.startX) {
                if(!_this.isPaused) {
                    if(_this.options.moveToAnchors)
                        _this.moveToClosestAnchor();
                    _this.isPaused = true;
                } else if (_this.isPaused) {
                    _this.play(30);
                    _this.isPaused = false;
                }
            } else {
                if(_this.options.moveToAnchors)
                    _this.moveToClosestAnchor();
                _this.isPaused = true;
            }
            _this.isMoving = false;
        });
        
        this.wrapper.parentNode.addEventListener('touchstart', function(e) {
            _this.isMoving = true;
            _this.startX = e.touches[0].pageX;
            _this.prevSlide = _this.currentSlide;
            _this.stop(_this.playInterval);
            _this.stop(_this.flyInterval);
        }); 

        this.wrapper.parentNode.addEventListener('touchend', function(e) {
            _this.prevSlide = _this.currentSlide;
            if(e.touches[0].pageX === _this.startX) {
                if(!_this.isPaused) {
                    if(_this.options.moveToAnchors)
                        _this.moveToClosestAnchor();
                    _this.isPaused = true;
                } else if (_this.isPaused) {
                    _this.play(30);
                    _this.isPaused = false;
                }
            } else {
                if(_this.options.moveToAnchors)
                    _this.moveToClosestAnchor();
                _this.isPaused = true;
            }
            _this.isMoving = false;
        });

        this.wrapper.parentNode.addEventListener('mousemove', function(e) {
            if(_this.isMoving === true) {

                var x = e.clientX;

                _this.wrapper.children[  _this.currentSlide].style.zIndex  = 0;
                _this.wrapper.children[  _this.currentSlide].style.opacity = 0;
                _this.wrapper2.children[  _this.currentSlide].style.zIndex  = 0;
                _this.wrapper2.children[  _this.currentSlide].style.opacity = 0;
                
                var d = Math.round(  25*(x - _this.startX)/_this.ratio );
                _this.currentSlide = _this.prevSlide + d;
                
                
                if(_this.currentSlide > _this.options.nSlides) {
                    _this.currentSlide = 0;
                    _this.prevSlide = 0;
                    _this.startX = e.clientX;
                }

                if(_this.currentSlide < 0) {
                    _this.currentSlide = _this.options.nSlides - 1;
                    _this.prevSlide = _this.options.nSlides;
                    _this.startX = e.clientX;
                }
                
                _this.wrapper.children[  _this.currentSlide].style.zIndex = 100;
                _this.wrapper.children[  _this.currentSlide].style.opacity = 1;
                _this.wrapper2.children[  _this.currentSlide].style.zIndex = 100;
                _this.wrapper2.children[  _this.currentSlide].style.opacity = 1;
                
            } else {
                var splitter = document.querySelector("#splitter");
            
                var x = e.clientX;
                var x0 = e.currentTarget.getBoundingClientRect().left;
                splitter.style.left = x + "px";
                _this.wrapper2.style.width = x + "px";
            }
        }); 

        this.wrapper.addEventListener('touchmove', function(e) {
            var splitter = document.querySelector("#splitter");
                
            var x = e.touches[0].pageX;
            var x0 = e.currentTarget.getBoundingClientRect().left;
            splitter.style.left = x + "px";
            _this.wrapper2.style.width = x + "px";
        }); 
    },
    moveToClosestAnchor: function() {
        
        var _this = this;
        
        var distances = {};
        
        this.options.anchors.forEach(function(a) {
            distances[a]= a - _this.currentSlide;
        });
        
        var min = this.options.nSlides;
        var slide = 0;
        for(var key in distances) {
            var d = Math.abs(distances[key]);
            if( d < min) {
                min = d;
                slide = key-1;
            }
        }
        if(slide !== _this.currentSlide) {
            var direction = slide > _this.currentSlide ? direction = 1 : direction = -1;
            this.flyTo(slide,direction);
        }
    },
    flyTo: function(slide, direction=1) {

        var _this = this;
        
        if(slide < 0)
            slide = this.options.nSlides-1;
        if(slide > this.options.nSlides)
            slide = 0;

        
        _this.stop(_this.playInterval);
        
        this.flyInterval = requestInterval(function() {
            
                _this.wrapper.children[  _this.currentSlide].style.zIndex  = 0;
                _this.wrapper.children[  _this.currentSlide].style.opacity = 0;
                _this.wrapper2.children[  _this.currentSlide].style.zIndex  = 0;
                _this.wrapper2.children[  _this.currentSlide].style.opacity = 0;
                
                _this.currentSlide += direction;
            
                if(_this.currentSlide < 0)
                    _this.currentSlide  = _this.options.nSlides-1;
               if(_this.currentSlide > _this.options.nSlides)
                    _this.currentSlide = 0;
            
                _this.wrapper.children[  _this.currentSlide].style.zIndex = 100;
                _this.wrapper.children[  _this.currentSlide].style.opacity = 1;
                _this.wrapper2.children[  _this.currentSlide].style.zIndex = 100;
                _this.wrapper2.children[  _this.currentSlide].style.opacity = 1;
            
                if(_this.currentSlide == slide) {
                    _this.stop(_this.flyInterval);
                    _this.prevSlide = slide;
                }
            
        }, this.options.velocity);
        
    }

}

var requestInterval = function (fn, delay) {
    var requestAnimFrame = (function () {
        return window.requestAnimationFrame || function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
    })(),
    start = new Date().getTime(),
    handle = {};
    function loop() {
        handle.value = requestAnimFrame(loop);
        var current = new Date().getTime(),
        delta = current - start;
        if (delta >= delay) {
            fn.call();
            start = new Date().getTime();
        }
    }
    handle.value = requestAnimFrame(loop);
    return handle;
};