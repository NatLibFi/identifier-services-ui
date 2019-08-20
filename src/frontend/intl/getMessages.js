import * as enMessages from './translations/en.json';
import * as fiMessages from './translations/fi.json';
import * as svMessages from './translations/sv.json';

const translations = {
	en: enMessages,
	fi: fiMessages,
	sv: svMessages
};

export function getMessages(locale) {
	const messages = translations[locale];
	if (!messages) {
		return {};
	}

	if (Object.keys(messages).length === 1 && 'default' in messages) {
		return messages.default;
	}

	return messages;
}
