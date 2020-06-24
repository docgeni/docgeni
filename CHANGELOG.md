# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
