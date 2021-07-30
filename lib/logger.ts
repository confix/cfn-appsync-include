
export enum LogLevel {
    Debug,
    Info,
    Warn,
    Error,
    OFF
}

const sinkByLevel: Record<LogLevel, (...params: any[]) => void> = {
    [LogLevel.Debug]: console.debug,
    [LogLevel.Info]: console.debug,
    [LogLevel.Warn]: console.warn,
    [LogLevel.Error]: console.error,
    [LogLevel.OFF]: () => {}
}

class Logger {
    private level: LogLevel;

    constructor(level: LogLevel) {
        this.level = level;
    }

    debug(message: string) {
        this.log(LogLevel.Debug, message);
    }

    info(message: string) {
        this.log(LogLevel.Info, message);
    }

    warn(message: string) {
        this.log(LogLevel.Warn, message);
    }

    error(message: string) {
        this.log(LogLevel.Error, message);
    }

    setLevel(level: LogLevel) {
        this.level = level;
    }

    private log = (level: LogLevel, message: string) => {
        if (this.level > level) {
            return;
        }

        const sink = sinkByLevel[level];

        sink(message);
    }
}

export const log = new Logger(LogLevel.Info);
