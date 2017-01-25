/**
 * This is a class that defines the methods for an object that
 * creates the inverted index
 */
class InvertedIndex {
  /**
   * Constructor for the Inverted Index class
   */
  constructor() {
    // Object to store all indexes created
    this.indexes = {};
  }
  /**
   * @param {String} text - Words to get tokens from
   * @return {Array}  An array of sorted strings without non-alphanumeric symbols
   */
  static clean(text) {
    return text.replace(/[^a-z0-9\s]+/gi, '')
             .replace(/\s{2,}/g, ' ')
             .toLowerCase()
             .split(' ')
             .sort();
  }

  /**
   * @param {Array} words - An array of strings
   * @return {Array} uniqueWords - An array non-duplicate strings
   */
  static removeDuplicates(words) {
    return words.filter((item, index) => words.indexOf(item) === index);
  }

  /**
   * @param {Object} index - Efizi function to sort an Object
   * @return {Object} sortedObject - Object with keys sorted
   */
  static sortObjectKeys(index) {
    const sortedKeys = Object.keys(index).sort();
    // Object that will contain the sorted object
    const sortedObject = {};
    sortedKeys.forEach((key) => {
      sortedObject[key] = index[key];
    });
    return (sortedObject);
  }

  /**
   * @param{String} filename - Name of the file for which index is to be created
   * @param{Object} docToIndex - JSON file
   * @returns{undefined} - This function does not return anything it just
   * updates the this.indexes Object
   */
  createIndex(filename, docToIndex) {
    // This object stores the index of the current document
    let index = {};
    // Ensure JSON file is not empty or invalid
    if (docToIndex.length === 0) {
      this.indexes[filename] = 'JSON file is empty';
    } else if (!docToIndex[0].title && !docToIndex[0].text) {
      this.indexes[filename] = 'JSON file is invalid';
    } else {
      docToIndex.forEach((document, docIndex) => {
        const cleanWords = InvertedIndex.clean(document.text);
        const uniqueWords = InvertedIndex.removeDuplicates(cleanWords);

        uniqueWords.forEach((word) => {
          if (Object.keys(index).indexOf(word) === -1) {
            index[word] = [];
          }
          index[word].push(docIndex + 1);
        });
      });
      // Sort the index keys
      index = InvertedIndex.sortObjectKeys(index);
      // Simply update the this.indexes object
      // Don't return it yet
      this.indexes[filename] = index;
    }
  }

  /**
   * @returns{Object} - Object that contains all the index
   */
  getIndex() {
    return this.indexes;
  }

  /**
   * @param{Array} args - This is an array that can contain an infinite
   * number of arguments. The first element of this array maybe a filename,
   * if it is not all files are searched
   * @returns{undefined}
   */
  searchIndex(...args) {
    const searchResults = {};

    // This neat trick allows us to 'flatten' an array
    // ...args is an array that contains multiple arguments
    // Convert allArgs to lower case
    let allArgs = args.toString().toLowerCase();

    allArgs = allArgs.split(',');

    // Get all the created indexes
    const allIndexes = this.getIndex();

    // Check if the first element of array is not a .json file
    if (args[0].slice(-5) !== '.json') {
      // Search all indexes
      for (const fileName in allIndexes) {
        // Loop over the words
        searchResults[fileName] = {};
        allArgs.forEach((word) => {
          // If word is in that index
          if (Object.keys(allIndexes[fileName]).indexOf(word) > -1) {
            searchResults[fileName][word] = allIndexes[fileName][word];
          } else {
            searchResults[fileName][word] = 'Word not found!';
          }
        });
      }
      // If a filename is specified
      // Index the document by the filename
      // Check if the document exists first
      // Note that I use allArgs[0] because I assume the filename is the first argument
    } else if (Object.keys(allIndexes).indexOf(allArgs[0]) === -1) {
      return ('Index for file not found!');
    } else {
      // Search for the file
      // Index for the retrieved file
      const fileIndex = allIndexes[allArgs[0]];

      // Remove the first element of the array
      // Because it is the file name is specified and
      // We don't want to search for it :)
      allArgs.shift();
      allArgs.forEach((word) => {
        if (Object.keys(fileIndex).indexOf(word) > -1) {
          searchResults[word] = fileIndex[word];
        } else {
          searchResults[word] = 'Word not found!';
        }
      });
    }
    return (searchResults);
  }
}
