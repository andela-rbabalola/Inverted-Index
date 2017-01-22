(function (){
	let app = angular.module('invertedIndexApp');
	//create instance of InvertedIndex object
	const invIndex = new InvertedIndex();
	app.controller('uploadController', ($scope) => {
		uploadMessage = (msg) => {
		$scope.$apply(() => {
			$scope.uploadError = msg;
		});
	};
		//Array that contains all file names uploaded in that session
		$scope.allFiles = [];
		//Array to contain the document title in each file
		$scope.docs = {};
		//Helps for iteration ?? Explain more
		//Object that contains the doc numbers for docs in each file
		$scope.range = {};

		$scope.uploadFile = () => {
			const file = $scope.myFile;
			const reader = new FileReader();
			reader.readAsText(file);

			reader.onload = (a) => {
				if(!file.name.toLowerCase().match(/\.json$/)){
					$scope.uploadSuccess = false;
					uploadMessage('Please upload a JSON file');
					return;
				} try {
					const theFile = JSON.parse(a.target.result);
					if(theFile.length === 0 || !theFile[0].title || !theFile[0].text){
						$scope.uploadSuccess = false;
						uploadMessage('JSON file uploaded is invalid');
						$scope.$apply();
					} else {
						$scope.uploadSuccess = true;
						$scope.allFiles.push(file.name);
					}
					 $scope.theFile = theFile;
           				 $scope.$apply();

				} catch (e){
					uploadMessage(e);
				}
			};
		};

		$scope.createIndex = () => {
			if($scope.uploadSuccess){
				$scope.theIndex = invIndex.createIndex($scope.myFile.name, $scope.theFile);

				//iterate over the file and get the document names
				$scope.theFile.forEach((document, docIndex) => {

				if(Object.keys($scope.docs).indexOf($scope.myFile.name) === -1 ){
					$scope.docs[$scope.myFile.name] = [];
					$scope.docs[$scope.myFile.name].push(`${document.title}`);
				} else{
					$scope.docs[$scope.myFile.name].push(`${document.title}`);
				}

				if(Object.keys($scope.range).indexOf($scope.myFile.name) === -1){
					//If we don't have an entry for that file create it and push the current docIndex to it
					$scope.range[$scope.myFile.name] = [];
					$scope.range[$scope.myFile.name].push(docIndex + 1);
				} else {
					//check if current doc Index is not in the array for that file
					//and then push it
					$scope.range[$scope.myFile.name].push(docIndex + 1);
				}
			});
				$scope.indexExists = true;
				$scope.createdIndexes = invIndex.getIndex();

			} else {
				$scope.indexExists = false;
				uploadMessage('Upload a JSON file first');
			}
		};

		  //This function updates the table displayed by the select option
		  $scope.update = () => {
			$scope.displayTable = true;
		 	$scope.currentIndex = $scope.createdIndexes[$scope.selectedFile];
		 };

		 $scope.hideTable = () => {
			 $scope.multipleSearchTable = false;
			 $scope.displaySearchTable = false;
		 };

		$scope.searchDoc = () => {
			if($scope.uploadSuccess && $scope.indexExists){
				if($scope.fileToSearch === "All files"){
					//display search for all docs because filename is not specified
					$scope.query = $scope.searchQuery;

					//disable table for single document search
					//enable table for multiple search
					$scope.displaySearchTable = false;
					$scope.multipleSearchTable = true;
					$scope.validSearch = true;

					//get and search all the indexes for files uploaded
					$scope.searchResults = invIndex.searchIndex($scope.query);

				} else {
					$scope.query = $scope.searchQuery;
					$scope.searchResults = invIndex.searchIndex($scope.fileToSearch, $scope.query);

					$scope.displaySearchTable = true;
					$scope.multipleSearchTable = false;
					$scope.validSearch = true;
				}
			} else{
				$scope.validSearch = false;
			}
		};
	});
})();
