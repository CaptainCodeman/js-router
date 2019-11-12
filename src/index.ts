type Parsed = [ RegExp, string[] ]

// Parses a URL pattern such as `/users/:id`
// and builds and returns a regex that can be used to
// match said pattern. Credit for these
// regexes belongs to Jeremy Ashkenas and the
// other maintainers of Backbone.js
//
// It has been modified for extraction of
// named paramaters from the URL
const parse = (pattern: string): Parsed => {
    const names: string[] = []

    // regexes borrowed from backbone
    pattern = pattern
        // escapeRegExp
        .replace(/[\-{}\[\]+?.,\\\^$|#\s]/g, '\\$&')
        // optional param
        .replace(/\((.*?)\)/g, '(?:$1)?')
        // named param
        .replace(/(\(\?)?:\w+/g, (match, optional) => {
            names.push(match.slice(1))
            return optional ? match : '([^/?]+)'
        })
        // splatParam
        .replace(/\*/g, () => {
            names.push('path')
            return '([^?]*?)'
        })

    return [ new RegExp('^' + pattern + '(?:\\?([\\s\\S]*))?$'), names ]
}

export default (routes: { [path: string]: any }, fallback: any = null) => {
    // loop through each route we're
    // and build the shell of our
    // route cache.
    const patterns = Object.keys(routes).map(pattern => ({
        // ...parsePattern(pattern),
        page: routes[pattern],
        pattern,
    }))

    const cache: Parsed[] = []

    // main result is a function that can be called
    // with the url
    return (url: string) => {
        for (let i = 0; i < patterns.length; i++) {
            const route = patterns[i]

            let parsed = cache[i]
            if (!parsed) {
                parsed = parse(route.pattern)
                cache[i] = parsed
            }

            const match = parsed[0].exec(url)

            if (match) {
                const result = match.slice(1, -1)

                // reduce our match to an object of named paramaters
                // we've extracted from the url
                const params = result.reduce((obj, val, index) => {
                    if (val) {
                        obj[parsed[1][index]] = val
                    }
                    return obj
                }, {})

                return {
                    ...route,
                    url,
                    params,
                }
            }
        }

        return fallback && {
            url,
            page: fallback,
        }
    }
}
