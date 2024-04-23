# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.3.2-next.0](https://github.com/docgeni/docgeni/compare/v2.3.1...v2.3.2-next.0) (2024-04-23)


### Bug Fixes

* **core:** trigger recompile when latest compilation is finished ([fa37adb](https://github.com/docgeni/docgeni/commit/fa37adb1b49dbfe0d5e72799337c36dc3815ca7a))
* **ngdoc:** cache latest file content, only trigger watcher func when file content changed #OSP-625 ([#542](https://github.com/docgeni/docgeni/issues/542)) ([4f5ee09](https://github.com/docgeni/docgeni/commit/4f5ee09e9544b0d8c8ca696e7b30236601a7145a)), closes [#OSP-625](https://github.com/docgeni/docgeni/issues/OSP-625)





## [2.3.1](https://github.com/docgeni/docgeni/compare/v2.3.0...v2.3.1) (2024-04-12)


### Features

* **ngdoc:** support parse alias in input params #INFR-12159 ([0cc36cf](https://github.com/docgeni/docgeni/commit/0cc36cf36493de7cc5c1404d21289ea02582f527)), closes [#INFR-12159](https://github.com/docgeni/docgeni/issues/INFR-12159)
* upgrade ng to 17 ([#530](https://github.com/docgeni/docgeni/issues/530)) ([4e9b483](https://github.com/docgeni/docgeni/commit/4e9b483176e71d068d34b222a6c49ea2a85860f6))





# [2.3.0](https://github.com/docgeni/docgeni/compare/v2.3.0-next.0...v2.3.0) (2023-12-27)


### Bug Fixes

* **core:** add custom path for component ([87954ae](https://github.com/docgeni/docgeni/commit/87954ae219ca79653fc3cae0b561e4a323b8f15f))





# [2.3.0-next.0](https://github.com/docgeni/docgeni/compare/v2.2.2...v2.3.0-next.0) (2023-12-05)


### Features

* **core:** export standalone components  from examples module for stack-blitz #INFR-10671 ([#518](https://github.com/docgeni/docgeni/issues/518)) ([abbeffd](https://github.com/docgeni/docgeni/commit/abbeffd586f3ff9852d49d33fe7a2cc253b94e8c)), closes [#INFR-10671](https://github.com/docgeni/docgeni/issues/INFR-10671)
* **ngdoc:** pipe api doc default public ([8e83c1b](https://github.com/docgeni/docgeni/commit/8e83c1bee2b2e60b3359216c043525db02b6c75a))
* **ngdoc:** support pipe api doc ([#515](https://github.com/docgeni/docgeni/issues/515)) ([c60e648](https://github.com/docgeni/docgeni/commit/c60e648be1bb824a225f373959486b1d15c7b889))





## [2.2.2](https://github.com/docgeni/docgeni/compare/v2.2.1...v2.2.2) (2023-11-21)


### Bug Fixes

* **toolkit:** add ora to  dependencies of toolkit ([51229a3](https://github.com/docgeni/docgeni/commit/51229a382496291ecd97050fd9effea2332d7f09))


### Features

* **toolkit:** copy support exclude ([9f56049](https://github.com/docgeni/docgeni/commit/9f560492dcf776aee211b9306813a03b42a5466e))





## [2.2.1](https://github.com/docgeni/docgeni/compare/v2.2.0...v2.2.1) (2023-10-25)


### Bug Fixes

* **core:** set default sort of category to 0 ([c251e82](https://github.com/docgeni/docgeni/commit/c251e82421ff35cafe6b13563f706dd32ee8be8d))
* **core:** should sort navs of component lib without category ([0f21bb5](https://github.com/docgeni/docgeni/commit/0f21bb5c65890e2dc26c56a3b38d1bc29174b1ca))
* **template:** show next and pre in root dir ([#509](https://github.com/docgeni/docgeni/issues/509)) ([9d196a1](https://github.com/docgeni/docgeni/commit/9d196a1a8ea3d712d57a0b421ac1610afd7b1af0))


### Features

* **core:** return headings when build component #INFR-9194 ([4dce242](https://github.com/docgeni/docgeni/commit/4dce2425116d937fc42409174712bae974f609b1)), closes [#INFR-9194](https://github.com/docgeni/docgeni/issues/INFR-9194)
* **ngdoc:** use [@public](https://github.com/public) mark methods of component as public [#504](https://github.com/docgeni/docgeni/issues/504) ([8000f12](https://github.com/docgeni/docgeni/commit/8000f12ddf7b395d787675259d6e74c08ab27825))





# [2.2.0](https://github.com/docgeni/docgeni/compare/v2.1.1...v2.2.0) (2023-05-23)


### Features
* support Angular v16 version
### Bug Fixes

* remove entryComponents ([4818fe3](https://github.com/docgeni/docgeni/commit/4818fe31cd5e48ef7642ba7b540a3dac4c33b4f3))
* **core:** remove defaultProject and update root to src for site angular.json ([33a4e70](https://github.com/docgeni/docgeni/commit/33a4e703e8bce74b129769386adc6cc10477ff3b))


## [2.1.1](https://github.com/docgeni/docgeni/compare/v2.1.0...v2.1.1) (2023-04-24)


### Bug Fixes

* should load root components when include is undefined or empty ([8169bbc](https://github.com/docgeni/docgeni/commit/8169bbc771d7cdcdec64c7511e9f20cef8ad3c75))
* **core:** remove defaultProject and update root to src for site angular.json



# [2.1.0](https://github.com/docgeni/docgeni/compare/v2.1.0-next.11...v2.1.0) (2023-04-21)

### Bug Fixes

* **cli:** ng-add remove --prod flag ([964b12a](https://github.com/docgeni/docgeni/commit/964b12ac55f1811208119022538a4ea545c87a70))
* **core:** exclude examples and spec files when parse api docs ([bbd009b](https://github.com/docgeni/docgeni/commit/bbd009b5dc11e364e1a3b1e0a7a7e571a1864ed0))
* **ngdoc:** replace logic of custom parse tags by signature with ts tag infos array [#469](https://github.com/docgeni/docgeni/issues/469) ([#471](https://github.com/docgeni/docgeni/issues/471)) ([518cfc7](https://github.com/docgeni/docgeni/commit/518cfc767237f8c38e05d1510d4733618c5c280f))
* **template:** update word-break to break-all of api table td ([6b86d17](https://github.com/docgeni/docgeni/commit/6b86d1782031854f4b9bee613225c5649f114fdf))
* **template:** update sub selectors of dg-doc-content to avoid cover elements styles of example viewer [#432](https://github.com/docgeni/docgeni/issues/432) ([3b7d623](https://github.com/docgeni/docgeni/commit/3b7d623dccba10d28d84193654768acb21a9bd4f))
* **core:** update *.ts to **/*.ts for ngDocParser component ([5b702f8](https://github.com/docgeni/docgeni/commit/5b702f817b13fea4cf00c9bad833bf25781cc682))
* **ngdoc:** methods duplicate removal for overload ([#465](https://github.com/docgeni/docgeni/issues/465)) ([d31178a](https://github.com/docgeni/docgeni/commit/d31178a2dff1024c5214a8ba7d3fee8887a63c7e))
* **ngdoc:** use getTypeAtLocation by identifier for get heritage declarations in other module ([d2ffeec](https://github.com/docgeni/docgeni/commit/d2ffeecb46d85f5f88ae95d995a155d49b538fb4))
* **core:** mark enableIvy as override for LibExampleLoader [#458](https://github.com/docgeni/docgeni/issues/458) ([#461](https://github.com/docgeni/docgeni/issues/461)) ([f42f2ad](https://github.com/docgeni/docgeni/commit/f42f2ad6003dfa5ee411cf87bb3068887d0e13d2))
* **core:** update default value to property.default when it is not undefined or null [#424](https://github.com/docgeni/docgeni/issues/424) ([#463](https://github.com/docgeni/docgeni/issues/463)) ([83bd8cb](https://github.com/docgeni/docgeni/commit/83bd8cb2c0e34a154e73b594bff2f9af27ad3edc))
* **ngdoc:** should parse correct tags when has multi-language ([#459](https://github.com/docgeni/docgeni/issues/459)) ([ab8ab53](https://github.com/docgeni/docgeni/commit/ab8ab533b5c1a4924095615c36bf943a2a1c3de9))
* **template:** update homeMeta to nullable for home template ([e563102](https://github.com/docgeni/docgeni/commit/e563102a473bd4dec8f5cff555f181f9b643e22b))
* update tag h1 to span for dg-doc-header avoid conflict ([3a12593](https://github.com/docgeni/docgeni/commit/3a125938c279b7f8968f88c11531f83cf0a7d997))


### Features
* **core:** remove default logic that parse components for lib root path, only according to include, and root dir exclude include in config ([76d1e78](https://github.com/docgeni/docgeni/commit/76d1e78013fc98ac0a8f08a3f28634eec965e813))
* **cli:** set apiMode to automatic when ng add @docgeni/cli ([2288c3e](https://github.com/docgeni/docgeni/commit/2288c3e6a310866131692ec3f48da5e92ee05907))
* **core:** update site-template to ng 15 ([2aac8ff](https://github.com/docgeni/docgeni/commit/2aac8ff1eb974a2c572a6b281f496d31a8e345ec))
* **ngdoc:** parse heritage declarations for directives, services and class-likes #INFR-6929 ([edf7a6d](https://github.com/docgeni/docgeni/commit/edf7a6d78f10aaa53625fc4e4a66c40de97d714e)), closes [#INFR-6929](https://github.com/docgeni/docgeni/issues/INFR-6929)
* **core:** custom components support standalone #INFR-6938 ([#455](https://github.com/docgeni/docgeni/issues/455)) ([721b17c](https://github.com/docgeni/docgeni/commit/721b17c06b952d1a37a70193daaafc008a8a3a0b)), closes [#INFR-6938](https://github.com/docgeni/docgeni/issues/INFR-6938)
* **core:** example support standalone component #INFR-6744 ([#450](https://github.com/docgeni/docgeni/issues/450)) ([08d517c](https://github.com/docgeni/docgeni/commit/08d517c9d04ad032d15743b0be80fe414b83139d)), closes [#INFR-6744](https://github.com/docgeni/docgeni/issues/INFR-6744)
* **ngdoc:** support interface and class api doc when mark public or publicApi ([#452](https://github.com/docgeni/docgeni/issues/452)) ([81dcaca](https://github.com/docgeni/docgeni/commit/81dcacabb20087862221bf1be1df23244bd99387))
* **template:** exports "./styles/index.css" in @docgeni/template ([83b3f99](https://github.com/docgeni/docgeni/commit/83b3f993f23f268154842defc7614c193a37ddd2))
* **template:** exports "./styles/index.css" in @docgeni/template ([83b3f99](https://github.com/docgeni/docgeni/commit/83b3f993f23f268154842defc7614c193a37ddd2))
* **template:** add exports of scss in package.json ([c10a8a0](https://github.com/docgeni/docgeni/commit/c10a8a07ed46ff3378e1e3431a4ff08857539113))


# [2.1.0-next.11](https://github.com/docgeni/docgeni/compare/v2.1.0-next.10...v2.1.0-next.11) (2023-04-21)


### Bug Fixes

* **cli:** ng-add remove --prod flag ([964b12a](https://github.com/docgeni/docgeni/commit/964b12ac55f1811208119022538a4ea545c87a70))


### Features

* **core:** remove default logic that parse components for lib root path, only according to include, and root dir exclude include in config ([76d1e78](https://github.com/docgeni/docgeni/commit/76d1e78013fc98ac0a8f08a3f28634eec965e813))





# [2.1.0-next.10](https://github.com/docgeni/docgeni/compare/v2.1.0-next.9...v2.1.0-next.10) (2023-04-19)

**Note:** Version bump only for package docgeni





# [2.1.0-next.9](https://github.com/docgeni/docgeni/compare/v2.1.0-next.8...v2.1.0-next.9) (2023-04-14)


### Bug Fixes

* **core:** exclude examples and spec files when parse api docs ([bbd009b](https://github.com/docgeni/docgeni/commit/bbd009b5dc11e364e1a3b1e0a7a7e571a1864ed0))





# [2.1.0-next.8](https://github.com/docgeni/docgeni/compare/v2.1.0-next.7...v2.1.0-next.8) (2023-04-13)


### Bug Fixes

* **ngdoc:** replace logic of custom parse tags by signature with ts tag infos array [#469](https://github.com/docgeni/docgeni/issues/469) ([#471](https://github.com/docgeni/docgeni/issues/471)) ([518cfc7](https://github.com/docgeni/docgeni/commit/518cfc767237f8c38e05d1510d4733618c5c280f))
* **template:** update word-break to break-all of api table td ([6b86d17](https://github.com/docgeni/docgeni/commit/6b86d1782031854f4b9bee613225c5649f114fdf))





# [2.1.0-next.7](https://github.com/docgeni/docgeni/compare/v2.1.0-next.6...v2.1.0-next.7) (2023-04-12)


### Bug Fixes

* **template:** update sub selectors of dg-doc-content to avoid cover elements styles of example viewer [#432](https://github.com/docgeni/docgeni/issues/432) ([3b7d623](https://github.com/docgeni/docgeni/commit/3b7d623dccba10d28d84193654768acb21a9bd4f))





# [2.1.0-next.6](https://github.com/docgeni/docgeni/compare/v2.1.0-next.5...v2.1.0-next.6) (2023-04-04)


### Bug Fixes

* **core:** update *.ts to **/*.ts for ngDocParser component ([5b702f8](https://github.com/docgeni/docgeni/commit/5b702f817b13fea4cf00c9bad833bf25781cc682))
* **ngdoc:** methods duplicate removal for overload ([#465](https://github.com/docgeni/docgeni/issues/465)) ([d31178a](https://github.com/docgeni/docgeni/commit/d31178a2dff1024c5214a8ba7d3fee8887a63c7e))
* **ngdoc:** use getTypeAtLocation by identifier for get heritage declarations in other module ([d2ffeec](https://github.com/docgeni/docgeni/commit/d2ffeecb46d85f5f88ae95d995a155d49b538fb4))





# [2.1.0-next.5](https://github.com/docgeni/docgeni/compare/v2.1.0-next.4...v2.1.0-next.5) (2023-03-28)


### Bug Fixes

* **core:** mark enableIvy as override for LibExampleLoader [#458](https://github.com/docgeni/docgeni/issues/458) ([#461](https://github.com/docgeni/docgeni/issues/461)) ([f42f2ad](https://github.com/docgeni/docgeni/commit/f42f2ad6003dfa5ee411cf87bb3068887d0e13d2))
* **core:** update default value to property.default when it is not undefined or null [#424](https://github.com/docgeni/docgeni/issues/424) ([#463](https://github.com/docgeni/docgeni/issues/463)) ([83bd8cb](https://github.com/docgeni/docgeni/commit/83bd8cb2c0e34a154e73b594bff2f9af27ad3edc))
* **ngdoc:** should parse correct tags when has multi-language ([#459](https://github.com/docgeni/docgeni/issues/459)) ([ab8ab53](https://github.com/docgeni/docgeni/commit/ab8ab533b5c1a4924095615c36bf943a2a1c3de9))
* **template:** update homeMeta to nullable for home template ([e563102](https://github.com/docgeni/docgeni/commit/e563102a473bd4dec8f5cff555f181f9b643e22b))


### Features

* **cli:** set apiMode to automatic when ng add @docgeni/cli ([2288c3e](https://github.com/docgeni/docgeni/commit/2288c3e6a310866131692ec3f48da5e92ee05907))
* **core:** update site-template to ng 15 ([2aac8ff](https://github.com/docgeni/docgeni/commit/2aac8ff1eb974a2c572a6b281f496d31a8e345ec))
* **ngdoc:** parse heritage declarations for directives, services and class-likes #INFR-6929 ([edf7a6d](https://github.com/docgeni/docgeni/commit/edf7a6d78f10aaa53625fc4e4a66c40de97d714e)), closes [#INFR-6929](https://github.com/docgeni/docgeni/issues/INFR-6929)





# [2.1.0-next.4](https://github.com/docgeni/docgeni/compare/v2.1.0-next.2...v2.1.0-next.4) (2023-03-17)


### Bug Fixes

* update tag h1 to span for dg-doc-header avoid conflict ([3a12593](https://github.com/docgeni/docgeni/commit/3a125938c279b7f8968f88c11531f83cf0a7d997))


### Features

* **core:** custom components support standalone #INFR-6938 ([#455](https://github.com/docgeni/docgeni/issues/455)) ([721b17c](https://github.com/docgeni/docgeni/commit/721b17c06b952d1a37a70193daaafc008a8a3a0b)), closes [#INFR-6938](https://github.com/docgeni/docgeni/issues/INFR-6938)
* **core:** example support standalone component #INFR-6744 ([#450](https://github.com/docgeni/docgeni/issues/450)) ([08d517c](https://github.com/docgeni/docgeni/commit/08d517c9d04ad032d15743b0be80fe414b83139d)), closes [#INFR-6744](https://github.com/docgeni/docgeni/issues/INFR-6744)
* **ngdoc:** support interface and class api doc when mark public or publicApi ([#452](https://github.com/docgeni/docgeni/issues/452)) ([81dcaca](https://github.com/docgeni/docgeni/commit/81dcacabb20087862221bf1be1df23244bd99387))
* **template:** exports "./styles/index.css" in @docgeni/template ([83b3f99](https://github.com/docgeni/docgeni/commit/83b3f993f23f268154842defc7614c193a37ddd2))





# [2.1.0-next.3](https://github.com/docgeni/docgeni/compare/v2.1.0-next.2...v2.1.0-next.3) (2023-03-10)


### Features

* **template:** exports "./styles/index.css" in @docgeni/template ([83b3f99](https://github.com/docgeni/docgeni/commit/83b3f993f23f268154842defc7614c193a37ddd2))





# [2.1.0-next.2](https://github.com/docgeni/docgeni/compare/v2.1.0-next.1...v2.1.0-next.2) (2023-03-09)

**Note:** Version bump only for package docgeni





# [2.1.0-next.1](https://github.com/docgeni/docgeni/compare/v2.1.0-next.0...v2.1.0-next.1) (2023-03-09)


### Features

* **template:** add exports of scss in package.json ([c10a8a0](https://github.com/docgeni/docgeni/commit/c10a8a07ed46ff3378e1e3431a4ff08857539113))





# [2.1.0-next.0](https://github.com/docgeni/docgeni/compare/v2.0.1...v2.1.0-next.0) (2023-03-09)

**Note:** Version bump only for package docgeni





## [2.0.1](https://github.com/docgeni/docgeni/compare/v2.0.0...v2.0.1) (2022-11-17)


### Bug Fixes

* **core:** validate tsconfig.lib.json exists for compatible and automatic apiMode ([7651886](https://github.com/docgeni/docgeni/commit/76518860a88260d5bee5755776efc016c3c1395f))
* **ngdoc:** should convert tsConfigPath and rootDir to ts supported path for windows ([#416](https://github.com/docgeni/docgeni/issues/416)) ([f1889cf](https://github.com/docgeni/docgeni/commit/f1889cffd10b051343b951d3292492a70fa53eb3))





# [2.0.0](https://github.com/docgeni/docgeni/compare/v2.0.0-next.0...v2.0.0) (2022-11-14)

### Performance Improvements

* remove warning messages ([661f45f](https://github.com/docgeni/docgeni/commit/661f45fcb42f558c12075cd9c51c93c64ad856ae))

### Features

* **core:** generate example module support vars define providers, declarations and imports, and remove default export from module ([#400](https://github.com/docgeni/docgeni/issues/400)) ([55f2371](https://github.com/docgeni/docgeni/commit/55f237137af550e69608a5cd914a0c98d6d49e0e))
* **core:** support define module.ts in .docgeni/app folder ([#401](https://github.com/docgeni/docgeni/issues/401)) ([03e8c52](https://github.com/docgeni/docgeni/commit/03e8c526031043fe30034f3d321e001a596e2ebd))
* **core:** throw error when child_process is error exit ([87b4a82](https://github.com/docgeni/docgeni/commit/87b4a8205829fe2a86e25a56db09fea801ee95a0))
* **ngdoc:** ignore site typescript error ([5ee49ad](https://github.com/docgeni/docgeni/commit/5ee49ad8b3c2c93309ece64bd036373a19bcc8d3))
* **ngdoc:** support set [@sort](https://github.com/sort) tag for directives and services ([#395](https://github.com/docgeni/docgeni/issues/395)) ([900f04e](https://github.com/docgeni/docgeni/commit/900f04ecac303fe808a15934e9bd471d78ab036e))
* **template:** add parentheses () wrapper for name when kind is Output ([d91143d](https://github.com/docgeni/docgeni/commit/d91143d75f71c078460d4649d4d946c274259e52))
* **core:** support render all examples for overview ([#389](https://github.com/docgeni/docgeni/issues/389)) ([d61f728](https://github.com/docgeni/docgeni/commit/d61f7285f4c2a49bb8cf3114fdd89652f46b1256))
* **ngdoc:** add [@type](https://github.com/type) custom type ([b1ba6fd](https://github.com/docgeni/docgeni/commit/b1ba6fdc50f6b73bcaac1e23dd17511440de9d52))
* **template:** display aliasName first and add "#" before name for ContentChild and ContentChildren kinds ([#388](https://github.com/docgeni/docgeni/issues/388)) ([5a671b5](https://github.com/docgeni/docgeni/commit/5a671b5d8f1588666bd7b298716a3849358d45f2))
* **core:** example support background, compact and className #OSP-66 ([#386](https://github.com/docgeni/docgeni/issues/386)) ([0050190](https://github.com/docgeni/docgeni/commit/005019025458a450464f1c15d32e88f416bc0996)), closes [#OSP-66](https://github.com/docgeni/docgeni/issues/OSP-66)
* **ngdoc:** hide component and property when add private or internal and rewrite directive name for name tag ([41a15a1](https://github.com/docgeni/docgeni/commit/41a15a1ec3cc59aefd041142da4e0e249c7ce68d))
* **template:** remove cdk deps ([6d51ad0](https://github.com/docgeni/docgeni/commit/6d51ad0b4da82cd38e365130f5aea11498236416))
* **ngdoc:** update getCurrentDirectory use ts.sys.getCurrentDirectory and add debug logs ([99cbd66](https://github.com/docgeni/docgeni/commit/99cbd66b70220d3bb25d9c778ab86ce9fc4f7349))
* **core:** add debug logs for  LibraryBuilder #OSP-249 ([#338](https://github.com/docgeni/docgeni/issues/338)) ([212cb5f](https://github.com/docgeni/docgeni/commit/212cb5f008cfd6e7b3f7248ee11e7ed315c97236)), closes [#OSP-249](https://github.com/docgeni/docgeni/issues/OSP-249)
* **ngdoc:** add debug logs for ng-parser #OSP-249 ([#339](https://github.com/docgeni/docgeni/issues/339)) ([9f96b9e](https://github.com/docgeni/docgeni/commit/9f96b9e1a7f0051c10e3096c7cfcf4af86ff0bfa)), closes [#OSP-249](https://github.com/docgeni/docgeni/issues/OSP-249)
* **core:** add debug logs for  LibraryBuilder #OSP-249 ([#338](https://github.com/docgeni/docgeni/issues/338)) ([212cb5f](https://github.com/docgeni/docgeni/commit/212cb5f008cfd6e7b3f7248ee11e7ed315c97236)), closes [#OSP-249](https://github.com/docgeni/docgeni/issues/OSP-249)
* **ngdoc:** add debug logs for ng-parser #OSP-249 ([#339](https://github.com/docgeni/docgeni/issues/339)) ([9f96b9e](https://github.com/docgeni/docgeni/commit/9f96b9e1a7f0051c10e3096c7cfcf4af86ff0bfa)), closes [#OSP-249](https://github.com/docgeni/docgeni/issues/OSP-249)
* **core:** update to es2020 ([9b795c5](https://github.com/docgeni/docgeni/commit/9b795c519007ae3f2bd23180f45d0d961fc9ffd8))
* **template:** add toc to api #OSP-41 ([#300](https://github.com/docgeni/docgeni/issues/300)) ([e5c1c2a](https://github.com/docgeni/docgeni/commit/e5c1c2a5910d34eee1f7a55bd4313658890ce21c)), closes [#OSP-41](https://github.com/docgeni/docgeni/issues/OSP-41)
* support service api ([#303](https://github.com/docgeni/docgeni/issues/303)) ([37b8ef0](https://github.com/docgeni/docgeni/commit/37b8ef0aa9d47fa5492b9cea02b8e399e2f4ffd1))
* **core:** support sourceMap  Support emitDecoratorMetadata ([#304](https://github.com/docgeni/docgeni/issues/304)) ([674281c](https://github.com/docgeni/docgeni/commit/674281ceb2d9e6dd91ea994482fa87311b9933f6))
* **core:** auto generate and update examples module source #OSP-218 ([#291](https://github.com/docgeni/docgeni/issues/291)) ([5e88168](https://github.com/docgeni/docgeni/commit/5e881683adbdc89936f697c724423453a2c51f97)), closes [#OSP-218](https://github.com/docgeni/docgeni/issues/OSP-218)
* **core:** supoort default locale in docs or docs/locale ([#289](https://github.com/docgeni/docgeni/issues/289)) ([3c8fd72](https://github.com/docgeni/docgeni/commit/3c8fd72c2eb024a0929715f016f4e583f8e57d94))
* **core:** support automatic generate api docs #OSP-230 ([#294](https://github.com/docgeni/docgeni/issues/294)) ([5b428a0](https://github.com/docgeni/docgeni/commit/5b428a0f72ea63be2e100a5646a70a0fbc0ef84d)), closes [#OSP-230](https://github.com/docgeni/docgeni/issues/OSP-230)
* **core:** support custom imports and providers for custom built-in component ([#293](https://github.com/docgeni/docgeni/issues/293)) ([6aa9612](https://github.com/docgeni/docgeni/commit/6aa9612076322665f4af9db3f85cb00b936dbeb1))


### Bug Fixes

* **template:** add text-decoration for title of navbar-brand ([d5d23e1](https://github.com/docgeni/docgeni/commit/d5d23e17fe15ba9d7d1da06465e8be8580fe1f42))
* **core:** combine metadata bootstrap as long as one has a value ([1234de7](https://github.com/docgeni/docgeni/commit/1234de7cb4ed3c1ef81fa39a56c5216cca3e6e3a))
* **template:** update  justify-content: end; to flex-end ([7d0cee7](https://github.com/docgeni/docgeni/commit/7d0cee703c6ba206316b32bad2290df739ff0743))
* **template:** switch locale use Location service for scene with base-href ([#398](https://github.com/docgeni/docgeni/issues/398)) ([6fe13b5](https://github.com/docgeni/docgeni/commit/6fe13b59e1b8dd9e2b82fea3fea1a745d4f63424))
* **core:** should prevent the next build while building ([365f323](https://github.com/docgeni/docgeni/commit/365f323bed20d910d115b29f0242afbff7535ec6))
* **cli:** remove id from schema.json support ng 13 cli ([28a5554](https://github.com/docgeni/docgeni/commit/28a5554c14c57c9c7d9540bb2845f2a3a69f60ef))
* **core:** should encode headingId to fix heading contains a link [#362](https://github.com/docgeni/docgeni/issues/362) ([eebcd4d](https://github.com/docgeni/docgeni/commit/eebcd4d67153cac23c0a21ffe7f32c2baf48bd02))
* **core:** should use getSystemPath to convert path for compatible with windows system [#376](https://github.com/docgeni/docgeni/issues/376) ([#383](https://github.com/docgeni/docgeni/issues/383)) ([e2b8b25](https://github.com/docgeni/docgeni/commit/e2b8b2555392a931d6274991e11a7eb64137e499))
* **ngdoc:** should ignore watch json files [#364](https://github.com/docgeni/docgeni/issues/364) ([3bd92ab](https://github.com/docgeni/docgeni/commit/3bd92ab7799c71b7b917cbe37e88b52a36289a46))
* **cli:** add $id for schema of schematic ([efb40eb](https://github.com/docgeni/docgeni/commit/efb40eb2cc227b32d2712612147763d1ad56b44c))
* **ngdoc:** only watch resolved modules in rootDir and exclude others such as node_modules [#359](https://github.com/docgeni/docgeni/issues/359) ([#360](https://github.com/docgeni/docgeni/issues/360)) ([8669684](https://github.com/docgeni/docgeni/commit/8669684452ba898d19bd0f85e73b8a7d770779f1))
* **core:** remove progress from serve options ([a31ef90](https://github.com/docgeni/docgeni/commit/a31ef90b5f0cdcfe7feebb8b8f2e15fb1a666a04))
* **core:** add BrowserAnimationsModule to AppModule ([5356a60](https://github.com/docgeni/docgeni/commit/5356a60f2824a2ce73017e9cdeb565bec3b17dcd))
* **core:** remove progress args from serve ([#355](https://github.com/docgeni/docgeni/issues/355)) ([a2d3509](https://github.com/docgeni/docgeni/commit/a2d350922a8ce622deaed9b62e8fdfe174c5b79a))
* **core:** should ignore without exported components when generating entry module ([190a288](https://github.com/docgeni/docgeni/commit/190a288a8a6f25287eeb3be6c286f7569c5e5efb))
* **core:** getExpectExportedComponent without example name ([c3171cc](https://github.com/docgeni/docgeni/commit/c3171cc13e1af3a274d21432b89ee97ca61f77ab))
* **core:** update index.ts after change custom built-in components #OSP-242 ([a2954e7](https://github.com/docgeni/docgeni/commit/a2954e709f2c63ca06d0c354743ce964e2134152)), closes [#OSP-242](https://github.com/docgeni/docgeni/issues/OSP-242)
* **template:** get corrected doc item when component is same in multiple  libraries [#347](https://github.com/docgeni/docgeni/issues/347) ([3c9ea1a](https://github.com/docgeni/docgeni/commit/3c9ea1a245bd1589d0efd6fb1c8662169dfba7ab))
* **template:** import docsearch.css instead of docsearch.min.css ([bf3ec3d](https://github.com/docgeni/docgeni/commit/bf3ec3d0ce0f1c57dd9ba3db8457e0cd0c7c4253))
* **template:** set text-decoration as none for link in nav ([cb005b6](https://github.com/docgeni/docgeni/commit/cb005b6079d346c0d97fb79094fda0edaf59865f))
* **template:** update outline button styles for launch action ([eb0b593](https://github.com/docgeni/docgeni/commit/eb0b593c60f52472966605b58160869189f5fc7c))
* **template:** use navigateByUrl when click search result item path is inernal route #OSP-253 [#350](https://github.com/docgeni/docgeni/issues/350) ([152e6f7](https://github.com/docgeni/docgeni/commit/152e6f7b8bfd81ede1b3d70041b62b13902cebea)), closes [#OSP-253](https://github.com/docgeni/docgeni/issues/OSP-253)
* **core:** should not build example when entry component file is not exists #OSP-251 ([0e3cb83](https://github.com/docgeni/docgeni/commit/0e3cb83ba98525d540dd4a1ab78ec8a5a8532e60)), closes [#OSP-251](https://github.com/docgeni/docgeni/issues/OSP-251)
* **template:** update word-break to break-all for toc link and table label #OSP-252 ([8ed816c](https://github.com/docgeni/docgeni/commit/8ed816cabc2f196c6fa290d5f24acb1d4f003596)), closes [#OSP-252](https://github.com/docgeni/docgeni/issues/OSP-252)
* **ngdoc:** use useCaseSensitiveFileNames to normalize filePath ([c0ea534](https://github.com/docgeni/docgeni/commit/c0ea534332b70a06eaa1ee79b10e06122bbe7d87))
* **core:** remove extractCss from angular.json ([#337](https://github.com/docgeni/docgeni/issues/337)) ([94773ff](https://github.com/docgeni/docgeni/commit/94773ff9c15f65a283155a76a622675c859d88e5))
* **core:** should get correct source file for node_modules types #OSP-244 ([1f84bcc](https://github.com/docgeni/docgeni/commit/1f84bcc5befb3d45bed9e070dbeed48cd1400465)), closes [#OSP-244](https://github.com/docgeni/docgeni/issues/OSP-244)
* **template:** set search container width and font-size ([a8364c9](https://github.com/docgeni/docgeni/commit/a8364c9c7366f5670799acd1f884314bc42384b1))
* **core:** should generate correct output path for docs [#295](https://github.com/docgeni/docgeni/issues/295) ([#298](https://github.com/docgeni/docgeni/issues/298)) ([5e18a3a](https://github.com/docgeni/docgeni/commit/5e18a3abedc916a492b26f3cccbca5f99fe23596))
* **core:** should transform to real abs path for cosmiconfig search #OSP-239 ([#299](https://github.com/docgeni/docgeni/issues/299)) ([fea46c8](https://github.com/docgeni/docgeni/commit/fea46c8896e8bda0db189754de21dbe671cf9521)), closes [#OSP-239](https://github.com/docgeni/docgeni/issues/OSP-239)
* **template:** remove space from name of content-renderer ([abd804d](https://github.com/docgeni/docgeni/commit/abd804d87ad1af029014c39668932db863f6dbe8))
* **core:** fix error when has't modult.ts ([cbbddf6](https://github.com/docgeni/docgeni/commit/cbbddf63917aa8b12517d6f3747dc115096ad09c))
* **core:** should generate stackblize bundle.json for examples when custom site project ([#290](https://github.com/docgeni/docgeni/issues/290)) ([bcf79b8](https://github.com/docgeni/docgeni/commit/bcf79b8acff515086ea7a41901a3b615282a9098))
* **template:** improve api display for empty properties and spacing ([801a0db](https://github.com/docgeni/docgeni/commit/801a0dbcc3ed67d3daad60e73530fd940eee8d88))
* horizontal line top of footer do not overlap when doc meta is empty ([6d75e03](https://github.com/docgeni/docgeni/commit/6d75e03abb0a94b27720127ccbaa091c78a44236))
* **alib:** rename a-lib to @docgeni/alib and publish to npm ([317211c](https://github.com/docgeni/docgeni/commit/317211c3f6ec33fb0fd90162d2d650c5696c924b))
* **core:** regenerate examples source bundle file when emit and refactor somethings #OSP-223 ([5d0e2bc](https://github.com/docgeni/docgeni/commit/5d0e2bc3ecd1925f56fb283f551399e00bab8836)), closes [#OSP-223](https://github.com/docgeni/docgeni/issues/OSP-223)
* **core:** should generate navs success when there are no locale docs folder that configured  in locales #OSP-211 ([#268](https://github.com/docgeni/docgeni/issues/268)) ([697a366](https://github.com/docgeni/docgeni/commit/697a366574d9f28f975675dc365f23f11ff13e2f)), closes [#OSP-211](https://github.com/docgeni/docgeni/issues/OSP-211)
* **template:** add @angular/cdk to dependencies of template and move @angular-devkit/schematics to cli ([#267](https://github.com/docgeni/docgeni/issues/267)) ([c136a0f](https://github.com/docgeni/docgeni/commit/c136a0fa1aa05942c8f3cc0a13ee99304ac36e13))
* **template:** fix import docsearch error ([#274](https://github.com/docgeni/docgeni/issues/274)) ([9492006](https://github.com/docgeni/docgeni/commit/9492006cfe1636477289bfa75c6ca55803e13c24))




# [2.0.0-next.0](https://github.com/docgeni/docgeni/compare/v1.2.0-next.27...v2.0.0-next.0) (2022-11-14)


### Bug Fixes

* **template:** add text-decoration for title of navbar-brand ([d5d23e1](https://github.com/docgeni/docgeni/commit/d5d23e17fe15ba9d7d1da06465e8be8580fe1f42))





# [1.2.0-next.27](https://github.com/docgeni/docgeni/compare/v1.2.0-next.26...v1.2.0-next.27) (2022-11-02)


### Bug Fixes

* **core:** combine metadata bootstrap as long as one has a value ([1234de7](https://github.com/docgeni/docgeni/commit/1234de7cb4ed3c1ef81fa39a56c5216cca3e6e3a))


### Performance Improvements

* remove warning messages ([661f45f](https://github.com/docgeni/docgeni/commit/661f45fcb42f558c12075cd9c51c93c64ad856ae))





# [1.2.0-next.26](https://github.com/docgeni/docgeni/compare/v1.2.0-next.25...v1.2.0-next.26) (2022-11-02)


### Bug Fixes

* **template:** update  justify-content: end; to flex-end ([7d0cee7](https://github.com/docgeni/docgeni/commit/7d0cee703c6ba206316b32bad2290df739ff0743))


### Features

* **core:** generate example module support vars define providers, declarations and imports, and remove default export from module ([#400](https://github.com/docgeni/docgeni/issues/400)) ([55f2371](https://github.com/docgeni/docgeni/commit/55f237137af550e69608a5cd914a0c98d6d49e0e))
* **core:** support define module.ts in .docgeni/app folder ([#401](https://github.com/docgeni/docgeni/issues/401)) ([03e8c52](https://github.com/docgeni/docgeni/commit/03e8c526031043fe30034f3d321e001a596e2ebd))





# [1.2.0-next.25](https://github.com/docgeni/docgeni/compare/v1.2.0-next.24...v1.2.0-next.25) (2022-09-22)


### Bug Fixes

* **template:** switch locale use Location service for scene with base-href ([#398](https://github.com/docgeni/docgeni/issues/398)) ([6fe13b5](https://github.com/docgeni/docgeni/commit/6fe13b59e1b8dd9e2b82fea3fea1a745d4f63424))





# [1.2.0-next.24](https://github.com/docgeni/docgeni/compare/v1.2.0-next.23...v1.2.0-next.24) (2022-09-05)


### Bug Fixes

* **core:** should prevent the next build while building ([365f323](https://github.com/docgeni/docgeni/commit/365f323bed20d910d115b29f0242afbff7535ec6))


### Features

* **core:** throw error when child_process is error exit ([87b4a82](https://github.com/docgeni/docgeni/commit/87b4a8205829fe2a86e25a56db09fea801ee95a0))
* **ngdoc:** ignore site typescript error ([5ee49ad](https://github.com/docgeni/docgeni/commit/5ee49ad8b3c2c93309ece64bd036373a19bcc8d3))
* **ngdoc:** support set [@sort](https://github.com/sort) tag for directives and services ([#395](https://github.com/docgeni/docgeni/issues/395)) ([900f04e](https://github.com/docgeni/docgeni/commit/900f04ecac303fe808a15934e9bd471d78ab036e))
* **template:** add parentheses () wrapper for name when kind is Output ([d91143d](https://github.com/docgeni/docgeni/commit/d91143d75f71c078460d4649d4d946c274259e52))





# [1.2.0-next.23](https://github.com/docgeni/docgeni/compare/v1.2.0-next.22...v1.2.0-next.23) (2022-08-17)


### Features

* **core:** support render all examples for overview ([#389](https://github.com/docgeni/docgeni/issues/389)) ([d61f728](https://github.com/docgeni/docgeni/commit/d61f7285f4c2a49bb8cf3114fdd89652f46b1256))





# [1.2.0-next.22](https://github.com/docgeni/docgeni/compare/v1.2.0-next.21...v1.2.0-next.22) (2022-08-10)

**Note:** Version bump only for package docgeni





# [1.2.0-next.21](https://github.com/docgeni/docgeni/compare/v1.2.0-next.20...v1.2.0-next.21) (2022-08-09)

**Note:** Version bump only for package docgeni





# [1.2.0-next.20](https://github.com/docgeni/docgeni/compare/v1.2.0-next.19...v1.2.0-next.20) (2022-08-05)


### Features

* **ngdoc:** add [@type](https://github.com/type) custom type ([b1ba6fd](https://github.com/docgeni/docgeni/commit/b1ba6fdc50f6b73bcaac1e23dd17511440de9d52))
* **template:** display aliasName first and add "#" before name for ContentChild and ContentChildren kinds ([#388](https://github.com/docgeni/docgeni/issues/388)) ([5a671b5](https://github.com/docgeni/docgeni/commit/5a671b5d8f1588666bd7b298716a3849358d45f2))





# [1.2.0-next.19](https://github.com/docgeni/docgeni/compare/v1.2.0-next.18...v1.2.0-next.19) (2022-08-01)


### Bug Fixes

* **cli:** remove id from schema.json support ng 13 cli ([28a5554](https://github.com/docgeni/docgeni/commit/28a5554c14c57c9c7d9540bb2845f2a3a69f60ef))
* **core:** should encode headingId to fix heading contains a link [#362](https://github.com/docgeni/docgeni/issues/362) ([eebcd4d](https://github.com/docgeni/docgeni/commit/eebcd4d67153cac23c0a21ffe7f32c2baf48bd02))
* **core:** should use getSystemPath to convert path for compatible with windows system [#376](https://github.com/docgeni/docgeni/issues/376) ([#383](https://github.com/docgeni/docgeni/issues/383)) ([e2b8b25](https://github.com/docgeni/docgeni/commit/e2b8b2555392a931d6274991e11a7eb64137e499))
* **ngdoc:** should ignore watch json files [#364](https://github.com/docgeni/docgeni/issues/364) ([3bd92ab](https://github.com/docgeni/docgeni/commit/3bd92ab7799c71b7b917cbe37e88b52a36289a46))


### Features

* **core:** example support background, compact and className #OSP-66 ([#386](https://github.com/docgeni/docgeni/issues/386)) ([0050190](https://github.com/docgeni/docgeni/commit/005019025458a450464f1c15d32e88f416bc0996)), closes [#OSP-66](https://github.com/docgeni/docgeni/issues/OSP-66)
* **ngdoc:** hide component and property when add private or internal and rewrite directive name for name tag ([41a15a1](https://github.com/docgeni/docgeni/commit/41a15a1ec3cc59aefd041142da4e0e249c7ce68d))





# [1.2.0-next.18](https://github.com/docgeni/docgeni/compare/v1.2.0-next.17...v1.2.0-next.18) (2022-07-28)


### Features

* **template:** remove cdk deps ([6d51ad0](https://github.com/docgeni/docgeni/commit/6d51ad0b4da82cd38e365130f5aea11498236416))





# [1.2.0-next.17](https://github.com/docgeni/docgeni/compare/v1.2.0-next.15...v1.2.0-next.17) (2022-07-27)


### Bug Fixes

* **cli:** add $id for schema of schematic ([efb40eb](https://github.com/docgeni/docgeni/commit/efb40eb2cc227b32d2712612147763d1ad56b44c))





# [1.2.0-next.15](https://github.com/docgeni/docgeni/compare/v1.2.0-next.14...v1.2.0-next.15) (2022-07-27)

**Note:** Version bump only for package docgeni





# [1.2.0-next.14](https://github.com/docgeni/docgeni/compare/v1.2.0-next.13...v1.2.0-next.14) (2022-05-05)


### Bug Fixes

* **ngdoc:** only watch resolved modules in rootDir and exclude others such as node_modules [#359](https://github.com/docgeni/docgeni/issues/359) ([#360](https://github.com/docgeni/docgeni/issues/360)) ([8669684](https://github.com/docgeni/docgeni/commit/8669684452ba898d19bd0f85e73b8a7d770779f1))





# [1.2.0-next.13](https://github.com/docgeni/docgeni/compare/v1.2.0-next.12...v1.2.0-next.13) (2022-04-25)


### Bug Fixes

* **core:** remove progress from serve options ([a31ef90](https://github.com/docgeni/docgeni/commit/a31ef90b5f0cdcfe7feebb8b8f2e15fb1a666a04))





# [1.2.0-next.12](https://github.com/docgeni/docgeni/compare/v1.2.0-next.11...v1.2.0-next.12) (2022-04-25)


### Bug Fixes

* **core:** add BrowserAnimationsModule to AppModule ([5356a60](https://github.com/docgeni/docgeni/commit/5356a60f2824a2ce73017e9cdeb565bec3b17dcd))
* **core:** remove progress args from serve ([#355](https://github.com/docgeni/docgeni/issues/355)) ([a2d3509](https://github.com/docgeni/docgeni/commit/a2d350922a8ce622deaed9b62e8fdfe174c5b79a))
* **core:** should ignore without exported components when generating entry module ([190a288](https://github.com/docgeni/docgeni/commit/190a288a8a6f25287eeb3be6c286f7569c5e5efb))





# [1.2.0-next.11](https://github.com/docgeni/docgeni/compare/v1.2.0-next.10...v1.2.0-next.11) (2022-04-24)


### Bug Fixes

* **core:** getExpectExportedComponent without example name ([c3171cc](https://github.com/docgeni/docgeni/commit/c3171cc13e1af3a274d21432b89ee97ca61f77ab))
* **core:** update index.ts after change custom built-in components #OSP-242 ([a2954e7](https://github.com/docgeni/docgeni/commit/a2954e709f2c63ca06d0c354743ce964e2134152)), closes [#OSP-242](https://github.com/docgeni/docgeni/issues/OSP-242)
* **template:** get corrected doc item when component is same in multiple  libraries [#347](https://github.com/docgeni/docgeni/issues/347) ([3c9ea1a](https://github.com/docgeni/docgeni/commit/3c9ea1a245bd1589d0efd6fb1c8662169dfba7ab))
* **template:** import docsearch.css instead of docsearch.min.css ([bf3ec3d](https://github.com/docgeni/docgeni/commit/bf3ec3d0ce0f1c57dd9ba3db8457e0cd0c7c4253))
* **template:** set text-decoration as none for link in nav ([cb005b6](https://github.com/docgeni/docgeni/commit/cb005b6079d346c0d97fb79094fda0edaf59865f))
* **template:** update outline button styles for launch action ([eb0b593](https://github.com/docgeni/docgeni/commit/eb0b593c60f52472966605b58160869189f5fc7c))
* **template:** use navigateByUrl when click search result item path is inernal route #OSP-253 [#350](https://github.com/docgeni/docgeni/issues/350) ([152e6f7](https://github.com/docgeni/docgeni/commit/152e6f7b8bfd81ede1b3d70041b62b13902cebea)), closes [#OSP-253](https://github.com/docgeni/docgeni/issues/OSP-253)





# [1.2.0-next.10](https://github.com/docgeni/docgeni/compare/v1.2.0-next.9...v1.2.0-next.10) (2022-03-10)


### Bug Fixes

* **core:** should not build example when entry component file is not exists #OSP-251 ([0e3cb83](https://github.com/docgeni/docgeni/commit/0e3cb83ba98525d540dd4a1ab78ec8a5a8532e60)), closes [#OSP-251](https://github.com/docgeni/docgeni/issues/OSP-251)
* **template:** update word-break to break-all for toc link and table label #OSP-252 ([8ed816c](https://github.com/docgeni/docgeni/commit/8ed816cabc2f196c6fa290d5f24acb1d4f003596)), closes [#OSP-252](https://github.com/docgeni/docgeni/issues/OSP-252)





# [1.2.0-next.9](https://github.com/docgeni/docgeni/compare/v1.2.0-next.8...v1.2.0-next.9) (2022-03-08)


### Bug Fixes

* **ngdoc:** use useCaseSensitiveFileNames to normalize filePath ([c0ea534](https://github.com/docgeni/docgeni/commit/c0ea534332b70a06eaa1ee79b10e06122bbe7d87))





# [1.2.0-next.8](https://github.com/docgeni/docgeni/compare/v1.2.0-next.7...v1.2.0-next.8) (2022-03-08)


### Features

* **ngdoc:** update getCurrentDirectory use ts.sys.getCurrentDirectory and add debug logs ([99cbd66](https://github.com/docgeni/docgeni/commit/99cbd66b70220d3bb25d9c778ab86ce9fc4f7349))





# [1.2.0-next.7](https://github.com/docgeni/docgeni/compare/v1.2.0-next.5...v1.2.0-next.7) (2022-03-08)


### Features

* **core:** add debug logs for  LibraryBuilder #OSP-249 ([#338](https://github.com/docgeni/docgeni/issues/338)) ([212cb5f](https://github.com/docgeni/docgeni/commit/212cb5f008cfd6e7b3f7248ee11e7ed315c97236)), closes [#OSP-249](https://github.com/docgeni/docgeni/issues/OSP-249)
* **ngdoc:** add debug logs for ng-parser #OSP-249 ([#339](https://github.com/docgeni/docgeni/issues/339)) ([9f96b9e](https://github.com/docgeni/docgeni/commit/9f96b9e1a7f0051c10e3096c7cfcf4af86ff0bfa)), closes [#OSP-249](https://github.com/docgeni/docgeni/issues/OSP-249)





# [1.2.0-next.6](https://github.com/docgeni/docgeni/compare/v1.2.0-next.5...v1.2.0-next.6) (2022-03-08)


### Features

* **core:** add debug logs for  LibraryBuilder #OSP-249 ([#338](https://github.com/docgeni/docgeni/issues/338)) ([212cb5f](https://github.com/docgeni/docgeni/commit/212cb5f008cfd6e7b3f7248ee11e7ed315c97236)), closes [#OSP-249](https://github.com/docgeni/docgeni/issues/OSP-249)
* **ngdoc:** add debug logs for ng-parser #OSP-249 ([#339](https://github.com/docgeni/docgeni/issues/339)) ([9f96b9e](https://github.com/docgeni/docgeni/commit/9f96b9e1a7f0051c10e3096c7cfcf4af86ff0bfa)), closes [#OSP-249](https://github.com/docgeni/docgeni/issues/OSP-249)





# [1.2.0-next.5](https://github.com/docgeni/docgeni/compare/v1.2.0-next.4...v1.2.0-next.5) (2022-03-08)


### Bug Fixes

* **core:** remove extractCss from angular.json ([#337](https://github.com/docgeni/docgeni/issues/337)) ([94773ff](https://github.com/docgeni/docgeni/commit/94773ff9c15f65a283155a76a622675c859d88e5))
* **core:** should get correct source file for node_modules types #OSP-244 ([1f84bcc](https://github.com/docgeni/docgeni/commit/1f84bcc5befb3d45bed9e070dbeed48cd1400465)), closes [#OSP-244](https://github.com/docgeni/docgeni/issues/OSP-244)
* **template:** set search container width and font-size ([a8364c9](https://github.com/docgeni/docgeni/commit/a8364c9c7366f5670799acd1f884314bc42384b1))


### Features

* **core:** update to es2020 ([9b795c5](https://github.com/docgeni/docgeni/commit/9b795c519007ae3f2bd23180f45d0d961fc9ffd8))
* **template:** add toc to api #OSP-41 ([#300](https://github.com/docgeni/docgeni/issues/300)) ([e5c1c2a](https://github.com/docgeni/docgeni/commit/e5c1c2a5910d34eee1f7a55bd4313658890ce21c)), closes [#OSP-41](https://github.com/docgeni/docgeni/issues/OSP-41)
* support service api ([#303](https://github.com/docgeni/docgeni/issues/303)) ([37b8ef0](https://github.com/docgeni/docgeni/commit/37b8ef0aa9d47fa5492b9cea02b8e399e2f4ffd1))
* **core:** support sourceMap  Support emitDecoratorMetadata ([#304](https://github.com/docgeni/docgeni/issues/304)) ([674281c](https://github.com/docgeni/docgeni/commit/674281ceb2d9e6dd91ea994482fa87311b9933f6))





# [1.2.0-next.4](https://github.com/docgeni/docgeni/compare/v1.2.0-next.3...v1.2.0-next.4) (2021-12-20)


### Bug Fixes

* **core:** should generate correct output path for docs [#295](https://github.com/docgeni/docgeni/issues/295) ([#298](https://github.com/docgeni/docgeni/issues/298)) ([5e18a3a](https://github.com/docgeni/docgeni/commit/5e18a3abedc916a492b26f3cccbca5f99fe23596))
* **core:** should transform to real abs path for cosmiconfig search #OSP-239 ([#299](https://github.com/docgeni/docgeni/issues/299)) ([fea46c8](https://github.com/docgeni/docgeni/commit/fea46c8896e8bda0db189754de21dbe671cf9521)), closes [#OSP-239](https://github.com/docgeni/docgeni/issues/OSP-239)
* **template:** remove space from name of content-renderer ([abd804d](https://github.com/docgeni/docgeni/commit/abd804d87ad1af029014c39668932db863f6dbe8))





# [1.2.0-next.3](https://github.com/docgeni/docgeni/compare/v1.2.0-next.2...v1.2.0-next.3) (2021-12-17)


### Bug Fixes

* **core:** fix error when has't modult.ts ([cbbddf6](https://github.com/docgeni/docgeni/commit/cbbddf63917aa8b12517d6f3747dc115096ad09c))
* **core:** should generate stackblize bundle.json for examples when custom site project ([#290](https://github.com/docgeni/docgeni/issues/290)) ([bcf79b8](https://github.com/docgeni/docgeni/commit/bcf79b8acff515086ea7a41901a3b615282a9098))
* **template:** improve api display for empty properties and spacing ([801a0db](https://github.com/docgeni/docgeni/commit/801a0dbcc3ed67d3daad60e73530fd940eee8d88))


### Features

* **core:** auto generate and update examples module source #OSP-218 ([#291](https://github.com/docgeni/docgeni/issues/291)) ([5e88168](https://github.com/docgeni/docgeni/commit/5e881683adbdc89936f697c724423453a2c51f97)), closes [#OSP-218](https://github.com/docgeni/docgeni/issues/OSP-218)
* **core:** supoort default locale in docs or docs/locale ([#289](https://github.com/docgeni/docgeni/issues/289)) ([3c8fd72](https://github.com/docgeni/docgeni/commit/3c8fd72c2eb024a0929715f016f4e583f8e57d94))
* **core:** support automatic generate api docs #OSP-230 ([#294](https://github.com/docgeni/docgeni/issues/294)) ([5b428a0](https://github.com/docgeni/docgeni/commit/5b428a0f72ea63be2e100a5646a70a0fbc0ef84d)), closes [#OSP-230](https://github.com/docgeni/docgeni/issues/OSP-230)
* **core:** support custom imports and providers for custom built-in component ([#293](https://github.com/docgeni/docgeni/issues/293)) ([6aa9612](https://github.com/docgeni/docgeni/commit/6aa9612076322665f4af9db3f85cb00b936dbeb1))





# [1.2.0-next.2](https://github.com/docgeni/docgeni/compare/v1.2.0-next.1...v1.2.0-next.2) (2021-11-17)

**Note:** Version bump only for package docgeni





# [1.2.0-next.1](https://github.com/docgeni/docgeni/compare/v1.2.0-next.0...v1.2.0-next.1) (2021-11-16)

**Note:** Version bump only for package docgeni





# [1.2.0-next.0](https://github.com/docgeni/docgeni/compare/v1.1.4...v1.2.0-next.0) (2021-11-16)


### Bug Fixes

* horizontal line top of footer do not overlap when doc meta is empty ([6d75e03](https://github.com/docgeni/docgeni/commit/6d75e03abb0a94b27720127ccbaa091c78a44236))
* **alib:** rename a-lib to @docgeni/alib and publish to npm ([317211c](https://github.com/docgeni/docgeni/commit/317211c3f6ec33fb0fd90162d2d650c5696c924b))
* **core:** regenerate examples source bundle file when emit and refactor somethings #OSP-223 ([5d0e2bc](https://github.com/docgeni/docgeni/commit/5d0e2bc3ecd1925f56fb283f551399e00bab8836)), closes [#OSP-223](https://github.com/docgeni/docgeni/issues/OSP-223)
* **core:** should generate navs success when there are no locale docs folder that configured  in locales #OSP-211 ([#268](https://github.com/docgeni/docgeni/issues/268)) ([697a366](https://github.com/docgeni/docgeni/commit/697a366574d9f28f975675dc365f23f11ff13e2f)), closes [#OSP-211](https://github.com/docgeni/docgeni/issues/OSP-211)
* **template:** add @angular/cdk to dependencies of template and move @angular-devkit/schematics to cli ([#267](https://github.com/docgeni/docgeni/issues/267)) ([c136a0f](https://github.com/docgeni/docgeni/commit/c136a0fa1aa05942c8f3cc0a13ee99304ac36e13))
* **template:** fix import docsearch error ([#274](https://github.com/docgeni/docgeni/issues/274)) ([9492006](https://github.com/docgeni/docgeni/commit/9492006cfe1636477289bfa75c6ca55803e13c24))


### Features

* **cli:** ng-add schematics add `@docgei/angular` dependency ([eca5b5b](https://github.com/docgeni/docgeni/commit/eca5b5b1fc83fd9267f5aec0e8ac8331e652edd0))
* **core:** generate sitemap by config #OSP-192 ([#263](https://github.com/docgeni/docgeni/issues/263)) ([9ec9300](https://github.com/docgeni/docgeni/commit/9ec930020d534b2c9a30682a7db03076ff973d73)), closes [#OSP-192](https://github.com/docgeni/docgeni/issues/OSP-192) [#OSP-192](https://github.com/docgeni/docgeni/issues/OSP-192)
* **core:** support config favicon.ico ([#282](https://github.com/docgeni/docgeni/issues/282)) ([72c9b11](https://github.com/docgeni/docgeni/commit/72c9b11ac105997206e3311d65f0b1119f6e9b83))
* **core:** use define name in lib example component to generate entry file #OSP-167 ([#288](https://github.com/docgeni/docgeni/issues/288)) ([61de9b8](https://github.com/docgeni/docgeni/commit/61de9b8884bfd18393d488f93f6fb55361877e0a)), closes [#OSP-167](https://github.com/docgeni/docgeni/issues/OSP-167)
* **ngdoc:** add @docgeni/ngdoc and init structure #OSP-226 ([#284](https://github.com/docgeni/docgeni/issues/284)) ([0fbc3c5](https://github.com/docgeni/docgeni/commit/0fbc3c5f4715c799c822faacd0328e065965361a)), closes [#OSP-226](https://github.com/docgeni/docgeni/issues/OSP-226)
* **ngdoc:** add getExportsComponents for NgDocParser and refactor ngdoc #OSP-231 ([1af561b](https://github.com/docgeni/docgeni/commit/1af561b882ff4294bc96dc80b947056a2dd5e4ae)), closes [#OSP-231](https://github.com/docgeni/docgeni/issues/OSP-231)
* add serve/build config `configuration` ([#283](https://github.com/docgeni/docgeni/issues/283)) ([80b210e](https://github.com/docgeni/docgeni/commit/80b210e392d00a1861818bb44bd7c5a1fc5db7d2))
* example support stackblitz ([#276](https://github.com/docgeni/docgeni/issues/276)) ([9fe6a9c](https://github.com/docgeni/docgeni/commit/9fe6a9cec86dadce6bd7a472bffa709f5c8831ef))
* **template:** add builtins search #OSP-202 ([#271](https://github.com/docgeni/docgeni/issues/271)) ([caf7724](https://github.com/docgeni/docgeni/commit/caf7724a098879fb15e79f2effa8db55858d4a89)), closes [#OSP-202](https://github.com/docgeni/docgeni/issues/OSP-202) [#OSP-202](https://github.com/docgeni/docgeni/issues/OSP-202)





## [1.1.4](https://github.com/docgeni/docgeni/compare/v1.1.3...v1.1.4) (2021-10-18)


### Bug Fixes

* **cli:** add "@schematics/angular" to dependencies ([2574537](https://github.com/docgeni/docgeni/commit/2574537800571cf0b6ac620db225eac7a52aa5ea))
* **core:** remove default value / for base-href #OSP-210 ([142c349](https://github.com/docgeni/docgeni/commit/142c3493930165e8192c1938f5df4e446fa5d04f)), closes [#OSP-210](https://github.com/docgeni/docgeni/issues/OSP-210)





## [1.1.3](https://github.com/docgeni/docgeni/compare/v1.1.2...v1.1.3) (2021-10-18)


### Bug Fixes

* **core:** add ansi-colors to dependencies of core #OSP-209 ([9cd9e72](https://github.com/docgeni/docgeni/commit/9cd9e72d4391e5c401aa0311f6f4d443e1f8fff5)), closes [#OSP-209](https://github.com/docgeni/docgeni/issues/OSP-209)
* init command generate gitignore ([2251649](https://github.com/docgeni/docgeni/commit/225164919c951ec361a2a2236446e32dd3d4359a))
* **template:** add docsearch.js dependent to @docgeni/template #OSP-205 ([c2bfc66](https://github.com/docgeni/docgeni/commit/c2bfc66159cfb38443acecaae7ab6408b3bd9cf6)), closes [#OSP-205](https://github.com/docgeni/docgeni/issues/OSP-205)





## [1.1.2](https://github.com/docgeni/docgeni/compare/v1.1.1...v1.1.2) (2021-10-15)


### Features

* **cli:** remove angular dependencies from cli #OSP-203 ([9144978](https://github.com/docgeni/docgeni/commit/914497895befb1b4ed4c3c81996024b61f0a1e83)), closes [#OSP-203](https://github.com/docgeni/docgeni/issues/OSP-203)





## [1.1.1](https://github.com/docgeni/docgeni/compare/v1.1.0...v1.1.1) (2021-10-14)


### Bug Fixes

* doc-meta not change ([cad3946](https://github.com/docgeni/docgeni/commit/cad39465fc785be2f35cd0236cc7a7b209201849))
* should display home meta when content is empty ([#255](https://github.com/docgeni/docgeni/issues/255)) ([ce92350](https://github.com/docgeni/docgeni/commit/ce92350ea090ad8ffdd5e100ba5fc5c527cdd9d2))
* **template:** move load built-in components to module constructor and invoke cdr.markForCheck #OSP-200 ([92380fb](https://github.com/docgeni/docgeni/commit/92380fb83625329686d2f7c6d568c9aa1a5f4c15)), closes [#OSP-200](https://github.com/docgeni/docgeni/issues/OSP-200)


### Features

* **template:** search docs support algolia #OSP-5 ([#239](https://github.com/docgeni/docgeni/issues/239)) ([79a2912](https://github.com/docgeni/docgeni/commit/79a291232879b85b578cc3fa48802e79507ed073)), closes [#OSP-5](https://github.com/docgeni/docgeni/issues/OSP-5) [#OSP-5](https://github.com/docgeni/docgeni/issues/OSP-5) [#OSP-5](https://github.com/docgeni/docgeni/issues/OSP-5)





# [1.1.0](https://github.com/docgeni/docgeni/compare/v1.1.0-next.9...v1.1.0) (2021-09-30)

### Features
* **template:** sidebar category support expand and collapse([#244](https://github.com/docgeni/docgeni/issues/244)) ([3538670](https://github.com/docgeni/docgeni/commit/35386705e562761c99494598655d3e2a40dcdc2c))
* **core:** embed support line select ([#238](https://github.com/docgeni/docgeni/issues/238)) ([fdfc34f](https://github.com/docgeni/docgeni/commit/fdfc34f0801caebc8c6f99250e123f7f27ee19fb))
* **template:** add switch locale by url as /zh-cn/xxx #OSP-86 ([#245](https://github.com/docgeni/docgeni/issues/245)) ([2a0e80c](https://github.com/docgeni/docgeni/commit/2a0e80c4aa5bd041cd0a533fdd721c7f6a243be3)), closes [#OSP-86](https://github.com/docgeni/docgeni/issues/OSP-86)
* **template:** support content, menu and hidden toc config for doc ([#240](https://github.com/docgeni/docgeni/issues/240)) ([61442ad](https://github.com/docgeni/docgeni/commit/61442ade839b6fe8cd14ff0db7b569414e2840f9))
* **core:** add tty progress and compilation feature #OSP-163 ([#232](https://github.com/docgeni/docgeni/issues/232)) ([f635042](https://github.com/docgeni/docgeni/commit/f63504243cafb435117687e2708ed826addbe852)), closes [#OSP-163](https://github.com/docgeni/docgeni/issues/OSP-163)
* **template:** add page links for pre and next page ([f06a04c](https://github.com/docgeni/docgeni/commit/f06a04c9dc3caebc978e615f0cd7b4457e938712))
* **template:** doc-meta contributor add title ([8dcb876](https://github.com/docgeni/docgeni/commit/8dcb876afe4c26f7641114909451540a84ac76dc))
* **core:** add tty progress and compilation feature #OSP-163 ([#232](https://github.com/docgeni/docgeni/issues/232)) ([f635042](https://github.com/docgeni/docgeni/commit/f63504243cafb435117687e2708ed826addbe852)), closes [#OSP-163](https://github.com/docgeni/docgeni/issues/OSP-163)
* **template:** add page links for pre and next page ([f06a04c](https://github.com/docgeni/docgeni/commit/f06a04c9dc3caebc978e615f0cd7b4457e938712))
* **template:** doc-meta contributor add title ([8dcb876](https://github.com/docgeni/docgeni/commit/8dcb876afe4c26f7641114909451540a84ac76dc))
* **core:** add tty progress and compilation feature #OSP-163 ([#232](https://github.com/docgeni/docgeni/issues/232)) ([f635042](https://github.com/docgeni/docgeni/commit/f63504243cafb435117687e2708ed826addbe852)), closes [#OSP-163](https://github.com/docgeni/docgeni/issues/OSP-163)
* **template:** add page links for pre and next page ([f06a04c](https://github.com/docgeni/docgeni/commit/f06a04c9dc3caebc978e615f0cd7b4457e938712))
* **template:** doc-meta contributor add title ([8dcb876](https://github.com/docgeni/docgeni/commit/8dcb876afe4c26f7641114909451540a84ac76dc))
* **core:** add doc-contribution ([#212](https://github.com/docgeni/docgeni/issues/212)) ([7f53eb5](https://github.com/docgeni/docgeni/commit/7f53eb5492caf61ab761bd0ffa97f50aba56225f))
* **template:** add source-code , copy components and refactor example-viewer use source-code and copy #OSP-181 ([#220](https://github.com/docgeni/docgeni/issues/220)) ([9b5ded4](https://github.com/docgeni/docgeni/commit/9b5ded402c0f7fe5d2b428cd8b5fb0ffe6b4dd6a)), closes [#OSP-181](https://github.com/docgeni/docgeni/issues/OSP-181)
* **template:** footer support custom ([#222](https://github.com/docgeni/docgeni/issues/222)) ([652a8b1](https://github.com/docgeni/docgeni/commit/652a8b1bac748a66cd8f2430505ced8aa7cbad93))
* **template:** support open isolated example #OSP-162 ([a700170](https://github.com/docgeni/docgeni/commit/a7001708d4b259fd1f1258a5b6d1fe38aa6d41f9)), closes [#OSP-162](https://github.com/docgeni/docgeni/issues/OSP-162)
* **template:** update dg-copy default color to $dg-gray-500, hover change to primary ([f33117d](https://github.com/docgeni/docgeni/commit/f33117dbbf3805b0b66af75a43b0f8520a382081))
* **template:**  add built-in component embed ([517206](https://github.com/docgeni/docgeni/commit/5172061990c3344dd99dcd6ea3b49af2c4e43903))
* **template:**  add built-in alert ([5454d4c](https://github.com/docgeni/docgeni/commit/5454d4ce1444caa59280b46261d3b8f7371cb9f1))
* **core:**  add custom components feature ([77c827e](https://github.com/docgeni/docgeni/commit/77c827e2992495669fbcd8b4640f8ffdf0c5030e))
* **template:** feat(template): add built-in component infrastructure and render them by content-viewer ([3e874e9](https://github.com/docgeni/docgeni/commit/3e874e96228ecebd285df0e627caad6c434147de))
* **core:** add label for component  ([1ecfbae](https://github.com/docgeni/docgeni/commit/1ecfbae90499927700c3131f4ebea74c664d08cb))
* **template:** support home page ([e2051f6](https://github.com/docgeni/docgeni/commit/e2051f6f155e7ed0447a927d64c9684f30ecc43c))



### Bug Fixes

* **core:** add ng command args prod and port ([#252](https://github.com/docgeni/docgeni/issues/252)) ([840bffc](https://github.com/docgeni/docgeni/commit/840bffc1f727fcc6cc03ff9c13527e962f7afecd))
* **template:** add originPath for component doc and display doc-meta only for available doc ([3ee26e2](https://github.com/docgeni/docgeni/commit/3ee26e2e9601424cb700b579bfa3f1d3cf8e203b))
* **template:** find link use id for scrollToAnchor and init scroll container before set links #OSP-197 ([96fef31](https://github.com/docgeni/docgeni/commit/96fef312c345210ca2b6ba3f2c3912f773e5fd45)), closes [#OSP-197](https://github.com/docgeni/docgeni/issues/OSP-197)
* **template:** sidebar arrow status ([#248](https://github.com/docgeni/docgeni/issues/248)) ([f31e719](https://github.com/docgeni/docgeni/commit/f31e719928e79b8d7ca47054b4f712ba0b1f46a6))
* **core:** should generate emitted path use custom name via component doc frontmatter #OSP-193 ([#247](https://github.com/docgeni/docgeni/issues/247)) ([96c123e](https://github.com/docgeni/docgeni/commit/96c123ec7c04dc6ac030253c373738af5c9453c0)), closes [#OSP-193](https://github.com/docgeni/docgeni/issues/OSP-193)
* **core:** remove deleted docs from compile parms when delete doc file #OSP-191 ([84cb57e](https://github.com/docgeni/docgeni/commit/84cb57e9d235adcd106965500c245b2bcb967bf5)), closes [#OSP-191](https://github.com/docgeni/docgeni/issues/OSP-191)
* **template:** refresh page with fragment auto scrollToAnchor #OSP-190 ([#243](https://github.com/docgeni/docgeni/issues/243)) ([6ebd0e5](https://github.com/docgeni/docgeni/commit/6ebd0e57307afdb4212cbce00da33b9611da163d)), closes [#OSP-190](https://github.com/docgeni/docgeni/issues/OSP-190)
* **core:** fix empty path error when exec ng command for custom site and remove redundant name for lib example path ([90d7776](https://github.com/docgeni/docgeni/commit/90d7776e5158b1bb931dec0fa73824a9c735da33))
* **template:** update get doc item by path for lite mode ([#229](https://github.com/docgeni/docgeni/issues/229)) ([b2925e0](https://github.com/docgeni/docgeni/commit/b2925e05ef41ad705e7103e5ae9807ce48d36c0d))
* **toolkit:** git log `names with spaces` error ([#226](https://github.com/docgeni/docgeni/issues/226)) ([056a43c](https://github.com/docgeni/docgeni/commit/056a43c63902fbcb6f747d771e18005fb34c2569))
* **template:** update get doc item by path for lite mode ([#229](https://github.com/docgeni/docgeni/issues/229)) ([b2925e0](https://github.com/docgeni/docgeni/commit/b2925e05ef41ad705e7103e5ae9807ce48d36c0d))
* **toolkit:** git log `names with spaces` error ([#226](https://github.com/docgeni/docgeni/issues/226)) ([056a43c](https://github.com/docgeni/docgeni/commit/056a43c63902fbcb6f747d771e18005fb34c2569))



# [1.1.0-next.9](https://github.com/docgeni/docgeni/compare/v1.1.0-next.8...v1.1.0-next.9) (2021-09-29)


### Bug Fixes

* **template:** add originPath for component doc and display doc-meta only for available doc ([3ee26e2](https://github.com/docgeni/docgeni/commit/3ee26e2e9601424cb700b579bfa3f1d3cf8e203b))
* **template:** find link use id for scrollToAnchor and init scroll container before set links #OSP-197 ([96fef31](https://github.com/docgeni/docgeni/commit/96fef312c345210ca2b6ba3f2c3912f773e5fd45)), closes [#OSP-197](https://github.com/docgeni/docgeni/issues/OSP-197)
* **template:** sidebar arrow status ([#248](https://github.com/docgeni/docgeni/issues/248)) ([f31e719](https://github.com/docgeni/docgeni/commit/f31e719928e79b8d7ca47054b4f712ba0b1f46a6))


### Features

* **template:** sidebar category support expand and collapse([#244](https://github.com/docgeni/docgeni/issues/244)) ([3538670](https://github.com/docgeni/docgeni/commit/35386705e562761c99494598655d3e2a40dcdc2c))





# [1.1.0-next.8](https://github.com/docgeni/docgeni/compare/v1.1.0-next.7...v1.1.0-next.8) (2021-09-26)


### Bug Fixes

* **core:** should generate emitted path use custom name via component doc frontmatter #OSP-193 ([#247](https://github.com/docgeni/docgeni/issues/247)) ([96c123e](https://github.com/docgeni/docgeni/commit/96c123ec7c04dc6ac030253c373738af5c9453c0)), closes [#OSP-193](https://github.com/docgeni/docgeni/issues/OSP-193)





# [1.1.0-next.7](https://github.com/docgeni/docgeni/compare/v1.1.0-next.6...v1.1.0-next.7) (2021-09-24)


### Bug Fixes

* **core:** remove deleted docs from compile parms when delete doc file #OSP-191 ([84cb57e](https://github.com/docgeni/docgeni/commit/84cb57e9d235adcd106965500c245b2bcb967bf5)), closes [#OSP-191](https://github.com/docgeni/docgeni/issues/OSP-191)
* **template:** refresh page with fragment auto scrollToAnchor #OSP-190 ([#243](https://github.com/docgeni/docgeni/issues/243)) ([6ebd0e5](https://github.com/docgeni/docgeni/commit/6ebd0e57307afdb4212cbce00da33b9611da163d)), closes [#OSP-190](https://github.com/docgeni/docgeni/issues/OSP-190)


### Features

* **core:** embed support line select ([#238](https://github.com/docgeni/docgeni/issues/238)) ([fdfc34f](https://github.com/docgeni/docgeni/commit/fdfc34f0801caebc8c6f99250e123f7f27ee19fb))
* **template:** add switch locale by url as /zh-cn/xxx #OSP-86 ([#245](https://github.com/docgeni/docgeni/issues/245)) ([2a0e80c](https://github.com/docgeni/docgeni/commit/2a0e80c4aa5bd041cd0a533fdd721c7f6a243be3)), closes [#OSP-86](https://github.com/docgeni/docgeni/issues/OSP-86)
* **template:** support content, menu and hidden toc config for doc ([#240](https://github.com/docgeni/docgeni/issues/240)) ([61442ad](https://github.com/docgeni/docgeni/commit/61442ade839b6fe8cd14ff0db7b569414e2840f9))





# [1.1.0-next.6](https://github.com/docgeni/docgeni/compare/v1.1.0-next.4...v1.1.0-next.6) (2021-09-18)


### Bug Fixes

* **core:** fix empty path error when exec ng command for custom site and remove redundant name for lib example path ([90d7776](https://github.com/docgeni/docgeni/commit/90d7776e5158b1bb931dec0fa73824a9c735da33))
* **template:** update get doc item by path for lite mode ([#229](https://github.com/docgeni/docgeni/issues/229)) ([b2925e0](https://github.com/docgeni/docgeni/commit/b2925e05ef41ad705e7103e5ae9807ce48d36c0d))
* **toolkit:** git log `names with spaces` error ([#226](https://github.com/docgeni/docgeni/issues/226)) ([056a43c](https://github.com/docgeni/docgeni/commit/056a43c63902fbcb6f747d771e18005fb34c2569))


### Features

* **core:** add tty progress and compilation feature #OSP-163 ([#232](https://github.com/docgeni/docgeni/issues/232)) ([f635042](https://github.com/docgeni/docgeni/commit/f63504243cafb435117687e2708ed826addbe852)), closes [#OSP-163](https://github.com/docgeni/docgeni/issues/OSP-163)
* **template:** add page links for pre and next page ([f06a04c](https://github.com/docgeni/docgeni/commit/f06a04c9dc3caebc978e615f0cd7b4457e938712))
* **template:** doc-meta contributor add title ([8dcb876](https://github.com/docgeni/docgeni/commit/8dcb876afe4c26f7641114909451540a84ac76dc))





# [1.1.0-next.5](https://github.com/docgeni/docgeni/compare/v1.1.0-next.4...v1.1.0-next.5) (2021-09-18)


### Bug Fixes

* **template:** update get doc item by path for lite mode ([#229](https://github.com/docgeni/docgeni/issues/229)) ([b2925e0](https://github.com/docgeni/docgeni/commit/b2925e05ef41ad705e7103e5ae9807ce48d36c0d))
* **toolkit:** git log `names with spaces` error ([#226](https://github.com/docgeni/docgeni/issues/226)) ([056a43c](https://github.com/docgeni/docgeni/commit/056a43c63902fbcb6f747d771e18005fb34c2569))


### Features

* **core:** add tty progress and compilation feature #OSP-163 ([#232](https://github.com/docgeni/docgeni/issues/232)) ([f635042](https://github.com/docgeni/docgeni/commit/f63504243cafb435117687e2708ed826addbe852)), closes [#OSP-163](https://github.com/docgeni/docgeni/issues/OSP-163)
* **template:** add page links for pre and next page ([f06a04c](https://github.com/docgeni/docgeni/commit/f06a04c9dc3caebc978e615f0cd7b4457e938712))
* **template:** doc-meta contributor add title ([8dcb876](https://github.com/docgeni/docgeni/commit/8dcb876afe4c26f7641114909451540a84ac76dc))





# [1.1.0-next.4](https://github.com/docgeni/docgeni/compare/v1.1.0-next.1...v1.1.0-next.4) (2021-09-10)


### Features

* **core:** add doc-contribution ([#212](https://github.com/docgeni/docgeni/issues/212)) ([7f53eb5](https://github.com/docgeni/docgeni/commit/7f53eb5492caf61ab761bd0ffa97f50aba56225f))
* **template:** add source-code , copy components and refactor example-viewer use source-code and copy #OSP-181 ([#220](https://github.com/docgeni/docgeni/issues/220)) ([9b5ded4](https://github.com/docgeni/docgeni/commit/9b5ded402c0f7fe5d2b428cd8b5fb0ffe6b4dd6a)), closes [#OSP-181](https://github.com/docgeni/docgeni/issues/OSP-181)
* **template:** footer support custom ([#222](https://github.com/docgeni/docgeni/issues/222)) ([652a8b1](https://github.com/docgeni/docgeni/commit/652a8b1bac748a66cd8f2430505ced8aa7cbad93))
* **template:** support open isolated example #OSP-162 ([a700170](https://github.com/docgeni/docgeni/commit/a7001708d4b259fd1f1258a5b6d1fe38aa6d41f9)), closes [#OSP-162](https://github.com/docgeni/docgeni/issues/OSP-162)
* **template:** update dg-copy default color to $dg-gray-500, hover change to primary ([f33117d](https://github.com/docgeni/docgeni/commit/f33117dbbf3805b0b66af75a43b0f8520a382081))







**Note:** Version bump only for package docgeni





## [1.0.7](https://github.com/docgeni/docgeni/compare/v1.0.6...v1.0.7) (2021-07-02)


### Bug Fixes

* **core:** remove default description, default is empty #OSP-154 ([d00bdc8](https://github.com/docgeni/docgeni/commit/d00bdc8b5d6e7713c893c1ac41199f4d7a7e5689)), closes [#OSP-154](https://github.com/docgeni/docgeni/issues/OSP-154)
* **template:** set text-decoration: none to dg-tab-link hover fix confict ([04d0a5f](https://github.com/docgeni/docgeni/commit/04d0a5f91a7a5aad24b0c92b44322ce9dbc79eee))


### Features

* **template:** support en-us and zh-cn lang for overview and example #OSP-118 ([#198](https://github.com/docgeni/docgeni/issues/198)) ([c69a71a](https://github.com/docgeni/docgeni/commit/c69a71a3b982faa11e03a21917155c3e0c827bad)), closes [#OSP-118](https://github.com/docgeni/docgeni/issues/OSP-118)





## [1.0.6](https://github.com/docgeni/docgeni/compare/v1.0.5...v1.0.6) (2021-07-02)


### Bug Fixes

* use index.scss for site-template ([6b1c45b](https://github.com/docgeni/docgeni/commit/6b1c45b0379f9663746b2e61b11a77131b27fbc7))





## [1.0.5](https://github.com/docgeni/docgeni/compare/v1.0.4...v1.0.5) (2021-07-02)


### Bug Fixes

* **template:** remove $yiq warning use math.div ([7c68eb3](https://github.com/docgeni/docgeni/commit/7c68eb328fa342b3ceb1975b7c9f05f8c980f3ab))
* **template:** remove max-height: 100vh for dg-doc-viewer ([97e4944](https://github.com/docgeni/docgeni/commit/97e4944a51d17e8740d79d2ef5da14d35350866d))
* **template:** replace 1000 to 100 for fix $yiq style ([4ef2a5b](https://github.com/docgeni/docgeni/commit/4ef2a5b4e90bfaa8dcfd5bd66cab2d69a0ca4f51))


### Features

* **core:** add clear method to DocSourceFile and refactor it use DocgeniHost [#177](https://github.com/docgeni/docgeni/issues/177) ([#193](https://github.com/docgeni/docgeni/issues/193)) ([4271f4c](https://github.com/docgeni/docgeni/commit/4271f4cf4f69f6dfa660f1d61c0f1a245ff47eb0))
* **template:** auto switch to browser lang when it supported ([#191](https://github.com/docgeni/docgeni/issues/191)) ([5c72764](https://github.com/docgeni/docgeni/commit/5c7276425e452857a1d0392cacf06bed41356a46))
* bundle scss and css([#188](https://github.com/docgeni/docgeni/issues/188)) ([cd3206c](https://github.com/docgeni/docgeni/commit/cd3206cfd6b31c87c4d26d7ad1ba49b17050a96d))


### Reverts

* revert $yiq use slash from [@use](https://github.com/use) "sass:math"; ([33d0265](https://github.com/docgeni/docgeni/commit/33d0265d914cd63f1a14e07acc9ecae66215d49f))





## [1.0.4](https://github.com/docgeni/docgeni/compare/v1.0.3...v1.0.4) (2021-06-25)


### Bug Fixes

* **toolkit:** incorrect succuss to success ([eeaeb7a](https://github.com/docgeni/docgeni/commit/eeaeb7afa2187ef6f9af24487389ca569732306d))





## [1.0.3](https://github.com/docgeni/docgeni/compare/v1.0.2...v1.0.3) (2021-06-17)


### Bug Fixes

* **template:** set position sticky to dg-toc and add dg-scroll-container ([434b244](https://github.com/docgeni/docgeni/commit/434b24479aec91652bc2d647797c58386af0adff))


### Features

* **template:** add language switch in lite mode ([#182](https://github.com/docgeni/docgeni/issues/182)) ([5e80d2c](https://github.com/docgeni/docgeni/commit/5e80d2c53b6a764ba00b595e3fed55fb231c64a4))





## [1.0.2](https://github.com/docgeni/docgeni/compare/v1.0.1...v1.0.2) (2021-06-07)


### Bug Fixes

* **core:** remove `include` dirs from `exclude` for scanning lib components  [#179](https://github.com/docgeni/docgeni/issues/179) ([fa02c1e](https://github.com/docgeni/docgeni/commit/fa02c1ea576f438874291878a4efd7bcfe617452))
* update angular cli analytics default value to `false` [#175](https://github.com/docgeni/docgeni/issues/175) ([a5e9a5a](https://github.com/docgeni/docgeni/commit/a5e9a5adaf5d3426bb3cacaec3931ef15f9ff570))


### Features

* **template:** update open mode to `over` from `push` for sidebar ([#173](https://github.com/docgeni/docgeni/issues/173)) ([8996ace](https://github.com/docgeni/docgeni/commit/8996ace1fd91e0b6f27f389f570f6a2998e2549a))





## [1.0.1](https://github.com/docgeni/docgeni/compare/v1.0.0...v1.0.1) (2021-05-31)


### Bug Fixes

* **core:** fix path in windows ([69d8a25](https://github.com/docgeni/docgeni/commit/69d8a25df14a27bc9f3f987db5500a11e994f4c3))
* **core:** fix run in windows env ([b9e760f](https://github.com/docgeni/docgeni/commit/b9e760f9e0fbfc5b91fc63f9801974039aa87dbf))
* **core:** fix test expect ([ba1e5e5](https://github.com/docgeni/docgeni/commit/ba1e5e59d92427fef4c51fc755681ff2d0c014b3))
* **core:** log full path when docs dir is not exists ([76ae3fc](https://github.com/docgeni/docgeni/commit/76ae3fce75efc1861df780781d557ce79580ecc2))
* **core:** should use abs docs path to validate exists ([b509149](https://github.com/docgeni/docgeni/commit/b50914993dc09df443247a60b536e865b6e1ebf2))
* **core:** use getSystemPath translate path for copy ([d558083](https://github.com/docgeni/docgeni/commit/d5580836ddf52a5bd9b56a716a984f9f9a78aa82))
* **template:** fix dg-doc-content and dg-examples styles ([4f502be](https://github.com/docgeni/docgeni/commit/4f502be2622004483f5ff7c3c3ad8434140279af))





# [1.0.0](https://github.com/docgeni/docgeni/compare/v1.0.0-beta.7...v1.0.0) (2021-05-20)


### Bug Fixes

* **template:** temp hide external icon for example viewer ([7dcfa11](https://github.com/docgeni/docgeni/commit/7dcfa11cf51a8bd4fb963b4c4aa0305c6fb9acd6))





# [1.0.0-beta.7](https://github.com/docgeni/docgeni/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2021-05-19)


### Bug Fixes

* **cli:** remove <12 in peerDependencies for support ng 12 ([4e75e52](https://github.com/docgeni/docgeni/commit/4e75e52ffe20e2d26762683b00ef263168f493f3))
* **core:** should not throw error when include dir is not exists #OSP-123 ([35d9e39](https://github.com/docgeni/docgeni/commit/35d9e39295a5d92206e777729eab69d7a31537fd)), closes [#OSP-123](https://github.com/docgeni/docgeni/issues/OSP-123)





# [1.0.0-beta.6](https://github.com/docgeni/docgeni/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-05-19)


### Bug Fixes

* **core:** always build site , don't check src dir #OSP-113 ([c097cf0](https://github.com/docgeni/docgeni/commit/c097cf02bd7726f8590ebf2b0fba45bd70535618)), closes [#OSP-113](https://github.com/docgeni/docgeni/issues/OSP-113)
* **template:** fit responsive for nav and sidebar ([#158](https://github.com/docgeni/docgeni/issues/158)) ([ff4956f](https://github.com/docgeni/docgeni/commit/ff4956f15c180e2c14f09315f1468349b4c875a1))





# [1.0.0-beta.5](https://github.com/docgeni/docgeni/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-05-19)

**Note:** Version bump only for package docgeni





# [1.0.0-beta.4](https://github.com/docgeni/docgeni/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-05-18)


### Bug Fixes

* **core:** generate tsconfig paths exception throw if no package.json found ([8812e7d](https://github.com/docgeni/docgeni/commit/8812e7d82acfadcdefd218711fb984e0e10b2b17))
* **core:** markdown highlight for bash ng and others ([#147](https://github.com/docgeni/docgeni/issues/147)) ([f75a1b4](https://github.com/docgeni/docgeni/commit/f75a1b4f4659c15f4038af2834c446440506f91c))
* **template:** shoule find component doc by path and importSpecifier ([1efe281](https://github.com/docgeni/docgeni/commit/1efe2810a34fe8673809d1978cda10f4c95169bd))


### Features

* **core:** normalize and verify lib config, and add test #OSP-95 ([3759aa2](https://github.com/docgeni/docgeni/commit/3759aa28106f268aa686585b5ce7f5a6dfe3cb71)), closes [#OSP-95](https://github.com/docgeni/docgeni/issues/OSP-95)
* **core:** normalize config for navs, locales and verify configs #OSP-95 ([b46fabd](https://github.com/docgeni/docgeni/commit/b46fabd40c3306f0c8b1b3189170c7c20f252234)), closes [#OSP-95](https://github.com/docgeni/docgeni/issues/OSP-95)
* **core:** watch public files ([#141](https://github.com/docgeni/docgeni/issues/141)) ([c7c7c31](https://github.com/docgeni/docgeni/commit/c7c7c31466c91fbf8d459087a0e2edecbdb87f09))





# [1.0.0-beta.3](https://github.com/docgeni/docgeni/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2021-05-15)


### Bug Fixes

* **core:** should export configurable properties for lib ([b504b1d](https://github.com/docgeni/docgeni/commit/b504b1dda971cc41db67f8a74fe4bce8130253bd))
* **template:** remove footer ([b52a4c1](https://github.com/docgeni/docgeni/commit/b52a4c1546fa604fe54630acc396cf8f41b68e1c))
* **template:** should get corrent content when there are two same paths in different channels #OSP-99 ([#144](https://github.com/docgeni/docgeni/issues/144)) ([597d060](https://github.com/docgeni/docgeni/commit/597d0600d7ba1545bb51081e6653b2a7f8809b5d)), closes [#OSP-99](https://github.com/docgeni/docgeni/issues/OSP-99)


### Features

* **cli:** json-schema ([#138](https://github.com/docgeni/docgeni/issues/138)) ([dce686a](https://github.com/docgeni/docgeni/commit/dce686a215d3ebbcccf973c4aace58e6774fc5bb))





# [1.0.0-beta.2](https://github.com/docgeni/docgeni/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2021-05-12)


### Bug Fixes

* **template:** fix toc href when has baseHref ([0121ae9](https://github.com/docgeni/docgeni/commit/0121ae9a809afc85eb3fc6fcfc769a6948f94404))
* **template:** set data-level according to highestLevel ([ecc5583](https://github.com/docgeni/docgeni/commit/ecc5583a164ac65f6ccb1730591e4ecee3e0e32c))


### Features

* **cli:** docgeni serve/build support ng serve/build command args ([#131](https://github.com/docgeni/docgeni/issues/131)) ([0fcfb48](https://github.com/docgeni/docgeni/commit/0fcfb489cbaea6cce79ba6387c26a167203efefa))





# [1.0.0-beta.1](https://github.com/docgeni/docgeni/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2021-04-01)


### Bug Fixes

* **template:** add timestamp for request navigations json to avoid browser cache old data ([7cf6123](https://github.com/docgeni/docgeni/commit/7cf6123fc76cf92773e6592306c6134b61e52c68))
* **template:** should redirect fisrt component when click component channel ([#120](https://github.com/docgeni/docgeni/issues/120)) ([abe9736](https://github.com/docgeni/docgeni/commit/abe97362294c62167bbc005e81bd30d4a31c0f94))
* **template:** should use default language when cache locale is not supported ([b16a188](https://github.com/docgeni/docgeni/commit/b16a1888c8aa4644c5b98409d774942616b67e3a))


### Features

* **cli:** `ng add` action ([6af32fd](https://github.com/docgeni/docgeni/commit/6af32fd9baa235f562c04ca1e5deedf05945e975))
* **core:** auto add tsconfig paths for create site ([#119](https://github.com/docgeni/docgeni/issues/119)) ([532d1d8](https://github.com/docgeni/docgeni/commit/532d1d8dd8c341773f0d5f3585778c6ad3c1bbb2))





# [1.0.0-beta.0](https://github.com/docgeni/docgeni/compare/v0.6.0-next.18...v1.0.0-beta.0) (2021-03-30)


### Bug Fixes

* **cli:** update getting-started template content ([056b2f9](https://github.com/docgeni/docgeni/commit/056b2f923d8347188e6a51bf6ec5bee3d36435b3))
* **core:** should build success when public assets dir is not exist and delete site ([#116](https://github.com/docgeni/docgeni/issues/116)) ([1fea06a](https://github.com/docgeni/docgeni/commit/1fea06a81358a8f4f888132b84dbb5e352be4d79))
* **template:** remove home route only when there is route path is empty for lite mode ([2e525bb](https://github.com/docgeni/docgeni/commit/2e525bb8b6e4c983da50dd48934ee6510a411f97))
* **template:** should redirect to first doc when click channel and current route is under the channel ([#115](https://github.com/docgeni/docgeni/issues/115)) ([6bdf157](https://github.com/docgeni/docgeni/commit/6bdf157e3ebf70d89f045d6e1a498bcb4b03d0bd))


### Features

* **core:** update output to outputDir and refactor docs ([8423abb](https://github.com/docgeni/docgeni/commit/8423abbbb81f31cfd042c5e3311449e519a99f8d))





# [0.6.0-next.18](https://github.com/docgeni/docgeni/compare/v0.6.0-next.17...v0.6.0-next.18) (2021-03-25)


### Bug Fixes

* **core:** update docgeni default siteDir to .docgeni/site ([#110](https://github.com/docgeni/docgeni/issues/110)) ([66352f5](https://github.com/docgeni/docgeni/commit/66352f50ddb0524014c2c226e0f17a65240d2d0c))
* **template:** should redirect first doc when there are no docs in subfolder's parent folder ([bd708b4](https://github.com/docgeni/docgeni/commit/bd708b4d5b03474a06e470672de9cc8d9e9f0495))


### Features

* **core:** support publicDir contains assets,.browserslistrc, index.html,tsconfig.json and styles.scss ([#111](https://github.com/docgeni/docgeni/issues/111)) ([ac43a96](https://github.com/docgeni/docgeni/commit/ac43a96e33ec771e17d5c09815db2831b45cc4e4))





# [0.6.0-next.17](https://github.com/docgeni/docgeni/compare/v0.6.0-next.16...v0.6.0-next.17) (2021-03-24)


### Bug Fixes

* **template:** update peerDependencies as * ([c1e8c4a](https://github.com/docgeni/docgeni/commit/c1e8c4a2f661d8d2be63ad1f7c3ffb573732d80c))





# [0.6.0-next.16](https://github.com/docgeni/docgeni/compare/v0.6.0-next.15...v0.6.0-next.16) (2021-03-24)


### Bug Fixes

* **template:** support 9.0.0 ([9fec5a0](https://github.com/docgeni/docgeni/commit/9fec5a0a74ad480d1facabf12364712ad1bbb772))
* **template:** update peerDependencies support angular 11 ([4615c9c](https://github.com/docgeni/docgeni/commit/4615c9c738a0680e52ef5e2d599bb602658da724))


### Features

* **cli:** add [@type](https://github.com/type) support for js config ([a19542e](https://github.com/docgeni/docgeni/commit/a19542eadbdd17abaed9b67670397efde2def576))





# [0.6.0-next.15](https://github.com/docgeni/docgeni/compare/v0.6.0-next.14...v0.6.0-next.15) (2021-03-18)


### Bug Fixes

* **template:** add flex auto for dg-doc-viewer--single ([addc61f](https://github.com/docgeni/docgeni/commit/addc61fff06c413132374bce7839d0169dd1affc))
* **template:** should display page without channel ([39b6b7c](https://github.com/docgeni/docgeni/commit/39b6b7c743ff96f9c9365569dbbc5e86bd886a49))





# [0.6.0-next.14](https://github.com/docgeni/docgeni/compare/v0.6.0-next.13...v0.6.0-next.14) (2021-03-18)


### Features

* **core:** should display index.md as page when mode is lite ([bb3b604](https://github.com/docgeni/docgeni/commit/bb3b60400a4a4c50a404d661ff0cbd1caaf04fb4))
* **core:** update docsPath to docsDir and refactor component docs ([f289f8f](https://github.com/docgeni/docgeni/commit/f289f8f69ae9f17e287066c36b912f03009b8e6b))





# [0.6.0-next.13](https://github.com/docgeni/docgeni/compare/v0.6.0-next.12...v0.6.0-next.13) (2021-03-18)


### Bug Fixes

* **template:** should hide x scroll for lite mode ([bc50415](https://github.com/docgeni/docgeni/commit/bc50415d8f535da886b32df6b17a15fa388636ed))


### Features

* **api:** ApiDeclaration support interface & class ([cb7ec62](https://github.com/docgeni/docgeni/commit/cb7ec623e4f6c3d13f689e3a512f7ff6d90308f5))
* **cli:** add `docgeni init` command ([#94](https://github.com/docgeni/docgeni/issues/94)) ([c3e126b](https://github.com/docgeni/docgeni/commit/c3e126b0a87329df8a52122686a26b4fd8f1b5f6))
* **core:** support config siteDir ([3f0ea8f](https://github.com/docgeni/docgeni/commit/3f0ea8ffd11de0dfce423c2cd04ab71089437cf8))
* **core:** update site angular.json output & root ([044ef16](https://github.com/docgeni/docgeni/commit/044ef16e8a210e92f7cf266bd71098186460d0d0))
* **template:** show level in table of content ([#91](https://github.com/docgeni/docgeni/issues/91)) ([74baf15](https://github.com/docgeni/docgeni/commit/74baf1524bae37414cae448880428660ddb5917e)), closes [#OSP-12](https://github.com/docgeni/docgeni/issues/OSP-12)
* **toc:** stick toc in top ([4fb5d06](https://github.com/docgeni/docgeni/commit/4fb5d062e42213d9e3c086622e443f6e336475a3))





# [0.6.0-next.12](https://github.com/docgeni/docgeni/compare/v0.6.0-next.11...v0.6.0-next.12) (2021-03-11)


### Bug Fixes

* fix test error in circleci ([ff5137f](https://github.com/docgeni/docgeni/commit/ff5137fc735d8afbe8665b6ba5baae0bde05c5f9))


### Features

* **cli:** @docgeni/cli add schematics ([#88](https://github.com/docgeni/docgeni/issues/88)) ([3f992d3](https://github.com/docgeni/docgeni/commit/3f992d3cc245c1e4ad801eeb24f0ada84386dd54))





# [0.6.0-next.11](https://github.com/docgeni/docgeni/compare/v0.6.0-next.10...v0.6.0-next.11) (2021-02-25)


### Bug Fixes

* should be used as a third-party library when NODE_ENV is not prod and src is not exist ([fe18a2e](https://github.com/docgeni/docgeni/commit/fe18a2e2e2d7ab6b4b6a175b7c1078e2c698a598))





# [0.6.0-next.10](https://github.com/docgeni/docgeni/compare/v0.6.0-next.9...v0.6.0-next.10) (2021-02-24)


### Bug Fixes

* change toolkit and core types to lib.index.d.ts ([d8b7278](https://github.com/docgeni/docgeni/commit/d8b7278ea7779ab8a42c96982e9d20ddb4e50c47))





# [0.6.0-next.9](https://github.com/docgeni/docgeni/compare/v0.6.0-next.8...v0.6.0-next.9) (2021-02-22)


### Bug Fixes

* **core:** update outputPath to root dist dir ([60cbb0e](https://github.com/docgeni/docgeni/commit/60cbb0ea641c6398b4648f6babec52d1cac59f7b))


### Features

* **core:** add hidden support hide some doc nav #INFR-670 ([3e04101](https://github.com/docgeni/docgeni/commit/3e041012fb29d4ad4d2c8ea49796b4f3dcf54e22)), closes [#INFR-670](https://github.com/docgeni/docgeni/issues/INFR-670)





# [0.6.0-next.8](https://github.com/docgeni/docgeni/compare/v0.6.0-next.7...v0.6.0-next.8) (2021-02-20)


### Features

* **cli:** add partial schematics to cli #INFR-1648 ([88abf5a](https://github.com/docgeni/docgeni/commit/88abf5a1e417151ff82d1fd34d8d398b332ed81a)), closes [#INFR-1648](https://github.com/docgeni/docgeni/issues/INFR-1648)





# [0.6.0-next.7](https://github.com/docgeni/docgeni/compare/v0.6.0-next.6...v0.6.0-next.7) (2021-02-20)


### Bug Fixes

* **core:** generate example module keys exclude components with out examples #INFR-1644 ([8acbbb8](https://github.com/docgeni/docgeni/commit/8acbbb8a63755d6e8fb218b4ea4cae5704f3c309)), closes [#INFR-1644](https://github.com/docgeni/docgeni/issues/INFR-1644)





# [0.6.0-next.6](https://github.com/docgeni/docgeni/compare/v0.6.0-next.5...v0.6.0-next.6) (2021-02-20)


### Bug Fixes

* **cli:** update cli rxjs tslib and zone.js versions ([0862480](https://github.com/docgeni/docgeni/commit/08624806d48fd078814f157cb4ca589c2d664bbb))
* **core:** fix windows err about spawn and cross-env #INFR-1574 ([3750db8](https://github.com/docgeni/docgeni/commit/3750db82b4b539a3560de91b7b1a6c89bffb0972)), closes [#INFR-1574](https://github.com/docgeni/docgeni/issues/INFR-1574)
* **core:** should remove example highlighted content from EXAMPLE_COMPONENTS #INFR-1644 ([9bd7077](https://github.com/docgeni/docgeni/commit/9bd7077e628c688a8e2bb47ec11077a661892179)), closes [#INFR-1644](https://github.com/docgeni/docgeni/issues/INFR-1644)





# [0.6.0-next.5](https://github.com/docgeni/docgeni/compare/v0.6.0-next.4...v0.6.0-next.5) (2021-01-18)


### Bug Fixes

* **cli:** update angular dependencies version ([ab749bb](https://github.com/docgeni/docgeni/commit/ab749bbe9e9f555f793a5d0aa210f4e5c50f47c8))
* **core:** should not throw error when exclude is undefined ([0a8999e](https://github.com/docgeni/docgeni/commit/0a8999e9990c3641a9a3ab16040f7407cc951205))





# [0.6.0-next.4](https://github.com/docgeni/docgeni/compare/v0.6.0-next.3...v0.6.0-next.4) (2021-01-18)


### Bug Fixes

* **cli:** update cli dependencies @docgeni/template ([2ccebaa](https://github.com/docgeni/docgeni/commit/2ccebaa797659bf2511eb43251332eb35b753077))


### Features

* **cli:** add angular build & serve command options contains port,deployUrl,baseHref support ([66dced5](https://github.com/docgeni/docgeni/commit/66dced546b7e291a56ce8aeafdf00d48fe4d967f))





# [0.6.0-next.3](https://github.com/docgeni/docgeni/compare/v0.6.0-next.2...v0.6.0-next.3) (2021-01-07)


### Bug Fixes

* **core:** ignore non md file when build doc navs and don't throw error when entryFile is null ([73be38b](https://github.com/docgeni/docgeni/commit/73be38bd5692dff24fac61e48821d291b5876920))
* **template:** export IsModeFullPipe and IsModeLitePipe and simply AppModule ([30c7491](https://github.com/docgeni/docgeni/commit/30c7491e4fe1a36323dde7381919766be259b359))


### Features

* **cli:** add [@angular](https://github.com/angular) dependencies to @docgeni/cli ([e408745](https://github.com/docgeni/docgeni/commit/e408745acb8c1e1f70237ff317e943c138e6e8ee))





# [0.6.0-next.2](https://github.com/docgeni/docgeni/compare/v0.6.0-next.1...v0.6.0-next.2) (2021-01-04)


### Bug Fixes

* **core:** fix build error remove unused code ([3e470a7](https://github.com/docgeni/docgeni/commit/3e470a7d90ea2ba2e9f134046d05e977d803dcd0))
* **core:** should reread doc content when watch changes ([2c8f4bf](https://github.com/docgeni/docgeni/commit/2c8f4bf874003bcbba9c795a844b2f6e9717ab29))


### Features

* **core:** generate content index.ts for AppModule ([1041345](https://github.com/docgeni/docgeni/commit/1041345786f8a4415ecf83e508f38aca992037f5))
* **core:** support project without angular siteProject ([29bb54d](https://github.com/docgeni/docgeni/commit/29bb54d51d3dde23fcb0f1b8d937a44b09da8923))





# [0.6.0-next.1](https://github.com/docgeni/docgeni/compare/v0.6.0-next.0...v0.6.0-next.1) (2021-01-03)

**Note:** Version bump only for package docgeni





# [0.6.0-next.0](https://github.com/docgeni/docgeni/compare/v0.5.9...v0.6.0-next.0) (2021-01-02)


### Features

* support lite mode and refactor lib and doc builder ([6e72eba](https://github.com/docgeni/docgeni/commit/6e72eba89047e670b8fe1087725183b697b1f669))





## [0.5.8](https://github.com/docgeni/docgeni/compare/v0.5.7...v0.5.8) (2020-12-29)


### Features

* **template:** upgrade ng to 10.0.0 ([63af2be](https://github.com/docgeni/docgeni/commit/63af2be1f775bd3f8d86da83f280dffe87387092))





## [0.5.7](https://github.com/docgeni/docgeni/compare/v0.5.6...v0.5.7) (2020-12-05)


### Bug Fixes

* **template:** img max width 100% ([5ce156c](https://github.com/docgeni/docgeni/commit/5ce156c8b76a3c09480be8f304ec575efd9a9b1d))
* **template:** remove min-height for example-viewer-sources-content ([1353e2b](https://github.com/docgeni/docgeni/commit/1353e2bee3a65667ba8cf3907fe123b9a1b3b594))


### Features

* **template:** beautify style for navbar and api table ([a5b1a2c](https://github.com/docgeni/docgeni/commit/a5b1a2c7fae3937642a87ef723c7dd54c349159d))
* **template:** increase HTML display priority ([e3503b7](https://github.com/docgeni/docgeni/commit/e3503b771563f2aab65cac77d434360f86e3eac3))





## [0.5.6](https://github.com/docgeni/docgeni/compare/v0.5.5...v0.5.6) (2020-08-28)


### Bug Fixes

* **template:** fix navbar responsive for theme ([abfe573](https://github.com/docgeni/docgeni/commit/abfe573207c12ee1be96bd70869c9c84f2b38160))
* **template:** update background rgba from 12% to 0.12 ([088ea49](https://github.com/docgeni/docgeni/commit/088ea49fd11300dbe21beec63d82a365748ddf8e))





## [0.5.5](https://github.com/docgeni/docgeni/compare/v0.5.4...v0.5.5) (2020-08-28)


### Features

* **template:** change api doc style and generate json files ([b6404d4](https://github.com/docgeni/docgeni/commit/b6404d4982a9770e51c87e007f666db49fddc31f))
* **template:** support default and angular theme #INFR-606 ([#59](https://github.com/docgeni/docgeni/issues/59)) ([b64a246](https://github.com/docgeni/docgeni/commit/b64a24698a4c23366df68254d81b13b00350bc65)), closes [#INFR-606](https://github.com/docgeni/docgeni/issues/INFR-606)





## [0.5.4](https://github.com/docgeni/docgeni/compare/v0.5.3...v0.5.4) (2020-07-14)


### Bug Fixes

* **template:** fix error about BrowserModule has already been loaded ([48cb303](https://github.com/docgeni/docgeni/commit/48cb303c3b1d3037f405a277e1767bf357357589))
* **template:** remove BrowserModule from shared module ([eb4f041](https://github.com/docgeni/docgeni/commit/eb4f04198b7a996cb7d71b84a75c01ae39b8272d))





## [0.5.3](https://github.com/docgeni/docgeni/compare/v0.5.2...v0.5.3) (2020-07-11)


### Bug Fixes

* export all public-api remove barrel index ([c47db82](https://github.com/docgeni/docgeni/commit/c47db82923ddd004adada93937724ae997c9c1a1))





## [0.5.2](https://github.com/docgeni/docgeni/compare/v0.5.1...v0.5.2) (2020-07-11)


### Bug Fixes

* **core:** exclude index.md source file for example dir ([dc64b53](https://github.com/docgeni/docgeni/commit/dc64b53261c08327c996e64eb921bd58555ad888))
* **template:** load assets path change to relative ([b79881c](https://github.com/docgeni/docgeni/commit/b79881cb38ade9e115c17e810a76ab1a05ef3531))





## [0.5.1](https://github.com/docgeni/docgeni/compare/v0.5.0...v0.5.1) (2020-07-11)


### Bug Fixes

* **template:** fix navigations json assets path ([9dcb715](https://github.com/docgeni/docgeni/commit/9dcb715c7ec20505015e081a76802b530396b9e0))
* **template:** heading font-size change ([098036a](https://github.com/docgeni/docgeni/commit/098036a3d1327779a3414da27d0cd46f9243b620))
* **template:** replace url when navigate to channel page from home ([e902f74](https://github.com/docgeni/docgeni/commit/e902f7457378f5b0eb2e8f9a406fbcccbfb55773))
* **template:** toc active scroll to anchor ([774004e](https://github.com/docgeni/docgeni/commit/774004e7f37dfd55c73c3f414c00874471530851))





# [0.5.0](https://github.com/docgeni/docgeni/compare/v0.4.0...v0.5.0) (2020-06-26)


### Features

* **template:** mobile responsive for nav and sidebar ([54de98e](https://github.com/docgeni/docgeni/commit/54de98e5a43c896bb8595b9530458e38364adf43))





# [0.4.0](https://github.com/docgeni/docgeni/compare/v0.3.0...v0.4.0) (2020-06-25)


### Bug Fixes

* **core:** category support front-matter path ([bebf0cc](https://github.com/docgeni/docgeni/commit/bebf0cca40f89e8f866fd0cf5d6203554716645f))
* **template:** table width 100% ([f555c62](https://github.com/docgeni/docgeni/commit/f555c625522504f3a223cac5a7b8c143bc9b0ab5))





# [0.3.0](https://github.com/docgeni/docgeni/compare/v0.2.1...v0.3.0) (2020-06-24)


### Bug Fixes

* redirect to empty when component has not doc, api and examples ([1ba8f6f](https://github.com/docgeni/docgeni/commit/1ba8f6f5ffc053a8e91ae1fbfed69ee973547934))





## [0.2.1](https://github.com/docgeni/docgeni/compare/v0.2.0...v0.2.1) (2020-06-24)


### Bug Fixes

* **core:** don't show properties table when properties is empty ([79a9890](https://github.com/docgeni/docgeni/commit/79a98909aa05c456ceb9fb33d14229779255ab47))


### Features

* **template:** add unformed toc for doc and component overview #INFR-377 ([8019c48](https://github.com/docgeni/docgeni/commit/8019c485fbaf1931cdee1a32c4c12346a8c096ae)), closes [#INFR-377](https://github.com/docgeni/docgeni/issues/INFR-377)





# [0.2.0](https://github.com/docgeni/docgeni/compare/v0.1.0...v0.2.0) (2020-06-20)


### Features

* **core:** add api feature for component #INFR-481 ([6ee18e2](https://github.com/docgeni/docgeni/commit/6ee18e2ca5753dbbb974eddb89c5ef881f7ac38d)), closes [#INFR-481](https://github.com/docgeni/docgeni/issues/INFR-481)





# [0.1.0](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.13...v0.1.0) (2020-06-16)


### Features

* **core:** component support name front-matter and support lib docDir and examplesDir config #INFR-685 ([14026f6](https://github.com/docgeni/docgeni/commit/14026f6b3530ae4dfbbc85444b4cbeabd7ea8df1)), closes [#INFR-685](https://github.com/docgeni/docgeni/issues/INFR-685)





# [0.1.0-alpha.13](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.12...v0.1.0-alpha.13) (2020-06-13)


### Bug Fixes

* add @docgeni/template to core 's peerDependencies ([68832b4](https://github.com/docgeni/docgeni/commit/68832b4058eb6d8e6933d76e023e2200edce6955))
* **core:** fix import sub dir component examples module error ([0cd9a55](https://github.com/docgeni/docgeni/commit/0cd9a556f1f364a626bea498f13387f52c67e250))





# [0.1.0-alpha.12](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.11...v0.1.0-alpha.12) (2020-06-13)


### Bug Fixes

* **template:** set line-height as 1.5715 ([cc15b95](https://github.com/docgeni/docgeni/commit/cc15b950a3253c5f7d49c8deae40d2f253c168ef))
* **ui:** layout style error ([9d943ed](https://github.com/docgeni/docgeni/commit/9d943ed3e8846c7102c3ea1574c08380f3d0e7ac))


### Features

* **core:** add include for lib support subdir components #INFR-662 ([ee3a255](https://github.com/docgeni/docgeni/commit/ee3a25524ebf0a5b39cefd25ee362c5d0429e03e)), closes [#INFR-662](https://github.com/docgeni/docgeni/issues/INFR-662)
* **core:** sort lib components by order, and support example front-matter #INFR-643 ([3df0d03](https://github.com/docgeni/docgeni/commit/3df0d030ad66bbe5b3bc839c760fb70b73563f5b)), closes [#INFR-643](https://github.com/docgeni/docgeni/issues/INFR-643)
* **template:** add table style for doc content ([19457aa](https://github.com/docgeni/docgeni/commit/19457aa244e1d730605a5ae9bd09091c716fb837))





# [0.1.0-alpha.11](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.10...v0.1.0-alpha.11) (2020-06-12)


### Bug Fixes

* **cli:** serve command and rename cmdOptions to cmdArgs ([0332e25](https://github.com/docgeni/docgeni/commit/0332e257767d1c9e090f3dd43285c434a9c15247))
* **template:** hide locale select when only has one locale ([8363dec](https://github.com/docgeni/docgeni/commit/8363dec219d1a9aa784003005c5ab476d0c5a681))


### Features

* **template:** support subtitle display ([02e4136](https://github.com/docgeni/docgeni/commit/02e4136f8d357b6cb748012b02549315427aaaff))





# [0.1.0-alpha.10](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.9...v0.1.0-alpha.10) (2020-06-11)


### Features

* **core:** add cutome logoUrl config,  default show docgeni logo #INFR-604 ([4d00039](https://github.com/docgeni/docgeni/commit/4d00039ecf6e4d3bc9741d87861eff3bab406909)), closes [#INFR-604](https://github.com/docgeni/docgeni/issues/INFR-604)
* **core:** integrate angular cli serve and build command ([9e89803](https://github.com/docgeni/docgeni/commit/9e898037f1794564279d5d1a26ad55a739bf0f5e))
* **template:** add PageTitleService and set title in doc detail page #INFR-611 ([ba6b776](https://github.com/docgeni/docgeni/commit/ba6b776d2c7946b46fe0a8a28297db1b470b5a8f)), closes [#INFR-611](https://github.com/docgeni/docgeni/issues/INFR-611)
* **template:** example load support ViewEngine, only dynamic load in Ivy #INFR-613 ([557480d](https://github.com/docgeni/docgeni/commit/557480ded691cb7128009dc4d146c28cb7989d17)), closes [#INFR-613](https://github.com/docgeni/docgeni/issues/INFR-613)





# [0.1.0-alpha.9](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.8...v0.1.0-alpha.9) (2020-06-06)


### Bug Fixes

* remove nav item when there is no doc or examples ([3903799](https://github.com/docgeni/docgeni/commit/3903799697f165b2b851fb8e3542618307288cd1))


### Features

* **template:** change doc content styles ([b4952ce](https://github.com/docgeni/docgeni/commit/b4952ce00b13d48e2a26d152500a08a33eca9ba7))





# [0.1.0-alpha.8](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.7...v0.1.0-alpha.8) (2020-06-03)


### Features

* **core:** lib support exclude and doc or examples can be empty #INFR-564 ([c6fae1f](https://github.com/docgeni/docgeni/commit/c6fae1f01aa70b564b54678083b322d38129c1d8)), closes [#INFR-564](https://github.com/docgeni/docgeni/issues/INFR-564)





# [0.1.0-alpha.7](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.6...v0.1.0-alpha.7) (2020-05-27)


### Bug Fixes

* **template:** remove bootstrap, add dg-main dg-footer class ([3144ace](https://github.com/docgeni/docgeni/commit/3144ace7f69ec2a584eea3e849c8b68ec1929def))





# [0.1.0-alpha.6](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.5...v0.1.0-alpha.6) (2020-05-27)

**Note:** Version bump only for package docgeni





# [0.1.0-alpha.5](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.4...v0.1.0-alpha.5) (2020-05-27)


### Bug Fixes

* **core:** ensure assets content dir exists ([5dcb7ce](https://github.com/docgeni/docgeni/commit/5dcb7ce63a23b8359557a16f0ed13da48c9827d6))





# [0.1.0-alpha.4](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.3...v0.1.0-alpha.4) (2020-05-27)


### Features

* **template:** redirect first channel page when home meta is null #INFR-512 ([f1ba43a](https://github.com/docgeni/docgeni/commit/f1ba43a5953f7726b8bc9e7b829973b57fbcb53b)), closes [#INFR-512](https://github.com/docgeni/docgeni/issues/INFR-512)





# [0.1.0-alpha.3](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.2...v0.1.0-alpha.3) (2020-05-27)


### Bug Fixes

* don't throw error when libs is null or empty ([4783960](https://github.com/docgeni/docgeni/commit/47839609e7ebe88d530222c542da95ab574c50ee))


# [0.1.0-alpha.2](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.1...v0.1.0-alpha.2) (2020-05-27)


### Bug Fixes

* add docgen to package.json 's bin ([5a1a7c2](https://github.com/docgeni/docgeni/commit/5a1a7c209b3f4b576977d5d8587ac4bfb9a1ff60))

# [0.1.0-alpha.1](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.0...v0.1.0-alpha.1) (2020-05-27)


### Bug Fixes

* build cli package lib exclude src ([e18048d](https://github.com/docgeni/docgeni/commit/e18048d23d10a35ee70f78dda057183102e913d9))

# [0.1.0-alpha.0](https://github.com/docgeni/docgeni/compare/v0.0.1-alpha.0...v0.1.0-alpha.0) (2020-05-26)


### Bug Fixes

* add example(alib-foo-basic-example) for getting started ([a9e20df](https://github.com/docgeni/docgeni/commit/a9e20df0615aa367a601bb66c12df94dd69aefd9))


### Features

* **core:** can't compile docs when docsPath is null or empty ([bcc3239](https://github.com/docgeni/docgeni/commit/bcc3239f9842b2a62e24eeea2b3e1fe7e301b549))
* **core:** add generate navigations for locales #INFR-424 ([#19](https://github.com/docgeni/docgeni/issues/19)) ([1ca9f06](https://github.com/docgeni/docgeni/commit/1ca9f060714e09b1f5accd6717ec968161ccbe5c)), closes [#INFR-424](https://github.com/docgeni/docgeni/issues/INFR-424) [#INFR-424](https://github.com/docgeni/docgeni/issues/INFR-424) [#INFR-424](https://github.com/docgeni/docgeni/issues/INFR-424)
* **core:** dynamic generate examples and load in component detail page runtime ([d8023c0](https://github.com/docgeni/docgeni/commit/d8023c04ebbbb974c505166b91a4b6c9ab29f4ab))
* **core:** generate component examples and example loaders #INFR-324 ([66999eb](https://github.com/docgeni/docgeni/commit/66999eba07eca35919589fa3e5aee9e9010f5c10)), closes [#INFR-324](https://github.com/docgeni/docgeni/issues/INFR-324)
* **core:** generate highlighted examples and show it #INFR-479 ([0709518](https://github.com/docgeni/docgeni/commit/0709518db660382c343275c88754a3833d4a8ee0)), closes [#INFR-479](https://github.com/docgeni/docgeni/issues/INFR-479)
* **core:** generate navs and docs content html files by docs folder #INFR-331 ([7192d77](https://github.com/docgeni/docgeni/commit/7192d771d5c390a9373c3176f2cbf4aa5e58d96a)), closes [#INFR-331](https://github.com/docgeni/docgeni/issues/INFR-331)
* **core:** inline example support #INFR-478 ([34f7173](https://github.com/docgeni/docgeni/commit/34f7173bf4b514101a536d670d3416a574b052da)), closes [#INFR-478](https://github.com/docgeni/docgeni/issues/INFR-478)
* **core:** lib support categories config and refactor interfaces #INFR-330 ([bdc71a4](https://github.com/docgeni/docgeni/commit/bdc71a4f4569ef76b6614815fbb7f971d54a62ae)), closes [#INFR-330](https://github.com/docgeni/docgeni/issues/INFR-330)
* **core:** recompile watch docs and lib change first version #INFR-480 ([7b2eb5d](https://github.com/docgeni/docgeni/commit/7b2eb5d43a2700469147781e672452a31aa71947)), closes [#INFR-480](https://github.com/docgeni/docgeni/issues/INFR-480)
* **core:** support markdown doc highlight #INFR-470 ([e63826a](https://github.com/docgeni/docgeni/commit/e63826aa50c63e9f728002135618fc03db1daf66)), closes [#INFR-470](https://github.com/docgeni/docgeni/issues/INFR-470)
* **core:** use index.md‘s  front matter represent category #INFR-488 ([a1a9a55](https://github.com/docgeni/docgeni/commit/a1a9a551280676e72cc508cc6bf60ec016391b14)), closes [#INFR-488](https://github.com/docgeni/docgeni/issues/INFR-488)
* **template:** add component viewer and doc viewer show diff docs #INFR-158 ([d6a1ddb](https://github.com/docgeni/docgeni/commit/d6a1ddb724526c856df17696e8a45cfcea69a5fc)), closes [#INFR-158](https://github.com/docgeni/docgeni/issues/INFR-158)
* **template:** add content-view component #INFR-374 ([668adf4](https://github.com/docgeni/docgeni/commit/668adf47df5a99432ba4477ce57f9689e6e1cd0f)), closes [#INFR-374](https://github.com/docgeni/docgeni/issues/INFR-374)
* **template:** add copier service and use it in example viewer, change doc content styles #INFR-375 ([f7cf619](https://github.com/docgeni/docgeni/commit/f7cf619fe2af8467c6f4db4851208287f40a31b4)), closes [#INFR-375](https://github.com/docgeni/docgeni/issues/INFR-375)
* **template:** add icon component, replace navbar icon and example viewer #INFR-372 ([9441fac](https://github.com/docgeni/docgeni/commit/9441fac89e1807610f45d3ea4b24231411d3cce7)), closes [#INFR-372](https://github.com/docgeni/docgeni/issues/INFR-372)
* **template:** component viewer style change, add nav scss, and refactor all template scss #INFR-320 ([35db888](https://github.com/docgeni/docgeni/commit/35db888d84a61a735ab215fb061f879053b133fa)), closes [#INFR-320](https://github.com/docgeni/docgeni/issues/INFR-320)
* **template:** show live example use markdown stynx #INFR-321 ([f420511](https://github.com/docgeni/docgeni/commit/f4205119b2cb0e19b81a4831e36117143c41566d)), closes [#INFR-321](https://github.com/docgeni/docgeni/issues/INFR-321)
* **template:** sidebar styles improve #INFR-319 ([af9c84d](https://github.com/docgeni/docgeni/commit/af9c84daf55aa455fc6a59024717206f1cfe3796)), closes [#INFR-319](https://github.com/docgeni/docgeni/issues/INFR-319)
* **template:** switch example source tabs #INFR-323 ([cc9e8da](https://github.com/docgeni/docgeni/commit/cc9e8da9a4cbfb35f0ec16301181f1a361c54f14)), closes [#INFR-323](https://github.com/docgeni/docgeni/issues/INFR-323)
