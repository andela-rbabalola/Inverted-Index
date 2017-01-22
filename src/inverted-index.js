class InvertedIndex{
	constructor(){
		//object to store all created indexes
		this.indexes = {};
	}

	/*
        * @param{String} text - Words to get tokens from
        * @preturn{Array} cleanText - An array of sorted strings without non-alphanumeric symbols
        **/
	clean(text){
		let cleanText = text.replace(/[\[\].,\/#!$%\^&\*;:{}?=\-_`~()]/g,"")
		 					          .replace(/\s{2,}/g, " ")
		 					          .toLowerCase()
		 					          .split(' ')
		 					          .sort();
		return(cleanText);
	}

	/*
	* @param{Array} words - An array of strings
	* @param{Array} uniqueWords - An array non-duplicate strings
	*/

	removeDuplicates(words){
		let uniqueWords = words.filter((item, index) => words.indexOf(item) === index);
		return(uniqueWords);
	}

	//Efizi function to sort the Object keys
	sortObjectKeys(index){
		let sortedKeys = Object.keys(index).sort();
		let sortedObject = {}; //Object that will contain the sorted object
		sortedKeys.forEach((key)=>{
			sortedObject[key] = index[key];
		});
		return(sortedObject);
	}

	/*
	* @param{String} filename - Name of the file for which index is to be created
	* This function does not return anything. It simply updates the indexes object
	**/
	createIndex(filename, docToIndex){
		//this object stores the index of the current document
		let index = {};
		docToIndex.forEach((document, docIndex) => {
			let cleanWords = this.clean(document.text);

			let uniqueWords = this.removeDuplicates(cleanWords);

			uniqueWords.forEach((word) => {
				if(Object.keys(index).indexOf(word) === -1){
					index[word] = [];
					index[word].push(docIndex + 1);
				} else{
					index[word].push(docIndex + 1);
				}
			});
		});
		//sort the index keys
		index = this.sortObjectKeys(index);
		//simply update the this.index object
		//don't return it yet
		this.indexes[filename] = index;
	}


	/*
	* This function return all the created indexes in an object
	**/
	getIndex(){
		return(this.indexes);
	}

	/*
	* @param(Array) args - This array may or may not contain the file to search if it does not, all files will be searched
	**/

	searchIndex(...args){
		let searchResults = {};

		//this neat trick allows us to 'flatten' an array
		//..args is an array that contains multiple arguments
		let allArgs = args.toString().split(',');

		//get all the created indexes
		let allIndexes = this.getIndex();

		//check if the first element of array is not a .json file
		if(args[0].slice(-5) !== ".json"){
		  //search all indexes
		  for(let fileName in allIndexes){
		    //loop over the words
		    searchResults[fileName] = {};
		    allArgs.forEach((word) => {
		      //if word is in that index
		      if(Object.keys(allIndexes[fileName]).indexOf(word) > -1){
		        searchResults[fileName][word] = allIndexes[fileName][word];
		      } else{
		        searchResults[fileName][word] = "Word not found!";
		      }
		    });
		  }

		} else{
		  //if a filename is specified
		  //index the document by the filename
		  //Check if the document exists first
		  //Note that I use allArgs[0] because I assume the filename is the first argument
		  if(Object.keys(allIndexes).indexOf(allArgs[0]) === -1){
		    return("Index for file not found!");
		  } else{
		    //search for the file
		    //Index for the retrieved file
		    let fileIndex = allIndexes[allArgs[0]];

                    //remove the first element of the array
		    //because  it is the file name is specified and
		    //we don't want to search for it :)
		    allArgs.shift();
		    allArgs.forEach((word) => {
		      if(Object.keys(fileIndex).indexOf(word) > -1){
		        searchResults[word] = fileIndex[word];
		      } else{
		        searchResults[word] = "Word not found!";
		      }
		    });
		  }
		}
		return(searchResults);
	}
}
