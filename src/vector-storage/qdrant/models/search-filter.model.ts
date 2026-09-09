export type SearchFilterValue =
    string |
    number |
    boolean;

export type SearchFilterMatcher =
    | {
    value: SearchFilterValue;
}
    | {
    any: string[] | number[];
};

export class SearchFilterCondition {
    key: string;
    match: SearchFilterMatcher;
}

export class SearchFilter {
    must: SearchFilterCondition[];
}