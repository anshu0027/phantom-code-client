const isDev = import.meta.env.DEV

type LogArgs = unknown[]

export const logger = {
    log: (...args: LogArgs) => {
        if (isDev) {
            // eslint-disable-next-line no-console
            console.log(...args)
        }
    },
    warn: (...args: LogArgs) => {
        if (isDev) {
            // eslint-disable-next-line no-console
            console.warn(...args)
        }
    },
    error: (...args: LogArgs) => {
        if (isDev) {
            // eslint-disable-next-line no-console
            console.error(...args)
        }
    },
}


