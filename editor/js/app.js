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
			
			window.addEventListener('beforeunload',checkDirty,false);
			
			var jump = function(e){
				var hash = location.hash;
				
				if (hash.indexOf('/') > -1) {
					var parts = hash.split('/'),
						fileNameE1 = document.getElementById('file_name');
					
					view = parts[0].substring(1) + '-view'
				} else{
					
				}
			};
	
	};
	
	var init = function(){
		new SuperEditor();
	}
	
	window.addEventListener('load',init,false);
}();)
