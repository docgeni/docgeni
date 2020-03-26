module.exports = {
	deleteDestPath: !process.env.WATCH_MODE,
	lib: {
		entryFile: "public-api.ts",
		cssUrl: "inline",
		umdModuleIds: {
			// vendors
			"tslib": "tslib",
			"lodash": "_",

			// local
			"docg": "docg",
			"preset": "preset",
		}
	},
	whitelistedNonPeerDependencies: ["."]
}
