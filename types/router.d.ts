/**
 * Routes<T> is the base type for route definitions. It maps a pattern string
 * to a value of type `T`. This value will be returned inside the `Result<T>`.
 *
 * Type parameter `T` holds the type of the result, e.g. `string`.
 */
export declare type Routes<T> = {
    [pattern: string]: T;
};

/**
 * Result is the return type for matched route definitions. It augments the
 * value of type `T` from the `Routes<T>` (in the `page` field) by additional
 * route parameters, which have been stored in `params`.
 *
 * If no matching pattern can be found for a URL, the result is `null`.
 */
export declare type Result<T> = {
    /**
     * page holds the value defined in the original mapping (see `Routes<T>`).
     */
    page: T;
    /**
     * params holds a key value mapping of URL parameters, if the pattern
     * used any.
     */
    params: {
        [key: string]: any;
    };
} | null;

/**
 * Matcher defines the type of the routing function. A routing function will
 * take one string as input, the `url` and try to match it to the routes that
 * it has been created with. If no match has been found, it returns `null`.
 */
export declare type Matcher<T> = (url: string) => Result<T>;

declare const _default: <T>(routes: Routes<T>) => Matcher<T>;

/**
 * This factory that will create and return a routing function
 * (see `Matcher<T>`) from the routing configuration in `routes`.
 */
export default _default;
