//handler for the Upload file button
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
            console.log($scope.myFile.name);
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
        console.log($scope.theFile);
				//array to contain the names of documents
				$scope.docs = [];
				$scope.range = [];
				//iterate over the file and get the document names
				$scope.theFile.forEach((document, docIndex) => {
					$scope.docs.push(`${document.title}`);
					$scope.range.push(docIndex + 1);
				});
				$scope.indexExists = true;
				//uploadMessage("Index successfully created!");
				$scope.createdIndexes = invIndex.getIndex();
				console.log($scope.createdIndexes);
			} else {
				$scope.indexExists = false;
				uploadMessage('Upload a JSON file first');
			}
		};

		//This function updates the table displayed by the select option
		 $scope.update = () => {
			$scope.displayTable = true;
		 	$scope.currentIndex = $scope.createdIndexes[$scope.selectedFile];
			console.log($scope.currentIndex);
		 };

		$scope.searchDoc = () => {
			if($scope.uploadSuccess && $scope.indexExists){
				$scope.query = $scope.searchQuery;
				$scope.searchResults = invIndex.searchIndex($scope.query, $scope.theIndex);

				$scope.validSearch = true;
			} else{
				$scope.validSearch = false;
			}
		};
	});
})();
