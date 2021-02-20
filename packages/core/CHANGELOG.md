# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.6.0-next.7](https://github.com/docgeni/docgeni/compare/v0.6.0-next.6...v0.6.0-next.7) (2021-02-20)


### Bug Fixes

* **core:** generate example module keys exclude components with out examples #INFR-1644 ([8acbbb8](https://github.com/docgeni/docgeni/commit/8acbbb8a63755d6e8fb218b4ea4cae5704f3c309)), closes [#INFR-1644](https://github.com/docgeni/docgeni/issues/INFR-1644)





# [0.6.0-next.6](https://github.com/docgeni/docgeni/compare/v0.6.0-next.5...v0.6.0-next.6) (2021-02-20)


### Bug Fixes

* **core:** fix windows err about spawn and cross-env #INFR-1574 ([3750db8](https://github.com/docgeni/docgeni/commit/3750db82b4b539a3560de91b7b1a6c89bffb0972)), closes [#INFR-1574](https://github.com/docgeni/docgeni/issues/INFR-1574)
* **core:** should remove example highlighted content from EXAMPLE_COMPONENTS #INFR-1644 ([9bd7077](https://github.com/docgeni/docgeni/commit/9bd7077e628c688a8e2bb47ec11077a661892179)), closes [#INFR-1644](https://github.com/docgeni/docgeni/issues/INFR-1644)





# [0.6.0-next.5](https://github.com/docgeni/docgeni/compare/v0.6.0-next.4...v0.6.0-next.5) (2021-01-18)


### Bug Fixes

* **core:** should not throw error when exclude is undefined ([0a8999e](https://github.com/docgeni/docgeni/commit/0a8999e9990c3641a9a3ab16040f7407cc951205))





# [0.6.0-next.4](https://github.com/docgeni/docgeni/compare/v0.6.0-next.3...v0.6.0-next.4) (2021-01-18)


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

**Note:** Version bump only for package @docgeni/core





# [0.6.0-next.0](https://github.com/docgeni/docgeni/compare/v0.5.9...v0.6.0-next.0) (2021-01-02)


### Features

* support lite mode and refactor lib and doc builder ([6e72eba](https://github.com/docgeni/docgeni/commit/6e72eba89047e670b8fe1087725183b697b1f669))





## [0.5.8](https://github.com/docgeni/docgeni/compare/v0.5.7...v0.5.8) (2020-12-29)


### Features

* **template:** upgrade ng to 10.0.0 ([63af2be](https://github.com/docgeni/docgeni/commit/63af2be1f775bd3f8d86da83f280dffe87387092))





## [0.5.7](https://github.com/docgeni/docgeni/compare/v0.5.6...v0.5.7) (2020-12-05)


### Bug Fixes

* **template:** img max width 100% ([5ce156c](https://github.com/docgeni/docgeni/commit/5ce156c8b76a3c09480be8f304ec575efd9a9b1d))


### Features

* **template:** beautify style for navbar and api table ([a5b1a2c](https://github.com/docgeni/docgeni/commit/a5b1a2c7fae3937642a87ef723c7dd54c349159d))





## [0.5.6](https://github.com/docgeni/docgeni/compare/v0.5.5...v0.5.6) (2020-08-28)

**Note:** Version bump only for package @docgeni/core





## [0.5.5](https://github.com/docgeni/docgeni/compare/v0.5.4...v0.5.5) (2020-08-28)


### Features

* **template:** change api doc style and generate json files ([b6404d4](https://github.com/docgeni/docgeni/commit/b6404d4982a9770e51c87e007f666db49fddc31f))
* **template:** support default and angular theme #INFR-606 ([#59](https://github.com/docgeni/docgeni/issues/59)) ([b64a246](https://github.com/docgeni/docgeni/commit/b64a24698a4c23366df68254d81b13b00350bc65)), closes [#INFR-606](https://github.com/docgeni/docgeni/issues/INFR-606)





## [0.5.4](https://github.com/docgeni/docgeni/compare/v0.5.3...v0.5.4) (2020-07-14)

**Note:** Version bump only for package @docgeni/core





## [0.5.3](https://github.com/docgeni/docgeni/compare/v0.5.2...v0.5.3) (2020-07-11)

**Note:** Version bump only for package @docgeni/core





## [0.5.2](https://github.com/docgeni/docgeni/compare/v0.5.1...v0.5.2) (2020-07-11)


### Bug Fixes

* **core:** exclude index.md source file for example dir ([dc64b53](https://github.com/docgeni/docgeni/commit/dc64b53261c08327c996e64eb921bd58555ad888))





## [0.5.1](https://github.com/docgeni/docgeni/compare/v0.5.0...v0.5.1) (2020-07-11)

**Note:** Version bump only for package @docgeni/core





# [0.5.0](https://github.com/docgeni/docgeni/compare/v0.4.0...v0.5.0) (2020-06-26)

**Note:** Version bump only for package @docgeni/core





# [0.4.0](https://github.com/docgeni/docgeni/compare/v0.3.0...v0.4.0) (2020-06-25)


### Bug Fixes

* **core:** category support front-matter path ([bebf0cc](https://github.com/docgeni/docgeni/commit/bebf0cca40f89e8f866fd0cf5d6203554716645f))





# [0.3.0](https://github.com/docgeni/docgeni/compare/v0.2.1...v0.3.0) (2020-06-24)

**Note:** Version bump only for package @docgeni/core





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


### Features

* **core:** add include for lib support subdir components #INFR-662 ([ee3a255](https://github.com/docgeni/docgeni/commit/ee3a25524ebf0a5b39cefd25ee362c5d0429e03e)), closes [#INFR-662](https://github.com/docgeni/docgeni/issues/INFR-662)
* **core:** sort lib components by order, and support example front-matter #INFR-643 ([3df0d03](https://github.com/docgeni/docgeni/commit/3df0d030ad66bbe5b3bc839c760fb70b73563f5b)), closes [#INFR-643](https://github.com/docgeni/docgeni/issues/INFR-643)





# [0.1.0-alpha.11](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.10...v0.1.0-alpha.11) (2020-06-12)


### Bug Fixes

* **cli:** serve command and rename cmdOptions to cmdArgs ([0332e25](https://github.com/docgeni/docgeni/commit/0332e257767d1c9e090f3dd43285c434a9c15247))
* **template:** hide locale select when only has one locale ([8363dec](https://github.com/docgeni/docgeni/commit/8363dec219d1a9aa784003005c5ab476d0c5a681))





# [0.1.0-alpha.10](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.9...v0.1.0-alpha.10) (2020-06-11)


### Features

* **core:** add cutome logoUrl config,  default show docgeni logo #INFR-604 ([4d00039](https://github.com/docgeni/docgeni/commit/4d00039ecf6e4d3bc9741d87861eff3bab406909)), closes [#INFR-604](https://github.com/docgeni/docgeni/issues/INFR-604)
* **core:** integrate angular cli serve and build command ([9e89803](https://github.com/docgeni/docgeni/commit/9e898037f1794564279d5d1a26ad55a739bf0f5e))
* **template:** example load support ViewEngine, only dynamic load in Ivy #INFR-613 ([557480d](https://github.com/docgeni/docgeni/commit/557480ded691cb7128009dc4d146c28cb7989d17)), closes [#INFR-613](https://github.com/docgeni/docgeni/issues/INFR-613)





# [0.1.0-alpha.9](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.8...v0.1.0-alpha.9) (2020-06-06)


### Bug Fixes

* remove nav item when there is no doc or examples ([3903799](https://github.com/docgeni/docgeni/commit/3903799697f165b2b851fb8e3542618307288cd1))





# [0.1.0-alpha.8](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.7...v0.1.0-alpha.8) (2020-06-03)


### Features

* **core:** lib support exclude and doc or examples can be empty #INFR-564 ([c6fae1f](https://github.com/docgeni/docgeni/commit/c6fae1f01aa70b564b54678083b322d38129c1d8)), closes [#INFR-564](https://github.com/docgeni/docgeni/issues/INFR-564)





# [0.1.0-alpha.7](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.6...v0.1.0-alpha.7) (2020-05-27)

**Note:** Version bump only for package @docgeni/core





# [0.1.0-alpha.6](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.5...v0.1.0-alpha.6) (2020-05-27)

**Note:** Version bump only for package @docgeni/core





# [0.1.0-alpha.5](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.4...v0.1.0-alpha.5) (2020-05-27)


### Bug Fixes

* **core:** ensure assets content dir exists ([5dcb7ce](https://github.com/docgeni/docgeni/commit/5dcb7ce63a23b8359557a16f0ed13da48c9827d6))





# [0.1.0-alpha.4](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.3...v0.1.0-alpha.4) (2020-05-27)


### Features

* **template:** redirect first channel page when home meta is null #INFR-512 ([f1ba43a](https://github.com/docgeni/docgeni/commit/f1ba43a5953f7726b8bc9e7b829973b57fbcb53b)), closes [#INFR-512](https://github.com/docgeni/docgeni/issues/INFR-512)





# [0.1.0-alpha.3](https://github.com/docgeni/docgeni/compare/v0.1.0-alpha.2...v0.1.0-alpha.3) (2020-05-27)


### Bug Fixes

* don't throw error when libs is null or empty ([4783960](https://github.com/docgeni/docgeni/commit/47839609e7ebe88d530222c542da95ab574c50ee))





# [0.1.0-alpha.0](https://github.com/docgeni/docgeni/compare/v0.0.1-alpha.0...v0.1.0-alpha.0) (2020-05-26)


### Features

* **code:** can't compile docs when docsPath is null 0r empty ([bcc3239](https://github.com/docgeni/docgeni/commit/bcc3239f9842b2a62e24eeea2b3e1fe7e301b549))
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
* **template:** component viewer style change, add nav scss, and refactor all template scss #INFR-320 ([35db888](https://github.com/docgeni/docgeni/commit/35db888d84a61a735ab215fb061f879053b133fa)), closes [#INFR-320](https://github.com/docgeni/docgeni/issues/INFR-320)
* **template:** show live example use markdown stynx #INFR-321 ([f420511](https://github.com/docgeni/docgeni/commit/f4205119b2cb0e19b81a4831e36117143c41566d)), closes [#INFR-321](https://github.com/docgeni/docgeni/issues/INFR-321)
