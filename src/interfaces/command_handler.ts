import { Command } from './command';

export interface CommandHandler<C extends Command = Command> {
	readonly commandName: string;

	handle(command: C): Promise<C['result']>;
}
