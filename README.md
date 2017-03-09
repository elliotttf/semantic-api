# semantic-api

### Intent
This document will describe how to version a REST API in a [semantic](http://semver.org/)
manner, providing predictable releases free of breaking changes. Some of the
workflow may not line up with your individual needs, but the overall concepts
should be widely applicable.

### Definitions
The semantic version pieces that we will be discussing include the major, minor,
and patch versions as well as prerelease tags. For these definitions, consider
the version `v1.2.3-alpha.0`. All semantic versions in use _must_ have a major,
minor, and patch version and _may_ have a prerelease tag.

* Major – `1` in our example, the left-most numeral. If this number changes it
  indicates that the API has introduced breaking changes which _may_ cause
  consumers to break without making code changes of their own.
* Minor – `2` in our example, the second left-most numeral. If this number
  changes it indicates that new features have been added to the API. There will
  not be breaking changes for consumers but new functionality will be exposed.
* Patch – `3` in our example, the third left-most numeral. If this number
  changes it indicates a bug-fix. There will not be breaking changes for
  consumers but behavior may change based on the fix.
* Prerelease tag – `alpha.0` in our example, anything following a `-` in the
  version string. These tags will be used prior
  to a version of the API becoming stable. Consumers _may_ request them but _must_
  understand the different kinds of prerelease tags and what they mean:
  * `alpha` – the most unstable prerelease tags. Changes between alphas _may_
    introduce breaking changes but _must not_ break any previously stable
    features.

    For example: renaming a field: `newField` to `newFields` between `alpha.0`
    and `alpha.1` is acceptable, but renaming `oldField` to `oldFields` between
    `1.2.2` and `1.2.3-alpha.0` is not acceptable.
  * `beta` – a more stable development state. Breaking changes and new features
     _must not_ be introduced at this point. Only bug fixes and refinements on
     existing features are allowed.
  * `rc` – the most stable development state. Breaking changes, new features,
    and refinements _must not_ be introduced at this point. Only bug fixes are
    allowed.

### Release workflow
Development and unstable API releases will happen in `dev` environments. After
confirmation of a feature set as “stable enough” a stable release candidate
will be promoted to a staging environment. After confirmation of the release
candidate, a stable version will be released to production. Conceptually this
might look like this:

* Dev
  * `v1.0.0-alpha.1` - needs more changes so...
  * `v1.0.0-alpha.2` - confirmed stable enough to move forward
* Stage
  * `v1.0.0-rc.1` - needs more changes so…
  * `v1.0.0-rc.2` - confirmed stable enough to move forward
* Prod
  * `v1.0.0` - locked version of previously most stable rc, i.e. `v1.0.0-rc.2`

If a `beta` or `rc` release is created the previously defined rules about feature
and fix inclusion _must_ be adhered to, or the `beta` or `rc` in question _must_
be abandoned and officially unsupported.

For example: `v1.2.3-alpha.5` introduces a new feature that is confirmed to be
stable enough to move forward so `v1.2.3-beta.0` is cut. Later, it is decided
a breaking change to the new feature in `v1.2.3-alpha.5` needs to be introduced
in `v1.2.3`. At this point `v1.2.3-beta.0` _must_ be removed and `v1.2.3-alpha.6`
added.

### Consumer request workflow
Consumers _should_ interact with the API using [npm style](https://docs.npmjs.com/getting-started/semantic-versioning)
semver ranges. This gives maximum flexibility to API consumers, allowing them
to “play it safe” and lock to a given version of the API, or provide a semver
range which will allow subsequent versions to be received without modifying the
consumer code.

Consumers _must not_ lock to a prerelease tag, e.g. `v1.2.3-rc.0`. The requests
will be rejected as additional changes could be introduced before the API becomes
stable.

Consumers _may_ request a prerelease tag with a range, e.g. `^v1.2.3-rc.0`. This
will resolve in the way described by npm, but has some important features that
are worth mentioning here:

Range requests against prerelease tags will receive the next prerelease or the
next stable version that satisfies the range.

For example: a request for `^v1.2.3-alpha.1` will receive the following versions
when/if they are available:
* `v1.2.3-alpha.2`
* `v1.2.3-beta.0`
* `v1.2.3-rc.0`
* `v1.2.3`
* `v1.2.4`
* `v1.3.0`

The same request would not receive `v1.3.0-alpha.0`, or any prereleases for that
matter, on versions outside of the major, minor, and patch versions defined by
the original prerelease range.

Consumers _may_ lock to a stable version or request a range from a stable version,
e.g. `v1.2.3` and `^v1.2.3`. While `v1.2.3` is the latest stable version in the
`v1` family, these two requests will resolve the same way. As soon as a new minor
or patch version is added the request for `^v1.2.3` would receive the new version.

### Server considerations
Implementing servers _should_ provide a `meta` style attribute to all responses
that describes the version that the request resolved to. In JSON API with a
request for `/^v1.0.0/authors` and a highest stable version of `v1.2.3` this
would look like this:

```
{
  “data”: [],
  “meta” : {
    “version”: “v1.2.3”
  }
}
```

Implementing servers _should_ enforce strict semantic version matching and
reject any request for an invalid version. This approach is preferable over
attempting to route invalid or partial versions (e.g. `v1.2`) to the correct
and valid version.

