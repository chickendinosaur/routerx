'use strict';

/**
@method normalizePathname
@param {String} pathname - Pathname portion of a URL.
*/
module.exports = function normalizePathname (pathname) {
	// Normalize slashes.
	pathname = pathname.replace(/\/+/g, '/');

	if (pathname.charAt(0) !== '/') {
		pathname = `/${pathname}`;
	}

	// Remove last slash if exists and it's not the only part of the route.
	var routeExpLen = pathname.length;
	if (routeExpLen > 1 &&
		pathname.charAt(routeExpLen - 1) === '/') {
		pathname = pathname.substring(0, routeExpLen - 1);
	}

	return pathname;
};
