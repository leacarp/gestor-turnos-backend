import { IsIn } from 'class-validator';

export class MarcarRecordatorioRequestDto {
  @IsIn(['12h', '3h'])
  tipo: '12h' | '3h';
}
