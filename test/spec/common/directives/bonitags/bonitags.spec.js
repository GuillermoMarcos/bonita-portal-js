/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
	'use strict';
  describe('bonitags directive', function(){
    var scope, compile, timeout, iTags;
    beforeEach(module('org.bonitasoft.common.directives.bonitags'));

    beforeEach(inject(function($rootScope, $compile, $timeout) {
      scope = $rootScope.$new();
      compile = $compile;
      timeout = $timeout;
      //bootstrap-tags jquery function loads at an unknown moment...
      //we need to define a spy in order to avoid undefined errors
      //we can even check that passed arguments are correct
      $.fn.tags = jasmine.createSpy();
      iTags = {};
      iTags.renderReadOnly = jasmine.createSpy();
      $.fn.tags.and.returnValue(iTags);
    }));

    it('should initialize tags display', function() {
      scope.tagsSuggestion = [];
      scope.tagsSelection = [];
      var element = compile('<bonitags tags-suggestion="tagsSelection" tags-selection="tagsSuggestion"></bonitags>')(scope);
      expect(element.tags.calls.count()).toBe(0);
      scope.$apply();

      //cannot succesffully mocked $watch on an isoltaed scope...
      //that's why $watch is done inside the timeout, for 
      //tests to mock $watch on the isolated scope directly
      scope.$watch = jasmine.createSpy();
      element.isolateScope().$watch = scope.$watch;

      timeout.flush();
      var watchArgs = scope.$watch.calls.mostRecent().args;
      expect(watchArgs[0]).toEqual('tagsSelection');
      expect(watchArgs[2]).toEqual(true);
      var options  = element.tags.calls.mostRecent().args[0];
      expect(options.readOnly).toEqual(false);
      expect(options.tagData).toEqual(scope.tagsSelection);
      expect(options.suggestions).toEqual(scope.tagsSuggestion);
      expect(options.tagClass).toEqual('label-default');
      expect(options.promptText).toEqual(' ');
      expect(options.readOnlyEmptyMessage).toEqual(' ');
    });

    it('should watch for tags selection modification', function() {
      scope.tagsSuggestion = [];
      scope.tagsSelection = [];
      iTags.readOnly = true;
      var element = compile('<bonitags read-only tags-suggestion="tagsSelection" tags-selection="tagsSuggestion"></bonitags>')(scope);
      scope.$apply();
      timeout.flush();

      var options  = element.tags.calls.mostRecent().args[0];
      expect(options.readOnly).toEqual(true);
      expect(options.tagData).toEqual(scope.tagsSelection);
      expect(options.suggestions).toEqual(scope.tagsSuggestion);
      expect(options.tagClass).toEqual('label-default');
      expect(options.promptText).toEqual(' ');
      expect(options.readOnlyEmptyMessage).toEqual(' ');

      scope.tagsSelection.push('test');
      scope.$apply();
      expect(iTags.renderReadOnly).toHaveBeenCalled();
      iTags.renderReadOnly.calls.reset();
      delete iTags.readOnly;
      scope.tagsSelection.push('bonita');
      scope.$apply();
      expect(iTags.renderReadOnly).not.toHaveBeenCalled();
    });

    it('should not watch for tags selection modification', function() {
      scope.tagsSuggestion = [];
      scope.tagsSelection = [];
      iTags.readOnly = false;
      var element = compile('<bonitags read-only tags-suggestion="tagsSelection" tags-selection="tagsSuggestion"></bonitags>')(scope);
      scope.$apply();
      timeout.flush();

      var options  = element.tags.calls.mostRecent().args[0];
      expect(options.readOnly).toEqual(true);
      expect(options.tagData).toEqual(scope.tagsSelection);
      expect(options.suggestions).toEqual(scope.tagsSuggestion);
      expect(options.tagClass).toEqual('label-default');
      expect(options.promptText).toEqual(' ');
      expect(options.readOnlyEmptyMessage).toEqual(' ');

      scope.tagsSelection.push('test');
      scope.$apply();
      expect(iTags.renderReadOnly).not.toHaveBeenCalled();
    });
  });
})();
