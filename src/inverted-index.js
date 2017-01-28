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
   * Removes non alphanumeric chracters from a string and tokenizes it
   *
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
   * Removes duplicate strings from an array of strings
   *
   * @param {Array} words - An array of strings
   * @return {Array} uniqueWords - An array non-duplicate strings
   */
  static removeDuplicates(words) {
    return words.filter((item, index) => words.indexOf(item) === index);
  }

  /**
   * Sorts the keys of an Object
   *
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
   * Creates the Inverted Index data structure
   *
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
      /** Simply update the this.indexes object
       * Don't return it yet
       */
      this.indexes[filename] = index;
    }
  }

  /**
   * Returns all indexes or an index for a specified file
   *
   * @param{String} filename - Optional parameter specifying a file whose index is required
   * @returns{Object} - Object that contains all the index
   */
  getIndex(filename) {
    if (filename === undefined) {
      return this.indexes;
    }
    return this.indexes[filename];
  }

  /**
   * Function to iterate over the indexes object and returns the search results
   *
   * @param{Array} words - An array of words to be searched
   * @param{Object} indexes - An object containing inverted indexes
   * @param{String} fileName - Optional argument indicating the filename
   * @returns{Object} results - An object containing the search results
   */
  static iterCollection(words, indexes, fileName) {
    // Object to store search results
    const results = {};
    // check if fileName is undefined
    if (fileName === undefined) {
      // search all indexes
      for (const file in indexes) {
        results[file] = {};
        words.forEach((word) => {
          if (Object.keys(indexes[file]).includes(word)) {
            results[file][word] = indexes[file][word];
          } else {
            results[file][word] = 'Word not found!';
          }
        });
      }
    } else {
      // get the index for the file specified
      const fileIndex = indexes[fileName];
      words.forEach((word) => {
        if (Object.keys(fileIndex).includes(word)) {
          results[word] = fileIndex[word];
        } else {
          results[word] = 'Word not found!';
        }
      });
    }
    return (results);
  }

  /**
   * Searches all the indexes created or a particular index
   *
   * @param{Array} args - This is an array that can contain an infinite
   * number of arguments. The first element of this array maybe a filename,
   * if it is not all files are searched
   * @returns{Object} - The results of the search
   */
  searchIndex(...args) {
    let searchResults = {};

   /**
    * This neat trick allows us to 'flatten' an array
    * ...args is an array that contains multiple arguments
    * Convert allArgs to lower case /
    */
    let allArgs = args.toString().toLowerCase();

    allArgs = allArgs.split(',');

    // Get all the created indexes
    const allIndexes = this.getIndex();

    // Check if the first element of array is not a .json file
    if (args[0].slice(-5) !== '.json') {
      searchResults = InvertedIndex.iterCollection(allArgs, allIndexes);
    } else if (Object.keys(allIndexes).indexOf(allArgs[0]) === -1) {
      return ('Index for file not found!');
    } else {
      // Search for the file
      // Get the filename
      const nameOfFile = allArgs[0];
      // remove the first element from the allArgs array since its the filename
      allArgs.shift();
      searchResults = InvertedIndex.iterCollection(allArgs, allIndexes, nameOfFile);
    }
    return (searchResults);
  }
}
