import { Command, CommandBus, CommandHandler } from '../interfaces';

export class InMemoryCommandBus implements CommandBus {
	private handlers = new Map<string, CommandHandler>();

	registerHandler(handler: CommandHandler) {
		this.handlers.set(handler.commandName, handler);
	}

	async execute(command: Command) {
		const handler = this.handlers.get(command.constructor.name);
		if (!handler) {
			throw new Error(`No handler registered for command: ${command.constructor.name}`);
		}

		return await handler.handle(command);
	}
}
