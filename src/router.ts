type Parsed = [RegExp, string[]]

/**
 * Routes<T> is the base type for route definitions. It maps a pattern string
 * to a value of type `T`. This value will be returned inside the `Result<T>`.
 * 
 * Type parameter `T` holds the type of the result, e.g. `string`.
 */
export type Routes<T> = { [pattern: string]: T }

/**
 * Result is the return type for matched route definitions. It augments the
 * value of type `T` from the `Routes<T>` (in the `page` field) by additional
 * route parameters, which have been stored in `params`.
 * 
 * If no matching pattern can be found for a URL, the result is `null`.
 */
export type Result<T> = {
    /**
     * page holds the value defined in the original mapping (see `Routes<T>`).
     */
    page: T
    /**
     * params holds a key value mapping of URL parameters, if the pattern
     * used any.
     */
    params: { [key: string]: any }
} | null

/**
 * Matcher defines the type of the routing function. A routing function will
 * take one string as input, the `url` and try to match it to the routes that
 * it has been created with. If no match has been found, it returns `null`.
 */
export type Matcher<T> = (url: string) => Result<T>

// Parses a URL pattern such as `/users/:id`
// and builds and returns a regex that can be used to
// match said pattern. Credit for these
// regexes belongs to Jeremy Ashkenas and the
// other maintainers of Backbone.js
//
// It has been modified for extraction of
// named parameters from the URL
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

    return [new RegExp('^' + pattern + '(?:\\?([\\s\\S]*))?$'), names]
}

/**
 * This factory that will create and return a routing function
 * (see `Matcher<T>`) from the routing configuration in `routes`.
 */
export default <T>(routes: Routes<T>): Matcher<T> => {
    // loop through each route we're
    // and build the shell of our
    // route cache.
    const patterns = Object.keys(routes)

    const cache: Parsed[] = []

    // main result is a function that can be called
    // with the url
    return (url: string): Result<T> => {
        for (let i = 0; i < patterns.length; i++) {
            const pattern = patterns[i]

            let parsed = cache[i]
            if (!parsed) {
                parsed = parse(pattern)
                cache[i] = parsed
            }

            const match = parsed[0].exec(url)

            if (match) {
                const result = match.slice(1, -1)

                // reduce our match to an object of named parameters
                // we've extracted from the url
                const params = result.reduce((obj, val, index) => {
                    if (val !== undefined) {
                        obj[parsed[1][index]] = val
                    }
                    return obj
                }, {})

                return {
                    page: routes[pattern],
                    params,
                }
            }
        }

        return null
    }
}
