import {
    DocumentAccessLevel,
} from '../../ingestion/enums/document-access-level.enum';
import {
    DocumentLanguage,
} from '../../ingestion/enums/document-language.enum';
import {
    DocumentType,
} from '../../ingestion/enums/document-type.enum';

import {
    SearchFilter,
    SearchFilterCondition,
} from './models/search-filter.model';

export class SearchFilterBuilder {
    static build(
        documentType?: DocumentType,
        language?: DocumentLanguage,
        allowedAccessLevels:
        DocumentAccessLevel[] = [],
    ): SearchFilter | undefined {
        const must:
            SearchFilterCondition[] = [];

        if (documentType) {
            must.push({
                key:
                    'documentType',
                match: {
                    value:
                    documentType,
                },
            });
        }

        if (language) {
            must.push({
                key:
                    'language',
                match: {
                    value:
            language,
        },
        });
        }

        if (allowedAccessLevels.length > 0) {
            must.push({
                key:
                    'accessLevel',
                match: {
                    any:
                    allowedAccessLevels,
                },
            });
        }

        if (must.length === 0) {
            return undefined;
        }

        return {
            must,
        };
    }
}