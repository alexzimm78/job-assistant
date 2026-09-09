import {
    HttpException,
    HttpStatus,
} from '@nestjs/common';

export class DocumentVersionsConflictException
    extends HttpException {
    constructor(
        oldVersion: number,
        newVersion: number,
    ) {
        super(
            `Die neue Dokumentversion ${newVersion} muss größer als die aktuelle Version ${oldVersion} sein.`,
            HttpStatus.BAD_REQUEST,
        );
    }
}