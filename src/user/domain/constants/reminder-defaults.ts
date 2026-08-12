import type { ReminderSettingsEntity } from '../entities/user.entity';

export const DEFAULT_MESSAGE_TEMPLATE =
    'Hola {nombre}, te recordamos tu turno a las {hora}.';

/**
 * Chat de Telegram al que van los recordatorios mientras el proveedor no cargue
 * el suyo. Sin este fallback un proveedor recién creado no recibiría nada, que
 * es justo lo que la automatización tiene que evitar.
 */
export function getDefaultTelegramChatId(): string | undefined {
    return process.env.TELEGRAM_DEFAULT_CHAT_ID || undefined;
}

/**
 * Reparto por default de los dos recordatorios:
 *  - 12h: email al CLIENTE (para que no falte al turno). Sin Telegram.
 *  - 3h:  Telegram al PROVEEDOR (aviso de que se le viene el turno).
 */
export function buildDefaultReminderSettings(): ReminderSettingsEntity {
    return {
        telegram: {
            enabled: true,
            t12h: false,
            t3h: true,
            chatId: getDefaultTelegramChatId(),
        },
        email: { enabled: true, t12h: true },
        messageTemplate: DEFAULT_MESSAGE_TEMPLATE,
    };
}

/**
 * Completa con los defaults lo que el proveedor tenga guardado. Los proveedores
 * viejos no tienen `reminderSettings` en Mongo, así que sin esto quedarían fuera
 * de los recordatorios para siempre.
 */
export function withReminderDefaults(
    settings?: Partial<ReminderSettingsEntity>,
): ReminderSettingsEntity {
    const base = buildDefaultReminderSettings();

    return {
        telegram: {
            enabled: settings?.telegram?.enabled ?? base.telegram.enabled,
            t12h: settings?.telegram?.t12h ?? base.telegram.t12h,
            t3h: settings?.telegram?.t3h ?? base.telegram.t3h,
            chatId: settings?.telegram?.chatId || base.telegram.chatId,
        },
        email: {
            enabled: settings?.email?.enabled ?? base.email.enabled,
            t12h: settings?.email?.t12h ?? base.email.t12h,
        },
        messageTemplate: settings?.messageTemplate ?? base.messageTemplate,
    };
}
