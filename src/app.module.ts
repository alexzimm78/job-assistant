import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {JobAssistantModule} from './job-assistant/job-assistant.module';

@Module({
    imports: [JobAssistantModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}