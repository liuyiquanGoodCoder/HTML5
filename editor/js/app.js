(function(){
	var SuperEditor = function(){
			var view,fileName,isDirty = false,
			UnsavedMsg = 'Unsaved changes will be lost.Are you sure?',
			UnsavedTitle = 'Discard changes';
			
			var markDirty = function(){
				isDirty = true;
			};
			
			var markClean = function(){
				isDirty = false;
			};
			
			var checkDirty = function(){
				if(isDirty){ return UnsavedMsg; }
			};

//   		暂时放一放，接管window的关闭刷新可能不太好兼容各个版本浏览器
//			window.addEventListener('beforeunload',checkDirty,false);

			
			var jump = function(e){
				var hash = location.hash;
				
				if (hash.indexOf('/') > -1) {
					var parts = hash.split('/'),
						fileNameE1 = document.getElementById('file_name');
					
					view = parts[0].substring(1) + '-view';
					fileName = parts[1];
					fileNameE1.innerHTML = fileName;
				} else{
					if (!isDirty || confirm(unsavedMsg,unsavedTitle)) {
						markClean();
						view = 'browser-view';
						if (hash != '#list') {
							location.hash = '#list';
						}
					} else{
						location.href = e.oldURL;
					}
				}
				document.body.className = view;
			};
			jump();
			
			window.addEventListener('hashchange',jump,false);
			
			//将一些基础按钮初始化
			var editVisualButton = document.getElementById('edit_visual'),
				visualView = document.getElementById('file_contents_visual'),
				visualEditor = document.getElementById('file_contents_visual_editor'),
				visualEditorDoc = visualEditor.contentDocument,
				editHtmlButton = document.getElementById('edit_html'),
				htmlView = document.getElementById('file_contents_html'),
				htmlEditor = document.getElementById('file_contents_html_editor');
			
			//开启designMode属性，将可视化iframe切换到可编辑的状态
			visualEditorDoc.designMode = 'on';
			
			visualEditorDoc.addEventListener('keyup',markDirty,false);
			htmlEditor.addEventListener('keyup',markDirty,false);
				
			var updateVisualEditor = function(content){
				visualEditorDoc.open();
				visualEditorDoc.write(content);
				visualEditorDoc.close();
				visualEditorDoc.addEventListener('keyup',markDirty,false);
			};
			
			var updateHtmlEditor = function(content){
				htmlEditor.value = content;
			};
			
			var toggleActiveView = function(){
				if (htmlView.style.display == 'block') {
					editVisualButton.className = 'split_left active';
					visualView.style.display = 'block';
					editHtmlButton.className = 'split_right';
					htmlView.style.display = 'none';
					updateVisualEditor(htmlEditor.value);
				} else{
					editHtmlButton.className = 'split_right active';
					htmlView.style.display = 'block';
					editVisualButton.className = 'split_left';
					visualView.style.display = 'none';
					
					var x = new XMLSerializer();
					var content = x.serializeToString(visualEditorDoc);
					updateHtmlEditor(content);
				}
			};
			
			editVisualButton.addEventListener('click',toggleActiveView,false);
			editHtmlButton.addEventListener('click',toggleActiveView,false);
			
			var visualEditorToolbar = document.getElementById('file_contents_visual_toolbar');
			
			//用于判断用户点击的是什么按钮
			var richTextAction = function(e){
				var command,
					node = (e.target.nodeName === "BUTTON") ? e.target : e.target.parentNode;
					
				//访问HTML5的data-属性，并向下兼容
				if(node.dataset){
					command = node.dataset.command;
				}else{
					command = node.getAttribute('data-command');
				}
				
				var doPopupCommand = function(command,promptText,promptDefault){
					visualEditorDoc.execCommand(command,false,prompt(promptText,promptDefault));
				}
				
				if (command === 'createLink') {
					doPopupCommand(command,'Enter link URL','http://www.example.com');
				}else if (command === 'insertImage') {
					doPopupCommand(command,'Enter image URL:',
					'www.example.com/image.jpg');
				}else if(command === 'insertMap'){
					if (navigator.geolocation) {
						node.innerHTML = 'Loading';
						navigator.geolocation.getCurrentPosition(function(pos){
							var coords = pos.coords.latitude + ',' + pos.coords.longitude;
							var img = 'http://maps.googleapis.com/maps/api/staticmap?markers=' +coords+ '&zoom=11&size=200x200&sensor=false';
							visualEditorDoc.execCommand('insertImage',false,img);
							node.innerHTML = 'Location Map';
						});
					}else{
						alert('Geolocation not available','No geolocation data');
					}
				}else{
					visualEditorDoc.execCommand(command);
				}
					
			};
			
			visualEditorToolbar.addEventListener('click',richTextAction,false);
	};
	
	var init = function(){
		new SuperEditor();
	}
	
	window.addEventListener('load',init,false);
})();
