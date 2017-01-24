(() => {
  const app = angular.module('invertedIndexApp');
  // create instance of InvertedIndex object
  const invIndex = new InvertedIndex();
  app.controller('uploadController', ($scope) => {
    uploadMessage = (msg) => {
      $scope.$apply(() => {
        $scope.uploadError = msg;
      });
    };
    // Array that contains all file names uploaded in that session
    $scope.allFiles = [];
    // Array to contain the document title in each file
    $scope.docs = {};
    // Object that contains the doc numbers for docs in each file
    $scope.range = {};
    $scope.uploadFile = () => {
      const file = $scope.myFile;
      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = (a) => {
        if (!file.name.toLowerCase().match(/\.json$/)) {
          $scope.uploadSuccess = false;
          uploadMessage('Please upload a JSON file');
          $scope.indexSuccess = false;
          return;
        } else if (file === undefined) {
          uploadMessage('Please upload a file first');
        }
        try {
          const theFile = JSON.parse(a.target.result);
          if (theFile.length === 0 || !theFile[0].title || !theFile[0].text) {
            $scope.uploadSuccess = false;
            $scope.indexSuccess = false;
            uploadMessage('JSON file uploaded is invalid');
            $scope.$apply();
          } else if ($scope.allFiles.indexOf(file.name) > -1) {
            uploadMessage('File has been uploaded before!');
            $scope.uploadSuccess = false;
          } else {
            $scope.indexSuccess = false;
            $scope.hideSuccess = true;
            $scope.uploadSuccess = true;
            $scope.allFiles.push(file.name);
          }
          $scope.theFile = theFile;
          $scope.$apply();
        } catch (e) {
          uploadMessage(e);
        }
      };
    };

    $scope.createIndex = () => {
      if ($scope.uploadSuccess) {
        if (Object.keys(invIndex.getIndex()).indexOf($scope.myFile.name) > -1) {
          $scope.oldFile = true;
        } else {
          $scope.theIndex = invIndex.createIndex($scope.myFile.name, $scope.theFile);
          // iterate over the file and get the document names
          $scope.theFile.forEach((document, docIndex) => {
            if (Object.keys($scope.docs).indexOf($scope.myFile.name) === -1) {
              $scope.docs[$scope.myFile.name] = [];
              $scope.docs[$scope.myFile.name].push(`${document.title}`);
            } else {
              $scope.docs[$scope.myFile.name].push(`${document.title}`);
            }

            if (Object.keys($scope.range).indexOf($scope.myFile.name) === -1) {
              // If we don't have an entry for that file create it and
              // push the current docIndex to it
              $scope.range[$scope.myFile.name] = [];
              $scope.range[$scope.myFile.name].push(docIndex + 1);
            } else {
              // check if current doc Index is not in the array for that file
              // and then push it
              $scope.range[$scope.myFile.name].push(docIndex + 1);
            }
          });
          $scope.indexSuccess = true;
          $scope.indexExists = true;
          $scope.hideSuccess = false;
          $scope.createdIndexes = invIndex.getIndex();
        }
      } else {
        $scope.indexExists = false;
      }
    };

    // This function updates the table displayed by the select option
    $scope.update = () => {
      $scope.displayTable = true;
      $scope.currentIndex = $scope.createdIndexes[$scope.selectedFile];
    };

    // This hides the tables when necessary
    $scope.hideTable = () => {
      $scope.multipleSearchTable = false;
      $scope.displaySearchTable = false;
    };

    $scope.searchDoc = () => {
      if ($scope.uploadSuccess && $scope.indexExists) {
        // check if the Search query is an empty string or whitespace

        if ($scope.fileToSearch === 'All files') {
          // display search for all docs because filename is not specified
          $scope.query = $scope.searchQuery;

          // disable table for single document search
          // enable table for multiple search
          $scope.displaySearchTable = false;
          $scope.multipleSearchTable = true;
          $scope.validSearch = true;

          // get and search all the indexes for files uploaded
          $scope.searchResults = invIndex.searchIndex($scope.query);
        } else {
          $scope.query = $scope.searchQuery;
          $scope.searchResults = invIndex.searchIndex($scope.fileToSearch, $scope.query);

          $scope.displaySearchTable = true;
          $scope.multipleSearchTable = false;
          $scope.validSearch = true;
        }
      } else {
        $scope.validSearch = false;
      }
    };
  });
})();
