import { Body, Controller, NotFoundException, Param, Post, Req } from '@nestjs/common';
import { GrammarService } from './grammar.service';
const nlp = require('compromise/three');  // Use require to import

@Controller('grammar')
export class GrammarController {

    @Post('check')
    check(@Body('sentence') sentence: string) {
        if (!sentence) {
            throw new NotFoundException();
        }

        let doc = nlp(sentence);
        doc.verbs().toPastTense();

        return { reply: doc.text() };  // Return the transformed text as a JSON response
    }
}
