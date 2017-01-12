function getTokens(text){
	//remove punctuations and other characters
	let cleanText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
	                    //remove excess whitespace
	                    .replace(/\s{2,}/g," ")
	                    //convert to lower case
	                    .toLowerCase()
	                    //split into words
	                    .split(' ')
	                    //sort
	                    .sort();
	return(cleanText);
}

class InvertedIndex{
	constructor(){
		//Object to store the index
		this.index = {};
	}

	/*
	* Function to separate a string into words
	* Non-alphanumeric characters are removed 
	* The text is converted to lower case and sorted
	*/
	static clean(text){
		let cleanText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
		 					.replace(/\s{2,}/g, " ")
		 					.toLowerCase()
		 					.split(' ')
		 					.sort();
		return(cleanText);
	}

	/*
	* Function to remove duplicate words
	* from an array of strings
	*/

	static removeDuplicates(words){
		let uniqueWords = words.filter((item, index) => words.indexOf(item) === index);
		return(uniqueWords);
	}

	getIndex(docToIndex){
		const index = {};

		docToIndex.forEach((document, docIndex) => {
			let cleanWords = InvertedIndex.clean(document.text);
			//remove duplicates from words
			let uniqueWords = InvertedIndex.removeDuplicates(cleanWords);

			//loop again on each word in clean words
			uniqueWords.forEach((word) => {
			/*if word is not a key in the index create it as a key
			* assign it an empty array
			*/

		    if(Object.keys(index).indexOf(word) === -1){
			    index[word] = [];
			    index[word].push(docIndex + 1);
		    } else{
			    index[word].push(docIndex + 1);
		    }
		});
	});
		this.index = index;
		return index;
   }

   /*
   * Function to search the index for a given word
   */
   searchIndex(terms, invIndex){
   	let results = {};
   	//get only the unique words from the term array
   	let uniqueWords = InvertedIndex.removeDuplicates(terms);
   	//perform cleanning operations on query terms
   	terms.forEach((term) =>{
   		if(Object.keys(invIndex).indexOf(term) > -1){
   			results[term] = invIndex[term];
   		} else {
   			results[term] = 'Word not found!';
   		}
   	});
   	return(results);
   }
}
