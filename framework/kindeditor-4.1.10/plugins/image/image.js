/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('image', function(K) {
	var self = this, name = 'image',
		allowImageUpload = K.undef(self.allowImageUpload, true),
		allowImageRemote = K.undef(self.allowImageRemote, true),
		formatUploadUrl = K.undef(self.formatUploadUrl, true),
		allowFileManager = K.undef(self.allowFileManager, false),
		uploadJson = K.undef(self.uploadJson, self.basePath + 'php/upload_json.php'),
		imageTabIndex = K.undef(self.imageTabIndex, 0),
		imgPath = self.pluginsPath + 'image/images/',
		extraParams = K.undef(self.extraFileUploadParams, {}),
		filePostName = K.undef(self.filePostName, 'imgFile'),
		fillDescAfterUploadImage = K.undef(self.fillDescAfterUploadImage, false),
		lang = self.lang(name + '.');

	self.plugin.imageDialog = function(options) {
		var imageUrl = options.imageUrl,
			imageWidth = K.undef(options.imageWidth, ''),
			imageHeight = K.undef(options.imageHeight, ''),
			imageTitle = K.undef(options.imageTitle, ''),
			imageAlign = K.undef(options.imageAlign, ''),
			showRemote = K.undef(options.showRemote, true),
			showLocal = K.undef(options.showLocal, true),
			tabIndex = K.undef(options.tabIndex, 0),
			clickFn = options.clickFn;
		var target = 'kindeditor_upload_iframe_' + new Date().getTime();
		var hiddenElements = [];
		for(var k in extraParams){
			hiddenElements.push('<input type="hidden" name="' + k + '" value="' + extraParams[k] + '" />');
		}
		var html = [
			'<div style="padding:20px;">',
			//tabs
			'<div class="tabs"></div>',
			//remote image - start
			'<div class="tab1" style="display:none;">',
			//url
			'<div class="ke-dialog-row">',
			'<label for="remoteUrl" style="width:60px;">' + lang.remoteUrl + '</label>',
			'<input type="text" id="remoteUrl" class="ke-input-text" name="url" value="" style="width:200px;" /> &nbsp;',
			'<span class="ke-button-common ke-button-outer">',
			'<input type="button" class="ke-button-common ke-button" name="viewServer" value="' + lang.viewServer + '" />',
			'</span>',
			'</div>',
			//size
			'<div class="ke-dialog-row">',
			'<label for="remoteWidth" style="width:60px;">' + lang.size + '</label>',
			lang.width + ' <input type="text" id="remoteWidth" class="ke-input-text ke-input-number" name="width" value="" maxlength="4" /> ',
			lang.height + ' <input type="text" class="ke-input-text ke-input-number" name="height" value="" maxlength="4" /> ',
			'<img class="ke-refresh-btn" src="' + imgPath + 'refresh.png" width="16" height="16" alt="" style="cursor:pointer;" title="' + lang.resetSize + '" />',
			'</div>',
			//align
			'<div class="ke-dialog-row">',
			'<label style="width:60px;">' + lang.align + '</label>',
			'<input type="radio" name="align" class="ke-inline-block" value="" checked="checked" /> <img name="defaultImg" src="' + imgPath + 'align_top.gif" width="23" height="25" alt="" />',
			' <input type="radio" name="align" class="ke-inline-block" value="left" /> <img name="leftImg" src="' + imgPath + 'align_left.gif" width="23" height="25" alt="" />',
			' <input type="radio" name="align" class="ke-inline-block" value="right" /> <img name="rightImg" src="' + imgPath + 'align_right.gif" width="23" height="25" alt="" />',
			'</div>',
			//title
			'<div class="ke-dialog-row">',
			'<label for="remoteTitle" style="width:60px;">' + lang.imgTitle + '</label>',
			'<input type="text" id="remoteTitle" class="ke-input-text" name="title" value="" style="width:200px;" />',
			'</div>',
			'</div>',
			//remote image - end
			//local upload - start
			'<div class="tab2" style="display:none;">',
			'<iframe name="' + target + '" style="display:none;"></iframe>',
			'<form class="ke-upload-area ke-form" method="post" enctype="multipart/form-data" target="' + target + '" action="' + K.addParam(uploadJson, 'dir=image') + '">',
			//file
			'<div class="ke-dialog-row">',
			hiddenElements.join(''),
			'<label style="width:60px;">' + lang.localUrl + '</label>',
			'<input type="text" name="localUrl" class="ke-input-text" tabindex="-1" style="width:200px;" readonly="true" /> &nbsp;',
			'<input type="button" class="ke-upload-button" value="' + lang.upload + '" />',
			'</div>',
			'</form>',
			'</div>',
			//local upload - end
			'</div>'
		].join('');
		var dialogWidth = showLocal || allowFileManager ? 450 : 400,
			dialogHeight = showLocal && showRemote ? 300 : 250;
		var dialog = self.createDialog({
			name : name,
			width : dialogWidth,
			height : dialogHeight,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
				click : function(e) {
					// Bugfix: http://code.google.com/p/kindeditor/issues/detail?id=319
					if (dialog.isLoading) {
						return;
					}
					// insert local image
					if (showLocal && showRemote && tabs && tabs.selectedIndex === 1 || !showRemote) {
						if (uploadbutton.fileBox.val() == '') {
							alert(self.lang('pleaseSelectFile'));
							return;
						}
						dialog.showLoading(self.lang('uploadLoading'));
						uploadbutton.submit();
						localUrlBox.val('');
						return;
					}
					// insert remote image
					var url = K.trim(urlBox.val()),
						width = widthBox.val(),
						height = heightBox.val(),
						title = titleBox.val(),
						align = '';
					alignBox.each(function() {
						if (this.checked) {
							align = this.value;
							return false;
						}
					});
					if (url == 'http://' || K.invalidUrl(url)) {
						alert(self.lang('invalidUrl'));
						urlBox[0].focus();
						return;
					}
					if (!/^\d*$/.test(width)) {
						alert(self.lang('invalidWidth'));
						widthBox[0].focus();
						return;
					}
					if (!/^\d*$/.test(height)) {
						alert(self.lang('invalidHeight'));
						heightBox[0].focus();
						return;
					}
					clickFn.call(self, url, title, width, height, 0, align);
				}
			},
			beforeRemove : function() {
				viewServerBtn.unbind();
				widthBox.unbind();
				heightBox.unbind();
				refreshBtn.unbind();
			}
		}),
		div = dialog.div;

		var urlBox = K('[name="url"]', div),
			localUrlBox = K('[name="localUrl"]', div),
			viewServerBtn = K('[name="viewServer"]', div),
			widthBox = K('.tab1 [name="width"]', div),
			heightBox = K('.tab1 [name="height"]', div),
			refreshBtn = K('.ke-refresh-btn', div),
			titleBox = K('.tab1 [name="title"]', div),
			alignBox = K('.tab1 [name="align"]', div);

		var tabs;
		if (showRemote && showLocal) {
			tabs = K.tabs({
				src : K('.tabs', div),
				afterSelect : function(i) {}
			});
			tabs.add({
				title : lang.remoteImage,
				panel : K('.tab1', div)
			});
			tabs.add({
				title : lang.localImage,
				panel : K('.tab2', div)
			});
			tabs.select(tabIndex);
		} else if (showRemote) {
			K('.tab1', div).show();
		} else if (showLocal) {
			K('.tab2', div).show();
		}

		var uploadbutton = K.uploadbutton({
			button : K('.ke-upload-button', div)[0],
			fieldName : filePostName,
			form : K('.ke-form', div),
			target : target,
			width: 60,
			afterUpload : function(data) {
				dialog.hideLoading();
				if (data.error === 0) {
					var url = data.url;
					if (formatUploadUrl) {
						url = K.formatUrl(url, 'absolute');
					}
					if (self.afterUpload) {
						self.afterUpload.call(self, url, data, name);
					}
					if (!fillDescAfterUploadImage) {
						clickFn.call(self, url, data.title, data.width, data.height, data.border, data.align);
					} else {
						K(".ke-dialog-row #remoteUrl", div).val(url);
						K(".ke-tabs-li", div)[0].click();
						K(".ke-refresh-btn", div).click();
					}
				} else {
					alert(data.message);
				}
			},
			afterError : function(html) {
				dialog.hideLoading();
				self.errorDialog(html);
			}
		});
		uploadbutton.fileBox.change(function(e) {
			localUrlBox.val(uploadbutton.fileBox.val());
		});
		if (allowFileManager) {
			viewServerBtn.click(function(e) {
				self.loadPlugin('filemanager', function() {
					self.plugin.filemanagerDialog({
						viewType : 'VIEW',
						dirName : 'image',
						clickFn : function(url, title) {
							if (self.dialogs.length > 1) {
								K('[name="url"]', div).val(url);
								if (self.afterSelectFile) {
									self.afterSelectFile.call(self, url);
								}
								self.hideDialog();
							}
						}
					});
				});
			});
		} else {
			viewServerBtn.hide();
		}
		var originalWidth = 0, originalHeight = 0;
		function setSize(width, height) {
			widthBox.val(width);
			heightBox.val(height);
			originalWidth = width;
			originalHeight = height;
		}
		refreshBtn.click(function(e) {
			var tempImg = K('<img src="' + urlBox.val() + '" />', document).css({
				position : 'absolute',
				visibility : 'hidden',
				top : 0,
				left : '-1000px'
			});
			tempImg.bind('load', function() {
				setSize(tempImg.width(), tempImg.height());
				tempImg.remove();
			});
			K(document.body).append(tempImg);
		});
		widthBox.change(function(e) {
			if (originalWidth > 0) {
				heightBox.val(Math.round(originalHeight / originalWidth * parseInt(this.value, 10)));
			}
		});
		heightBox.change(function(e) {
			if (originalHeight > 0) {
				widthBox.val(Math.round(originalWidth / originalHeight * parseInt(this.value, 10)));
			}
		});
		urlBox.val(options.imageUrl);
		setSize(options.imageWidth, options.imageHeight);
		titleBox.val(options.imageTitle);
		alignBox.each(function() {
			if (this.value === options.imageAlign) {
				this.checked = true;
				return false;
			}
		});
		if (showRemote && tabIndex === 0) {
			urlBox[0].focus();
			urlBox[0].select();
		}
		return dialog;
	};
	self.plugin.image = {
		edit : function() {
			var img = self.plugin.getSelectedImage();
			self.plugin.imageDialog({
				imageUrl : img ? img.attr('data-ke-src') : 'http://',
				imageWidth : img ? img.width() : '',
				imageHeight : img ? img.height() : '',
				imageTitle : img ? img.attr('title') : '',
				imageAlign : img ? img.attr('align') : '',
				showRemote : allowImageRemote,
				showLocal : allowImageUpload,
				tabIndex: img ? 0 : imageTabIndex,
				clickFn : function(url, title, width, height, border, align) {
					if (img) {
						img.attr('src', url);
						img.attr('data-ke-src', url);
						img.attr('width', width);
						img.attr('height', height);
						img.attr('title', title);
						img.attr('align', align);
						img.attr('alt', title);
					} else {
						self.exec('insertimage', url, title, width, height, border, align);
					}
					// Bugfix: [Firefox] 上传图片后，总是出现正在加载的样式，需要延迟执行hideDialog
					setTimeout(function() {
						self.hideDialog().focus();
					}, 0);
				}
			});
		},
		'delete' : function() {
			var target = self.plugin.getSelectedImage();
			if (target.parent().name == 'a') {
				target = target.parent();
			}
			target.remove();
			// [IE] 删除图片后立即点击图片按钮出错
			self.addBookmark();
		},
    'addlink' : function  () {
      var img = self.plugin.getSelectedImage();
      new ImageLink(img);
    }
	};
	self.clickToolbar(name, self.plugin.image.edit);


  /*-- 增加热点  --*/
  //热点
  function LinkBox(width,height,top,left,link,$obj) {
    this.width = width;
    this.$obj = $obj;
    this.height = height;
    this.top = top;
    this.left = left;
    this.href = link || "";
    this.target = '_blank';
    this.state = 'state';
    this.$box = '';
    this.startX = 0;
    this.startY = 0;
    this.id = null;
    this.rect = null;

    this.build();
  }
  
  LinkBox.prototype.build = function  () {  //建立    
    var $this = this;
    $this.$box = $('<div><span class="close" style="position: absolute;width: 15px;height: 15px;font-size: 12px;color: #fff;right: -1px;top: -15px;background: #000;text-align: center;line-height: 15px;cursor: pointer;">X</span><span style="position: absolute;width: 10px;height: 10px;right: 0;top: 50%;margin-top: -5px;margin-right: -6px;background: #f60; cursor: w-resize;" class="wd"></span><span style="position:absolute;width:10px; height:10px;right:50%;bottom:0;margin-bottom: -4px; margin-left:-5px;background: #f60; cursor: s-resize;" class="hd"></span><span style="position: absolute; height: 15px;background: blue;color: #fff;text-align: center;line-height: 15px;top: -15px;right: 20px;cursor: pointer;overflow: hidden;text-overflow: ellipsis;" class="link">A</span></div>');
    var style = {
      'width':$this.width,
      'height':$this.height,
      'top':$this.top,
      'left':$this.left,
      'border': '1px solid red',
      'background':'#fff',
      'position':'absolute',
      'cursor':'move'
    }
    $this.$box.css(style).appendTo($this.$obj);

    $this.$box.bind('mousedown',function  (e) {
      e.stopPropagation();
      e.preventDefault();

      $this.state = 'move';
      $this.startX = e.clientX;
      $this.startY = e.clientY;
    })   
    
    $this.$box.bind('mousemove',function  (e) {
      e.stopPropagation();
      e.preventDefault();      
      if ($this.state == 'move') {
        $this.move(e);
      }
    })

    $this.$box.bind('mouseup',function  (e) {
      e.stopPropagation();
      e.preventDefault(); 
      if ($this.state == 'move') {
        var delteX = e.clientX - $this.startX;
        var delteY = e.clientY - $this.startY;
        $this.top = $this.top + delteY;
        $this.left = $this.left + delteX;
      }
      $this.state = 'state';
    })
    
    $this.$box.find('.close').on('click',function  () {
      $this.del();
    })


    //拉长
    var wdX = 0, wdY = 0;
    $this.$box.find('.wd').bind('mousedown',function  (e) {
      e.stopPropagation();
      e.preventDefault();
      $this.state = 'wdmove';
      wdX = e.clientX;
    })

    $this.$box.find('.wd').bind('mousemove',function  (e) {
      e.stopPropagation();
      e.preventDefault();
      if ($this.state == 'wdmove') {
        var delteX = e.clientX - wdX;
        var style = {
          'width' : $this.width + delteX
        }
        $this.$box.css(style);
      }
    })

    $this.$box.find('.wd').bind('mouseup',function  (e) {
      e.stopPropagation();
      e.preventDefault();
      if ($this.state == 'wdmove') {
        var delteX = e.clientX - wdX;
        $this.width = $this.width + delteX;
      }

      $this.state = 'state';
    })

    //拉高
    $this.$box.find('.hd').bind('mousedown',function  (e) {
      e.stopPropagation();
      e.preventDefault();
      $this.state = 'hdmove';
      wdY = e.clientY;
    })

    $this.$box.find('.hd').bind('mousemove',function  (e) {
      e.stopPropagation();
      e.preventDefault();
      if ($this.state == 'hdmove') {
        var delteX = e.clientY - wdY;
        var style = {
          'height' : $this.height + delteX
        }
        $this.$box.css(style);
      }
    })

    $this.$box.find('.hd').bind('mouseup',function  (e) {
      e.stopPropagation();
      e.preventDefault();
      if ($this.state == 'hdmove') {
        var delteY = e.clientY - wdY;
        $this.height = $this.height + delteY;
      }

      $this.state = 'state';
    })

    //link
    $this.$box.find('.link').bind('click',function  () {
      var gVal = $(this).html();
      if (gVal == 'A') {
        var getlink = prompt("请输入你的网址","http://");
        
        if (getlink == null) {
          return
        }
        $(this).html(getlink);
      }else {
        var getlink = prompt("请输入你的网址",gVal);
        if (getlink == null) {
          return
        }
        $(this).html(getlink);
      }

    })

    $this.tomaplink();
  }

  LinkBox.prototype.move = function  (e) {  //移动    
    $this = this;
    if ($this.state == 'move') {
      var delteX = e.clientX - $this.startX;
      var delteY = e.clientY - $this.startY;
      
      var style = {
        'top' : $this.top + delteY,
        'left' : $this.left + delteX
      }
      $this.$box.css(style);
    }
  }


  LinkBox.prototype.del = function  () {  //删除    
    var $this = this;
    $this.$box.remove();
  }

  LinkBox.prototype.change = function  () {  //改变大小    
    
  }

  LinkBox.prototype.tomaplink = function  () { //加入rect
    var $this = this;
    
    $this.rect = $('<area href="sun.htm" shape="rect" coords="'+100+','+100+','+200+','+200+'"></area>');
    var getMap = $this.$obj.attr('id');
    console.log(getMap);
    var getObj = $this.$obj.parents('.ke-content').find('map[name="'+getMap+'"]');
    $this.rect.appendTo(getObj);
  }


  //图片驱动
  function  ImageLink(imgObj) {
    this.img = $(imgObj);
    this.builld = 'state';
    this.buildParensDiv();
  }

  ImageLink.prototype.buildParensDiv = function  () {
    var $this = this,
    pos = $this.img.offset(),
    startX = 0,
    startY = 0,
    posX = 0,
    posY = 0,
    getId = null,
    drap = $('<div style="position:absolute; border:1px solid red; background:#fff;"></div> '),
    close = $('<span style="position: absolute;width: 35px;height: 35px;line-height: 35px;text-align: center;color: #fff;font-size: 20px;background: #000;right: -36px;top: -4px; cursor: pointer;" class="close">X</span>');
    if ($this.img.attr('usemap') == undefined) {
      getId = 'ck-' + new Date().getTime();
      $this.img.attr('usemap', '#' + getId);
    }else {
      getId = $this.img.attr('usemap').substr(1);
    }

 
    if ($this.img.parents('.ke-content').find('map[name=' + getId + ']').length < 1) {
      var $mapHtml = $('<map name="' + getId + '"></map>');
      $mapHtml.insertAfter($this.img);
    }
    
    


    style = {
      'position':'absolute',
      'border':'4px solid #000',
      'top':pos.top,
      'left':pos.left,
      'width': $this.img.width() - 8,
      'height': $this.img.height() - 8
    }

    var gethtml = '<div class="imglink" id="'+getId+'"></div>';
    gethtml = $(gethtml);
    gethtml.css(style).insertAfter($this.img);
    close.appendTo(gethtml);
    close.bind('click',function  (e) {
      gethtml.remove();
    })

    drap.appendTo(gethtml);

    gethtml.bind('mousedown',function  (e) {
      startX = e.clientX;
      startY = e.clientY;
      posX = e.pageX;
      posY = e.pageY;
      $this.builld = 'move';   
      e.stopPropagation();
      e.preventDefault();
    })
    
    gethtml.bind('mousemove',function  (e) {
      if ($this.builld == 'move') {
        
        var delteX = e.clientX - startX;
        var delteY = e.clientY - startY;
        if ((delteX > 10)||(delteY > 10)) {
          drap.show();          
          var style = {
            'top':startY - pos.top,
            'left':startX - pos.left,
            'width':delteX,
            'height': delteY 
          }
          drap.css(style);
        }
      }else {
        drap.hide();
      }
      e.stopPropagation();
      e.preventDefault();
    })

    gethtml.bind('mouseup',function  (e) {
      if ($this.builld == 'move') {
        var delteX = e.clientX - startX;
        var delteY = e.clientY - startY;
        if ((delteX > 10)||(delteY > 10)) {
          new LinkBox(delteX, delteY, startY-pos.top, startX-pos.left, '', gethtml);
        }        
      }

      $this.builld = 'state';
      startX = 0;
      startY = 0;
      posX = 0;
      posY = 0;
      drap.hide();
      e.stopPropagation();
      e.preventDefault();
    })

  }

  ImageLink.prototype.drap = function  () {


  }
  




});


