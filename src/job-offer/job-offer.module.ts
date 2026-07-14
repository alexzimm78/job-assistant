import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JobOffer} from "./job-offer.entity";
import {JobOfferController} from "./job-offer.controller";

import { JobOfferService } from './job-offer.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([JobOffer]),
    ],
    controllers: [JobOfferController],
    providers: [JobOfferService],
})
export class JobOfferModule {}
