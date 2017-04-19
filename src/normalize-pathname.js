'use strict';

var slashChar = '/';

/**
@method normalizePathname
@param {String} pathname - Pathname portion of a URL.
*/
module.exports = function normalizePathname (pathname) {
	// Normalize slashes.
	pathname = pathname.replace(/\/+/g, slashChar);

	// Remove last slash if exists and it's not the only part of the route.
	var routeExpLen = pathname.length;
	if (routeExpLen > 1) {
		var firstChar = pathname.charAt(0);
		var lastChar = pathname.charAt(routeExpLen - 1);

		if (firstChar === slashChar &&
			lastChar === slashChar) {
			pathname = pathname.substring(1, routeExpLen - 1);
		} else if (firstChar === slashChar) {
			pathname = pathname.substring(1);
		} else if (lastChar === slashChar) {
			pathname = pathname.substring(0, routeExpLen - 1);
		}
	}

	return pathname;
};
