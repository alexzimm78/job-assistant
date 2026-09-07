import {
    DocumentLanguage,
} from '../../ingestion/enums/document-language.enum';
import {
    DocumentType,
} from '../../ingestion/enums/document-type.enum';

import {
    SearchFilterBuilder,
} from './search-filter.builder';

describe(
    'SearchFilterBuilder',
    () => {
        it(
            'soll keinen Filter erstellen, wenn keine Parameter vorhanden sind',
            () => {
                const filter =
                    SearchFilterBuilder.build();

                expect(filter)
                    .toBeUndefined();
            },
        );

        it(
            'soll nach documentType filtern',
            () => {
                const filter =
                    SearchFilterBuilder.build(
                        DocumentType.JOB_OFFER,
                    );

                expect(filter)
                    .toEqual({
                        must: [
                            {
                                key:
                                    'documentType',
                                match: {
                                    value:
                                    DocumentType.JOB_OFFER,
                                },
                            },
                        ],
                    });
            },
        );

        it(
            'soll nach language filtern',
            () => {
                const filter =
                    SearchFilterBuilder.build(
                        undefined,
                        DocumentLanguage.DE,
                    );

                expect(filter)
                    .toEqual({
                        must: [
                            {
                                key:
                                    'language',
                                match: {
                                    value:
                                    DocumentLanguage.DE,
                                },
                            },
                        ],
                    });
            },
        );

        it(
            'soll mehrere Bedingungen mit AND kombinieren',
            () => {
                const filter =
                    SearchFilterBuilder.build(
                        DocumentType.RESUME,
                        DocumentLanguage.RU,
                    );

                expect(filter)
                    .toEqual({
                        must: [
                            {
                                key:
                                    'documentType',
                                match: {
                                    value:
                                    DocumentType.RESUME,
                                },
                            },
                            {
                                key:
                                    'language',
                                match: {
                                    value:
                                    DocumentLanguage.RU,
                                },
                            },
                        ],
                    });
            },
        );
    },
);