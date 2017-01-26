(() => {
  const app = angular.module('invertedIndexApp');

  /**
   * A directive to enable two way data binding of this field
   */
  app.directive('fileModel', $parse => ({
      // Directive can be used as attribute
    restrict: 'A',

      /**
       * link is a function that defines functionality of directive
       * scope: scope associated with the element
       * element: element on which this directive used
       * attrs: key value pair of element attributes
       */

    link(scope, element, attrs) {
      const model = $parse(attrs.fileModel),
          // Define a setter for fileModel
        modelSetter = model.assign;
        // Bind change event on the element
      element.bind('change', () => {
          // Call apply on scope, it checks for value changes and reflect them on UI
        scope.$apply(() => {
            // Set the model value
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  }));
})();
