import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WhatsappService } from './whatsapp.service';

@ApiTags('WhatsApp')
@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  // Webhook Twilio - reçoit les messages entrants
  @Post('webhook')
  @ApiOperation({ summary: 'Webhook Twilio pour messages entrants' })
  async webhook(@Body() body: any) {
    return this.whatsappService.traiterMessageEntrant(body);
  }

  // Envoyer instruction à une équipe
  @Post('instruction')
  @ApiOperation({ summary: 'Envoyer instruction à une équipe' })
  async envoyerInstruction(
    @Body('equipe') equipe: string,
    @Body('message') message: string,
  ) {
    return this.whatsappService.envoyerInstructionEquipe(equipe, message);
  }

  // Envoyer message direct
  @Post('message')
  @ApiOperation({ summary: 'Envoyer message WhatsApp direct' })
  async envoyerMessage(
    @Body('to') to: string,
    @Body('body') body: string,
  ) {
    const ok = await this.whatsappService.envoyerMessage(to, body);
    return { success: ok };
  }
}
