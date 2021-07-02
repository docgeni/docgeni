# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
* **template:** replace url when navigate to channel paage from home ([e902f74](https://github.com/docgeni/docgeni/commit/e902f7457378f5b0eb2e8f9a406fbcccbfb55773))
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
