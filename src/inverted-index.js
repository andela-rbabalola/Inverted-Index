class InvertedIndex{
	constructor(){
		//Object to store the index
		this.index = {};
	}

	/*
     * @param{String} text - Words to get tokens from
     * @preturn{Array} cleanText - An array of sorted strings without non-alphanumeric symbols
     **/
	static clean(text){
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

	static removeDuplicates(words){
		//first separate strings into words
		//let tokens = InvertedIndex.clean(words);
		let uniqueWords = words.filter((item, index) => words.indexOf(item) === index);
		return(uniqueWords);
	}

	/*
	* @param{Array} docToIndex - A JSON array of text objects to index
	* @return{Object} index - An object that maps words to locations
	**/

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
   * @param{String} terms - Search query
   * @param{Object} invIndex - Index to perform search on
   * @return{Object} results - Object that maps terms in search query to documents
   */
   searchIndex(terms, invIndex){
   	let results = {};
		//clean and tokenize the search query
		let cleanTerms = InvertedIndex.clean(terms);
   	//get only the unique words from the term array
   	let uniqueWords = InvertedIndex.removeDuplicates(cleanTerms);
   	//perform cleaning operations on query terms
   	cleanTerms.forEach((term) =>{
   		if(Object.keys(invIndex).indexOf(term) > -1){
   			results[term] = invIndex[term];
   		} else {
   			results[term] = 'Word not found!';
   		}
   	});
   	return(results);
   }
}