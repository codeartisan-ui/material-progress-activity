(function ($) {

  "use strict"

  let DATA_KEY = 'ca.progress'
  let EVENT_KEY = DATA_KEY+'.'

  let Selector = {
    PROGRESS: '.md-progress'
  }

  let MaterialProgress = function () {

    let setMeow = function(val){
      alert(val)
    }

    let MaterialProgress = function (element, config) {
      this.isShown_ = false
      this.$progress = $(element)
      this.init_(config)
    }

    MaterialProgress.VERSION = '1.0'

    MaterialProgress.prototype.Classes_ = {
      IS_ACTIVE: 'md-progress--active',
      IS_VISIBLE: 'md-progress--visible',
      IS_CIRCLE: 'md-progress--circle',
      INDETERMINATE: 'md-progress--indeterminate',
      PROGRESS_BAR: 'md-progress__progressbar',
      BUFFER_BAR: 'md-progress__bufferbar',
      BUFFER: 'md-progress--buffer',
      AUX_BAR: 'md-progress__auxbar',
      PARENT_OVERLAY: 'layout-block--overlay',
      PARENT_CENTER: 'layout-block--center',
      PARENT_VISIBLE: 'layout-block--visible',
      PARENT_FIXED: 'layout-block--fixed',
      CIRCLE_SVG: 'md-progress-circle',
      CIRCLE_PATH: 'md-progress-circle__path',
      CIRCLE_PRIMARY_THEME: 'md-progress-circle--primary',
      INTEGRATION: 'md-progress--integration'
    }

    MaterialProgress.prototype.init_ = function (config) {
      this.config = $.extend({}, this.Default, config)
      if(!this.config.circle){
        var progressbar = $( "<div></div>")
        progressbar.addClass(this.Classes_.PROGRESS_BAR).appendTo(this.$progress.get(0))
        this.$progressBar = this.$progress.find('.'+this.Classes_.PROGRESS_BAR)
        var bufferbar = $( "<div></div>")
        bufferbar.addClass(this.Classes_.BUFFER_BAR).appendTo(this.$progress.get(0))
        this.$bufferBar = this.$progress.find('.'+this.Classes_.BUFFER_BAR)
      }else{
        let id = 'progress-circle-'+Math.floor(Math.random()*100)
        let circleSvg = this.getSvg_(id)
        this.$progress.get(0).innerHTML = circleSvg;
        this.$progress.addClass(this.Classes_.IS_CIRCLE)
        this.circle = document.querySelector('#'+id)
        this.circlePath = document.querySelector('#'+id+' .'+this.Classes_.CIRCLE_PATH)
        this.circlePath.style.strokeDasharray = this.strokeDasharray
        this.circlePath.style.strokeDashoffset = this.strokeDashoffset
        switch (this.config.theme){
          case 'primary':
              this.circle.setAttribute("class", this.Classes_.CIRCLE_SVG+' '+this.Classes_.CIRCLE_PRIMARY_THEME)
            break;
          default:
            break;
        }
        if(this.config.integration){
          this.setIntegration_()
        }
      }
      this.setProgressType_()
      if(!this.config.integration)
      this.setParent_()
    }

    MaterialProgress.prototype.Default = {
      show: false,
      count: false,
      type: 'determinate', // indeterminate , buffer
      circle: false,
      overlay: false,
      parent: false,
      center: false,
      fixed: false,
      theme: 'default',
      integration: false
    }

    MaterialProgress.prototype.setIntegration_ = function (){
      if(this.config.parent){
        let parentTarget = $(this.config.target)
        if(parentTarget.length){
          this.$parentTarget = parentTarget
          this.$progress.addClass(this.Classes_.INTEGRATION)
          let rect = this.$parentTarget.get(0).getBoundingClientRect()
          this.$progress.css('top', Math.floor(rect.top))
          if(this.adjustPosition !== undefined && this.adjustPosition){
            this.$progress.css('left', (rect.left - .5))
          }else{
            this.$progress.css('left', (rect.left))
          }
          this.$progress.css('z-index', 21)
          this.$progress.css('margin-top', '-4px')
          this.$progress.css('margin-left', '-4px')
        }
      }
    }

    MaterialProgress.prototype.setProgressType_ = function(){
      if(this.config.circle){
        switch (this.config.type){
          case 'indeterminate':
            this.$progress.addClass(this.Classes_.INDETERMINATE)
            this.indeterminate = true
            break;
          default:
            this.determinate = true
            break
        }
      }else{
        switch (this.config.type){
          case 'indeterminate':
            this.$progress.addClass(this.Classes_.INDETERMINATE)
            this.indeterminate = true
            break;
          case 'buffer':
            this.$progress.addClass(this.Classes_.BUFFER)
            var auxbar = $( "<div></div>")
            this.buffer = true
            auxbar.addClass(this.Classes_.AUX_BAR).appendTo(this.$progress.get(0))
            break
          default:
            this.determinate = true
            break
        }
      }
    }

    MaterialProgress.prototype.setProgressBar = function(val){
      if(this.config.type == 'indeterminate')
          return ;
      if(!isNaN(val) && val >= 0){
        if(!this.config.circle){
          this.$progressBar.css('width', Math.min(val, 100)+'%');
        }else{
          this.setCircleBuffer_(Math.min(val, 100));
        }
      }else{
        throw new Error('invalid value');
        return ;
      }
    }
    MaterialProgress.prototype['setProgressBar'] = MaterialProgress.prototype.setProgressBar

    MaterialProgress.prototype.setBufferBar = function(val){
      if(this.config.type != 'buffer' || this.config.circle)
        return ;
      if(!isNaN(val) && val >= 0 && val<=100){
        this.$bufferBar.css('width', Math.min(val, 100)+'%');
      }else{
        throw new Error('invalid value');
        return ;
      }
    }
    MaterialProgress.prototype['setBufferBar'] = MaterialProgress.prototype.setBufferBar

    MaterialProgress.prototype.setCircleBuffer_ = function(r){
      let m = 166;
      let t = Math.min(260,(360*r/100))
      console.log(t)
      console.log(this.circle)
      this.circle.style.transform = "rotate("+t+"deg)"
      this.circlePath.style.strokeDashoffset = m - (r*m/100)
    }

    MaterialProgress.prototype.setParent_ = function () {
      if(this.config.parent){
        let parentTarget = $(this.config.target)
        if(parentTarget.length){
          this.$parentTarget = parentTarget
          if(this.config.overlay){
            this.$parentTarget.addClass(this.Classes_.PARENT_OVERLAY)
          }
          if(this.config.center){
            this.$parentTarget.addClass(this.Classes_.PARENT_CENTER)
          }
          if(this.config.fixed){
            this.$parentTarget.addClass(this.Classes_.PARENT_FIXED)
          }
        }
      }
    }

    MaterialProgress.prototype.show = function (){
      if(this.config.parent && this.$parentTarget !== undefined){
        this.$parentTarget.addClass(this.Classes_.PARENT_VISIBLE)
      }
      this.$progress.addClass(this.Classes_.IS_ACTIVE)
      window.setTimeout(function () {
        this.$progress.addClass(this.Classes_.IS_VISIBLE)
      }.bind(this), 200)
      this.isShown_ = true
    }
    MaterialProgress.prototype['show'] = MaterialProgress.prototype.show

    MaterialProgress.prototype.hide = function (){
      this.$progress.removeClass(this.Classes_.IS_VISIBLE)
      window.setTimeout(function () {
        this.$progress.removeClass(this.Classes_.IS_ACTIVE)
        if(this.config.parent && this.$parentTarget !== undefined){
          this.$parentTarget.removeClass(this.Classes_.PARENT_VISIBLE)
        }
      }.bind(this), 200)

      window.setTimeout(function () {
        this.reset()
      }.bind(this), 400)

      this.isShown_ = false
    }
    MaterialProgress.prototype['hide'] = MaterialProgress.prototype.hide

    MaterialProgress.prototype.toggle = function () {
      this.isShown_ ? this.hide() : this.show()
    }
    MaterialProgress.prototype['toggle'] = MaterialProgress.prototype.toggle


    MaterialProgress.prototype.reset = function () {
      if(!this.config.circle){
        this.$progressBar.css('width','')
        if(this.buffer){
          this.$bufferBar.css('width','')
        }
      } else{
        if(this.config.integration){
          this.circle.style.transform = '';
          this.circlePath.style.strokeDasharray = this.strokeDasharray
          this.circlePath.style.strokeDashoffset = this.strokeDashoffset
        }
      }
    }

    MaterialProgress.prototype.getSvg_ = function (id){

      let svgWidth = 55,svgCy = 28, svrR = 26,svgViewBox = 56
      this.strokeDasharray = 166
      this.strokeDashoffset = 166

      if(this.config.parent && this.config.integration){
        let parentTarget = $(this.config.target)
        if(parentTarget.length){
          this.$parentTarget = parentTarget
          let rect = this.$parentTarget.get(0).getBoundingClientRect()
          svgWidth = Math.ceil(rect.width)+8
          if(svgWidth%2 == 0){
            svgWidth++
            this.adjustPosition = true
          }
          svgViewBox = svgWidth+1
          svgCy = svgViewBox/2
          svrR = svgCy-2
          this.strokeDasharray = Math.floor(2*Math.PI*svrR)
          this.strokeDashoffset = this.strokeDasharray
        }
      }

      let circleSvg = '<svg id="'+id+'" class="md-progress-circle" width="'+svgWidth+'px" height="'+svgWidth+'px" viewBox="0 0 '+svgViewBox+' '+svgViewBox+'" xmlns="http://www.w3.org/2000/svg">'+
          '<circle class="md-progress-circle__path" fill="none" stroke-width="4" stroke-linecap="round" cx="'+svgCy+'" cy="'+svgCy+'" r="'+svrR+'"></circle>'+
          '</svg>';

      return circleSvg;

    }

    MaterialProgress.prototype.destroy = function () {
      if(this.config.parent && this.$parentTarget !== undefined){
        this.$parentTarget.removeClass(this.Classes_.PARENT_VISIBLE)
        this.$parentTarget.removeClass(this.Classes_.PARENT_OVERLAY)
      }
      this.$progress.removeClass(this.Classes_.IS_VISIBLE).removeClass(this.Classes_.IS_ACTIVE)
      this.$progress.data(DATA_KEY, null)
    }
    MaterialProgress.prototype['destroy'] = MaterialProgress.prototype.destroy

    MaterialProgress.Plugin_ = function Plugin_(config, value) {
      return this.each(function () {
        let $this = $(this)
        let data  = $this.data(DATA_KEY)
        if (!data){
          if (typeof config !== 'string') {
            var dataConfig = $.extend({}, config, $(this).data())
            $this.data(DATA_KEY, (data = new MaterialProgress(this, dataConfig)))
          }else {
            $this.data(DATA_KEY, (data = new MaterialProgress(this, $(this).data())))
          }
        }
        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error('No method named "' + config + '"')
          }
          if(value!== undefined){
            data[config](value)
          } else {
            data[config]()
          }
        }
      })
    }
    return MaterialProgress

  }()

  $.fn.MaterialProgress = MaterialProgress.Plugin_
  $.fn.MaterialProgress.Constructor = MaterialProgress
  $.fn.MaterialProgress.noConflict = function () {
    $.fn.MaterialProgress = MaterialProgress
    return MaterialProgress.Plugin_
  }
}( jQuery ))