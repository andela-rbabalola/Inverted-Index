const docs = require('./books');
const secondDoc = require('./books_2');
const emptyDoc = require('./empty.json');
const invalidDoc = require('./invalid.json');
// This is a JSON file that already contains search results
// I exported it to make this test suite cleaner
const searchResults = require('./searchResults.json');
// A test suite to read data from books
describe('Test suite for Inverted Index', () => {
  // create an object of the Inverted Index class
  const theIndex = new InvertedIndex();
  const sentence = 'This# is@ a Sample *sentence &with some some ^dirt';
  const multSearchTerms = 'An Alice man tormented market'.split(' ');
  const allSearchTerms = 'Powerful dangerous young spy wizard elf'.split(' ');

  // create inverted indexes from the filenames
  theIndex.createIndex('books.json', docs);
  theIndex.createIndex('books_2.json', secondDoc);
  theIndex.createIndex('empty_doc.json', emptyDoc);
  theIndex.createIndex('invalid_doc.json', invalidDoc);

  /*
  * Object that stores all the indexes created for every file
  * It ensures that a new index does not overwrite the current index
  * key -> String that is the name of the file
  * value -> Inverted Index for that file
  */
  const allIndexes = theIndex.getIndex();

  // Create an Inverted Index for the file
  theIndex.getIndex(docs);

  describe('Inverted Index Class', () => {
    it('Should be an instance of a class', () => {
      expect(theIndex instanceof InvertedIndex).toBe(true);
      expect(theIndex instanceof Object).toBe(true);
      expect(typeof theIndex).toBe('object');
    });
  });

  describe('Test for the cleaning function', () => {
    it('Should return an array of strings', () => {
      expect(InvertedIndex.clean(sentence).constructor).toBe(Array);
    });

    it('Should not contain non-alphanumeric characters', () => {
      expect(InvertedIndex.clean(sentence)).not.toContain(/[#@^&]/g);
    });

    it('Should have the correct number of words', () => {
      expect(InvertedIndex.clean(sentence).length).toBe(9);
    });

    it('Should have the clean method defined', () => {
      expect(InvertedIndex.clean).toBeDefined();
    });
  });

  describe('Test for removing duplicates', () => {
    it('Should not contain duplicate words', () => {
      const testArray = InvertedIndex.removeDuplicates(InvertedIndex.clean(sentence));
      expect(testArray.length).toBe(new Set(testArray).size);
    });

    it('Should have the removeDuplicates method defined', () => {
      expect(InvertedIndex.removeDuplicates).toBeDefined();
    });
  });

  describe('Read book data', () => {
    it('Should confirm that an empty JSON file is empty', () => {
      const emptyIndex = allIndexes['empty_doc.json'];
      expect(emptyIndex).toBe('JSON file is empty');
    });

    it('Should confirm that an invalid JSON file is invalid', () => {
      const invalidIndex = allIndexes['invalid_doc.json'];
      expect(invalidIndex).toBe('JSON file is invalid');
    });

    it('Should confirm that a non-empty file is not empty', () => {
      expect(theIndex.getIndex(docs)).not.toBe('JSON file is empty');
    });

    it('Should have the getIndex method defined', () => {
      expect(theIndex.getIndex).toBeDefined();
    });
  });

  describe('Populate Index', () => {
    it('Should verify Index is created', () => {
      // This verifies that an entry for a word is created
      expect(allIndexes['books.json'].alice).toBeDefined();
    });

    it('Should map words to correct docs', () => {
      expect(allIndexes['books.json'].alice).toEqual([1]);
      expect(allIndexes['books.json'].a).toEqual([1, 2, 3]);
    });

    // Should ensure a new index is not overwritten
    it('Should ensure a new index does not overwrite other indexes', () => {
      // Check that allIndexes Object has number of keys greater than 1
      expect(Object.keys(allIndexes).length).toBeGreaterThan(1);
    });
  });

  describe('Search index', () => {
    it('Should have searchIndex method defined', () => {
      expect(theIndex.searchIndex).toBeDefined();
    });

    it('Should return the correct results', () => {
      expect(theIndex.searchIndex('books.json', 'ring')).toEqual({ ring: [2] });
    });

    it('Should return the correct results', () => {
      expect(theIndex.searchIndex('books.json', 'an')).toEqual({ an: [2, 4] });
    });

    it('Should return correct results for searching all documents', () => {
      expect(theIndex.searchIndex('books.json', multSearchTerms)).toEqual({
        an: [2, 4],
        alice: [1],
        man: [2],
        tormented: [3],
        market: 'Word not found!'
      });
    });

    it('Should return correct results when filename is not specified', () => {
      console.log(allSearchTerms);
      expect(theIndex.searchIndex(allSearchTerms)).toEqual(searchResults[0]);
    });

    it('Should be able to handle an array of search arguments', () => {
      expect(theIndex.searchIndex(['an', 'ring', 'a'], 'life')).toEqual(searchResults[1]);
    });

    it('Should ensure search does not take too long', () => {
      // We set a threshold of 5 milliseconds
      start = new Date();
      // Search
      // Here we don't specify a file we search all files
      theIndex.searchIndex(['an', 'ring', 'a'], 'life');
      end = new Date();
      expect(end.getTime() - start.getTime()).toBeLessThan(5);
    });
  });
});
