(function(){
	let app = angular.module('invertedIndexApp');

	/*
	* A directive to enable two way data binding of this field
	*/
	app.directive('fileModel', function($parse){
		return {
			restrict: 'A', //directive can be used as attribute
			/*
             link is a function that defines functionality of directive
             scope: scope associated with the element
             element: element on which this directive used
             attrs: key value pair of element attributes
             */

             link: function(scope, element, attrs){
             	let model = $parse(attrs.fileModel),
             	    modelSetter = model.assign; //define a setter for fileModel
             	//Bind change event on the element
             	element.bind('change', function(){
             		//Call apply on scope, it checks for value changes and reflect them on UI
             		scope.$apply(function(){
             			//set the model value
             			modelSetter(scope, element[0].files[0]); 
             		});
             	});
             }
		};
	});

})();