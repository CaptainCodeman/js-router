export declare type Result = {
    page: any;
    params: {
        [key: string]: any;
    };
} | null;
export declare type Matcher = (url: string) => Result;
declare const _default: (routes: {
    [path: string]: any;
}) => Matcher;
export default _default;
