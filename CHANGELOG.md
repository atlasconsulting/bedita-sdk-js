## [3.2.1](https://github.com/atlasconsulting/bedita-sdk-js/compare/v3.2.0...v3.2.1) (2025-02-26)


### Bug Fixes

* export RemoveLinksInterceptor ([1e85b07](https://github.com/atlasconsulting/bedita-sdk-js/commit/1e85b07c719fe2de26b0e928de0b36022b02e330))

# [3.2.0](https://github.com/atlasconsulting/bedita-sdk-js/compare/v3.1.2...v3.2.0) (2025-02-26)


### Features

* add RemoveLinksInterceptor ([72daafa](https://github.com/atlasconsulting/bedita-sdk-js/commit/72daafa6e29a09d02a19093efdac47f744d1f2ea))

## [3.1.2](https://github.com/atlasconsulting/bedita-sdk-js/compare/v3.1.1...v3.1.2) (2024-09-02)


### Bug Fixes

* upgrade axios for security issue ([6995368](https://github.com/atlasconsulting/bedita-sdk-js/commit/699536832f6aaf8b802d9d7b19f4408d0d90dcaf))

## [3.1.1](https://github.com/atlasconsulting/bedita-sdk-js/compare/v3.1.0...v3.1.1) (2023-11-13)


### Bug Fixes

* **deps:** update axios for fix vulnerability ([26f7b2e](https://github.com/atlasconsulting/bedita-sdk-js/commit/26f7b2e357dc203d0361ba494d7d60a67d8a077b))

# [3.1.0](https://github.com/atlasconsulting/bedita-sdk-js/compare/v3.0.0...v3.1.0) (2023-08-03)


### Features

* add ApiProvider.has() method ([d2ad8b2](https://github.com/atlasconsulting/bedita-sdk-js/commit/d2ad8b2f63fae74a68f48edf7efaf70c03a67176))

# [3.0.0](https://github.com/atlasconsulting/bedita-sdk-js/compare/v2.1.0...v3.0.0) (2023-08-03)


### Features

* **deps:** upgrade axios to v1 ([a650a4c](https://github.com/atlasconsulting/bedita-sdk-js/commit/a650a4c3408c18e22fe05e1f3a203d9bae555ddc))


### BREAKING CHANGES

* **deps:** upgrading axios to new major version can lead to broken code in apps using bedita-sdk

# [3.0.0-beta.2](https://github.com/atlasconsulting/bedita-sdk-js/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2023-02-20)


### Features

* upload method ([d0d5108](https://github.com/atlasconsulting/bedita-sdk-js/commit/d0d5108c9dd1a27bfdf0f7c8fa4e5e35a7787b03))

# [2.1.0](https://github.com/atlasconsulting/bedita-sdk-js/compare/v2.0.0...v2.1.0) (2023-02-20)


### Features

* upload method ([d0d5108](https://github.com/atlasconsulting/bedita-sdk-js/commit/d0d5108c9dd1a27bfdf0f7c8fa4e5e35a7787b03))

# [3.0.0-beta.1](https://github.com/atlasconsulting/bedita-sdk-js/compare/v2.0.0...v3.0.0-beta.1) (2023-02-02)


### Features

* **deps:** upgrade axios to v1 ([a650a4c](https://github.com/atlasconsulting/bedita-sdk-js/commit/a650a4c3408c18e22fe05e1f3a203d9bae555ddc))


### BREAKING CHANGES

* **deps:** upgrading axios to new major version can lead to broken code in apps using bedita-sdk

# [2.0.0](https://github.com/atlasconsulting/bedita-sdk-js/compare/v1.3.0...v2.0.0) (2023-01-13)


### Bug Fixes

* export StorageAdapterInterface ([06ea780](https://github.com/atlasconsulting/bedita-sdk-js/commit/06ea78008812946b1ee901a2e6c93a5fc184c9bf))


### Features

* add option to replace main object language with translation ([42fbd16](https://github.com/atlasconsulting/bedita-sdk-js/commit/42fbd16ee8a17136aa1feebfccb439f0be2a597b))
* introduce async storage adapters ([203f229](https://github.com/atlasconsulting/bedita-sdk-js/commit/203f229a3ba4ee78e1496201206dbb3fa8598d5e))


### BREAKING CHANGES

* change the storage access from sync to async.
Done  for more flexibility.

# [2.0.0-beta.2](https://github.com/atlasconsulting/bedita-sdk-js/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2022-10-27)


### Features

* add option to replace main object language with translation ([42fbd16](https://github.com/atlasconsulting/bedita-sdk-js/commit/42fbd16ee8a17136aa1feebfccb439f0be2a597b))

# [2.0.0-beta.1](https://github.com/atlasconsulting/bedita-sdk-js/compare/v1.3.0...v2.0.0-beta.1) (2022-09-06)


### Bug Fixes

* export StorageAdapterInterface ([06ea780](https://github.com/atlasconsulting/bedita-sdk-js/commit/06ea78008812946b1ee901a2e6c93a5fc184c9bf))


### Features

* introduce async storage adapters ([203f229](https://github.com/atlasconsulting/bedita-sdk-js/commit/203f229a3ba4ee78e1496201206dbb3fa8598d5e))


### BREAKING CHANGES

* change the storage access from sync to async.
Done  for more flexibility.

# [1.3.0](https://github.com/atlasconsulting/bedita-sdk-js/compare/v1.2.0...v1.3.0) (2022-08-01)


### Bug Fixes

* **interceptors:** do not remove interceptor already added ([3be8eb1](https://github.com/atlasconsulting/bedita-sdk-js/commit/3be8eb14a3ee62c57be42fe87904d16f3dcb69d5))


### Features

* allow to include relationships in getUserAuth ([8cb5825](https://github.com/atlasconsulting/bedita-sdk-js/commit/8cb582554c13cfb0aa7b88e05e31d2edbd1dd20d))

# [1.2.0](https://github.com/atlasconsulting/bedita-sdk-js/compare/v1.1.0...v1.2.0) (2022-07-28)


### Features

* handle client credentials flow ([8437e9f](https://github.com/atlasconsulting/bedita-sdk-js/commit/8437e9f6557d1c9429e1430f0ae104817c681483))

# [1.1.0](https://github.com/atlasconsulting/bedita-sdk-js/compare/v1.0.0...v1.1.0) (2022-01-31)


### Features

* update main dependencies ([a1d8145](https://github.com/atlasconsulting/bedita-sdk-js/commit/a1d8145cb76283c74fcfc6dc0b3bdd0714e0470f))

# 1.0.0 (2022-01-28)


### Bug Fixes

* clone config ([e4e0519](https://github.com/atlasconsulting/bedita-sdk-js/commit/e4e05191bc7c4570dce46d9f4d44eacb58081df0))
* eslint ad dev dependency ([a9f2521](https://github.com/atlasconsulting/bedita-sdk-js/commit/a9f25210755d9d9b91f287df6e701026f832127c))
* no-inferrable-types ([5815ecc](https://github.com/atlasconsulting/bedita-sdk-js/commit/5815ecc5b05db748d3152a75791afb0635dbc2ab))
* no-redundant-jsdoc ([98bca18](https://github.com/atlasconsulting/bedita-sdk-js/commit/98bca189d9b4f14a4ef2f51cfbd6528a8c8483d9))
* prefer-const ([d99bb38](https://github.com/atlasconsulting/bedita-sdk-js/commit/d99bb38b7cb3e8dc574840a9f1579170ac63e7c7))
* prefer-const ([6aae3b0](https://github.com/atlasconsulting/bedita-sdk-js/commit/6aae3b05903f55fba86466cecb33b1ed8c433b05))
* quotemark ([80365fb](https://github.com/atlasconsulting/bedita-sdk-js/commit/80365fb3ca5501f390044fd0460f582ee5afbdd5))
* use tslint ([c017fc8](https://github.com/atlasconsulting/bedita-sdk-js/commit/c017fc8c9c37aded0b116a869b037baf4422a4c1))


### Features

* add api provider ([30a1b30](https://github.com/atlasconsulting/bedita-sdk-js/commit/30a1b3011ad71f6ae1d811190d0ed778c7c77f65))
* add linter ([c28416f](https://github.com/atlasconsulting/bedita-sdk-js/commit/c28416f0c6da53c605fbd3519d64626b77d00b80))
* export packages items ([8e6acc9](https://github.com/atlasconsulting/bedita-sdk-js/commit/8e6acc9e98f15b1a490a4b7cdc57f183282aa227))
* first commit 🎉️ ([387745d](https://github.com/atlasconsulting/bedita-sdk-js/commit/387745d9753b5d34f3f991d24d1a7ad659a7cb64))
* update ([bc00764](https://github.com/atlasconsulting/bedita-sdk-js/commit/bc0076475844a843dd4ed7e65e7e9f531c4a2d84))
* update tslint.json ([8d2ae44](https://github.com/atlasconsulting/bedita-sdk-js/commit/8d2ae44a8669eb83e40940d34d9faa56d3d4f581))
* update typescript ([c2d2c66](https://github.com/atlasconsulting/bedita-sdk-js/commit/c2d2c66a99c451265e58603ce8a6f09ee8747dd5))
