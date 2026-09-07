export class SearchFilterMatcher {
    value: string | number | boolean;
}

export class SearchFilterCondition {
    key: string;
    match: SearchFilterMatcher;
}

export class SearchFilter {
    must: SearchFilterCondition[];
}