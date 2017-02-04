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
   * Checks if a file is empty or invalid
   *
   * @param {Object} file - JSON object from which index is to be created
   * @returns{string}  A string describing the file's status
   */
  static validateFile(file) {
    if (file.length === 0) {
      return 'Empty file';
    }
    // get keys of all objects in JSON file
    let keys = [];
    file.forEach((doc) => {
      keys.push(Object.keys(doc));
    });
    // 'flatten' it to an array`
    keys = keys.toString().split(',');
    if (keys.includes('title') || keys.includes('text')) {
      return 'Valid file';
    }
    return 'Invalid file';
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
    if (InvertedIndex.validateFile(docToIndex) === 'Empty file') {
      this.indexes[filename] = ['JSON file is empty'];
    } else if (InvertedIndex.validateFile(docToIndex) === 'Invalid file') {
      this.indexes[filename] = ['JSON file is invalid'];
    } else {
      docToIndex.forEach((document, docIndex) => {
        const cleanWords = InvertedIndex.clean(`${document.title} ${document.text}`);
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
    return (filename === undefined) ? this.indexes : this.indexes[filename];
  }

  /**
   * Checks that index for file exists before search
   *
   * @param{String} file - Name of file which we want to search
   * @returns{Boolean} - A boolean indicating whether or not index for that file exists
   */
  indexExists(file) {
    return (Object.keys(this.getIndex()).includes(file));
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
    const allArgs = args.toString().toLowerCase().split(',');
    const searchResults = {};
    let filesToSearch;

    /**
     * Query is an array that contains the terms we want to search for
     * It is simply a copy of the allArgs array
     */
    const query = allArgs.slice();

    if (allArgs[0].slice(-5) === '.json') {
      /**
       * Assign filesToSearch to the first element of allArgs if it is a
       * filename
       */
      filesToSearch = Array(args[0]);
      // Remove the filename because we don't want to search for it
      query.shift();
      // check that index for the file exists before search
      if (!this.indexExists(allArgs[0])) {
        return ('Index for file does not exist');
      }
    } else {
      filesToSearch = Object.keys(this.getIndex());
    }

    filesToSearch.forEach((file) => {
      searchResults[file] = {};
      query.forEach((term) => {
        if (term in this.getIndex(file)) {
          searchResults[file][term] = this.getIndex(file)[term];
        } else {
          searchResults[file][term] = 'Word not found!';
        }
      });
    });
    return (allArgs[0].slice(-5) === '.json') ? searchResults[allArgs[0]] : searchResults;
  }
}
