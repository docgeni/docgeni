# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.7](https://github.com/docgeni/docgeni/compare/v1.0.6...v1.0.7) (2021-07-02)


### Bug Fixes

* **core:** remove default description, default is empty #OSP-154 ([d00bdc8](https://github.com/docgeni/docgeni/commit/d00bdc8b5d6e7713c893c1ac41199f4d7a7e5689)), closes [#OSP-154](https://github.com/docgeni/docgeni/issues/OSP-154)
* **template:** set text-decoration: none to dg-tab-link hover fix confict ([04d0a5f](https://github.com/docgeni/docgeni/commit/04d0a5f91a7a5aad24b0c92b44322ce9dbc79eee))


### Features

* **template:** support en-us and zh-cn lang for overview and example #OSP-118 ([#198](https://github.com/docgeni/docgeni/issues/198)) ([c69a71a](https://github.com/docgeni/docgeni/commit/c69a71a3b982faa11e03a21917155c3e0c827bad)), closes [#OSP-118](https://github.com/docgeni/docgeni/issues/OSP-118)





## [1.0.5](https://github.com/docgeni/docgeni/compare/v1.0.4...v1.0.5) (2021-07-02)


### Bug Fixes

* **template:** remove $yiq warning use math.div ([7c68eb3](https://github.com/docgeni/docgeni/commit/7c68eb328fa342b3ceb1975b7c9f05f8c980f3ab))
* **template:** remove max-height: 100vh for dg-doc-viewer ([97e4944](https://github.com/docgeni/docgeni/commit/97e4944a51d17e8740d79d2ef5da14d35350866d))
* **template:** replace 1000 to 100 for fix $yiq style ([4ef2a5b](https://github.com/docgeni/docgeni/commit/4ef2a5b4e90bfaa8dcfd5bd66cab2d69a0ca4f51))


### Features

* **template:** auto switch to browser lang when it supported ([#191](https://github.com/docgeni/docgeni/issues/191)) ([5c72764](https://github.com/docgeni/docgeni/commit/5c7276425e452857a1d0392cacf06bed41356a46))


### Reverts

* revert $yiq use slash from [@use](https://github.com/use) "sass:math"; ([33d0265](https://github.com/docgeni/docgeni/commit/33d0265d914cd63f1a14e07acc9ecae66215d49f))





## [1.0.3](https://github.com/docgeni/docgeni/compare/v1.0.2...v1.0.3) (2021-06-17)


### Bug Fixes

* **template:** set position sticky to dg-toc and add dg-scroll-container ([434b244](https://github.com/docgeni/docgeni/commit/434b24479aec91652bc2d647797c58386af0adff))


### Features

* **template:** add language switch in lite mode ([#182](https://github.com/docgeni/docgeni/issues/182)) ([5e80d2c](https://github.com/docgeni/docgeni/commit/5e80d2c53b6a764ba00b595e3fed55fb231c64a4))





## [1.0.2](https://github.com/docgeni/docgeni/compare/v1.0.1...v1.0.2) (2021-06-07)


### Features

* **template:** update open mode to `over` from `push` for sidebar ([#173](https://github.com/docgeni/docgeni/issues/173)) ([8996ace](https://github.com/docgeni/docgeni/commit/8996ace1fd91e0b6f27f389f570f6a2998e2549a))





## [1.0.1](https://github.com/docgeni/docgeni/compare/v1.0.0...v1.0.1) (2021-05-31)


### Bug Fixes

* **template:** fix dg-doc-content and dg-examples styles ([4f502be](https://github.com/docgeni/docgeni/commit/4f502be2622004483f5ff7c3c3ad8434140279af))





# [1.0.0](https://github.com/docgeni/docgeni/compare/v1.0.0-beta.7...v1.0.0) (2021-05-20)


### Bug Fixes

* **template:** temp hide external icon for example viewer ([7dcfa11](https://github.com/docgeni/docgeni/commit/7dcfa11cf51a8bd4fb963b4c4aa0305c6fb9acd6))





# [1.0.0-beta.7](https://github.com/docgeni/docgeni/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2021-05-19)

**Note:** Version bump only for package @docgeni/template





# [1.0.0-beta.6](https://github.com/docgeni/docgeni/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-05-19)


### Bug Fixes

* **template:** fit responsive for nav and sidebar ([#158](https://github.com/docgeni/docgeni/issues/158)) ([ff4956f](https://github.com/docgeni/docgeni/commit/ff4956f15c180e2c14f09315f1468349b4c875a1))





# [1.0.0-beta.5](https://github.com/docgeni/docgeni/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-05-19)

**Note:** Version bump only for package @docgeni/template





# [1.0.0-beta.4](https://github.com/docgeni/docgeni/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-05-18)


### Bug Fixes

* **template:** shoule find component doc by path and importSpecifier ([1efe281](https://github.com/docgeni/docgeni/commit/1efe2810a34fe8673809d1978cda10f4c95169bd))





# [1.0.0-beta.3](https://github.com/docgeni/docgeni/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2021-05-15)


### Bug Fixes

* **core:** should export configurable properties for lib ([b504b1d](https://github.com/docgeni/docgeni/commit/b504b1dda971cc41db67f8a74fe4bce8130253bd))
* **template:** remove footer ([b52a4c1](https://github.com/docgeni/docgeni/commit/b52a4c1546fa604fe54630acc396cf8f41b68e1c))
* **template:** should get corrent content when there are two same paths in different channels #OSP-99 ([#144](https://github.com/docgeni/docgeni/issues/144)) ([597d060](https://github.com/docgeni/docgeni/commit/597d0600d7ba1545bb51081e6653b2a7f8809b5d)), closes [#OSP-99](https://github.com/docgeni/docgeni/issues/OSP-99)





# [1.0.0-beta.2](https://github.com/docgeni/docgeni/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2021-05-12)


### Bug Fixes

* **template:** fix toc href when has baseHref ([0121ae9](https://github.com/docgeni/docgeni/commit/0121ae9a809afc85eb3fc6fcfc769a6948f94404))
* **template:** set data-level according to highestLevel ([ecc5583](https://github.com/docgeni/docgeni/commit/ecc5583a164ac65f6ccb1730591e4ecee3e0e32c))





# [1.0.0-beta.1](https://github.com/docgeni/docgeni/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2021-04-01)


### Bug Fixes

* **template:** add timestamp for request navigations json to avoid browser cache old data ([7cf6123](https://github.com/docgeni/docgeni/commit/7cf6123fc76cf92773e6592306c6134b61e52c68))
* **template:** should redirect fisrt component when click component channel ([#120](https://github.com/docgeni/docgeni/issues/120)) ([abe9736](https://github.com/docgeni/docgeni/commit/abe97362294c62167bbc005e81bd30d4a31c0f94))
* **template:** should use default language when cache locale is not supported ([b16a188](https://github.com/docgeni/docgeni/commit/b16a1888c8aa4644c5b98409d774942616b67e3a))





# [1.0.0-beta.0](https://github.com/docgeni/docgeni/compare/v0.6.0-next.18...v1.0.0-beta.0) (2021-03-30)


### Bug Fixes

* **template:** remove home route only when there is route path is empty for lite mode ([2e525bb](https://github.com/docgeni/docgeni/commit/2e525bb8b6e4c983da50dd48934ee6510a411f97))
* **template:** should redirect to first doc when click channel and current route is under the channel ([#115](https://github.com/docgeni/docgeni/issues/115)) ([6bdf157](https://github.com/docgeni/docgeni/commit/6bdf157e3ebf70d89f045d6e1a498bcb4b03d0bd))





# [0.6.0-next.18](https://github.com/docgeni/docgeni/compare/v0.6.0-next.17...v0.6.0-next.18) (2021-03-25)


### Bug Fixes

* **template:** should redirect first doc when there are no docs in subfolder's parent folder ([bd708b4](https://github.com/docgeni/docgeni/commit/bd708b4d5b03474a06e470672de9cc8d9e9f0495))





# [0.6.0-next.17](https://github.com/docgeni/docgeni/compare/v0.6.0-next.16...v0.6.0-next.17) (2021-03-24)


### Bug Fixes

* **template:** update peerDependencies as * ([c1e8c4a](https://github.com/docgeni/docgeni/commit/c1e8c4a2f661d8d2be63ad1f7c3ffb573732d80c))





# [0.6.0-next.16](https://github.com/docgeni/docgeni/compare/v0.6.0-next.15...v0.6.0-next.16) (2021-03-24)


### Bug Fixes

* **template:** support 9.0.0 ([9fec5a0](https://github.com/docgeni/docgeni/commit/9fec5a0a74ad480d1facabf12364712ad1bbb772))
* **template:** update peerDependencies support angular 11 ([4615c9c](https://github.com/docgeni/docgeni/commit/4615c9c738a0680e52ef5e2d599bb602658da724))





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
* **core:** support config siteDir ([3f0ea8f](https://github.com/docgeni/docgeni/commit/3f0ea8ffd11de0dfce423c2cd04ab71089437cf8))
* **template:** show level in table of content ([#91](https://github.com/docgeni/docgeni/issues/91)) ([74baf15](https://github.com/docgeni/docgeni/commit/74baf1524bae37414cae448880428660ddb5917e)), closes [#OSP-12](https://github.com/docgeni/docgeni/issues/OSP-12)
* **toc:** stick toc in top ([4fb5d06](https://github.com/docgeni/docgeni/commit/4fb5d062e42213d9e3c086622e443f6e336475a3))





# [0.6.0-next.12](https://github.com/docgeni/docgeni/compare/v0.6.0-next.11...v0.6.0-next.12) (2021-03-11)

**Note:** Version bump only for package @docgeni/template





# [0.6.0-next.11](https://github.com/docgeni/docgeni/compare/v0.6.0-next.10...v0.6.0-next.11) (2021-02-25)

**Note:** Version bump only for package @docgeni/template





# [0.6.0-next.10](https://github.com/docgeni/docgeni/compare/v0.6.0-next.9...v0.6.0-next.10) (2021-02-24)

**Note:** Version bump only for package @docgeni/template





# [0.6.0-next.9](https://github.com/docgeni/docgeni/compare/v0.6.0-next.8...v0.6.0-next.9) (2021-02-22)

**Note:** Version bump only for package @docgeni/template





# [0.6.0-next.8](https://github.com/docgeni/docgeni/compare/v0.6.0-next.7...v0.6.0-next.8) (2021-02-20)

**Note:** Version bump only for package @docgeni/template





# [0.6.0-next.7](https://github.com/docgeni/docgeni/compare/v0.6.0-next.6...v0.6.0-next.7) (2021-02-20)

**Note:** Version bump only for package @docgeni/template





# [0.6.0-next.6](https://github.com/docgeni/docgeni/compare/v0.6.0-next.5...v0.6.0-next.6) (2021-02-20)

**Note:** Version bump only for package @docgeni/template





# [0.6.0-next.5](https://github.com/docgeni/docgeni/compare/v0.6.0-next.4...v0.6.0-next.5) (2021-01-18)

**Note:** Version bump only for package @docgeni/template





# [0.6.0-next.4](https://github.com/docgeni/docgeni/compare/v0.6.0-next.3...v0.6.0-next.4) (2021-01-18)


### Features

* **cli:** add angular build & serve command options contains port,deployUrl,baseHref support ([66dced5](https://github.com/docgeni/docgeni/commit/66dced546b7e291a56ce8aeafdf00d48fe4d967f))





# [0.6.0-next.3](https://github.com/docgeni/docgeni/compare/v0.6.0-next.2...v0.6.0-next.3) (2021-01-07)


### Bug Fixes

* **template:** export IsModeFullPipe and IsModeLitePipe and simply AppModule ([30c7491](https://github.com/docgeni/docgeni/commit/30c7491e4fe1a36323dde7381919766be259b359))


### Features

* **cli:** add [@angular](https://github.com/angular) dependencies to @docgeni/cli ([e408745](https://github.com/docgeni/docgeni/commit/e408745acb8c1e1f70237ff317e943c138e6e8ee))





# [0.6.0-next.1](https://github.com/docgeni/docgeni/compare/v0.6.0-next.0...v0.6.0-next.1) (2021-01-03)

**Note:** Version bump only for package @docgeni/template





# [0.6.0-next.0](https://github.com/docgeni/docgeni/compare/v0.5.9...v0.6.0-next.0) (2021-01-02)


### Features

* support lite mode and refactor lib and doc builder ([6e72eba](https://github.com/docgeni/docgeni/commit/6e72eba89047e670b8fe1087725183b697b1f669))





## [0.5.8](https://github.com/docgeni/docgeni/compare/v0.5.7...v0.5.8) (2020-12-29)


### Features

* **template:** upgrade ng to 10.0.0 ([63af2be](https://github.com/docgeni/docgeni/commit/63af2be1f775bd3f8d86da83f280dffe87387092))
