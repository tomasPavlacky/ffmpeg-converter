import { promises } from 'node:fs';
import { join } from 'node:path';
import { err, ok } from 'neverthrow';

export const fsReadDir = async (path: string) => {
    try {
        const result = await promises.readdir(path);
        return ok(result);
    } catch (error: unknown) {
        console.error(error);
        return err(err instanceof Error ? err.message : undefined);
    }
};

export const fsStat = async (path: string) => {
    try {
        const result = await promises.stat(path);
        return ok(result);
    } catch (error: unknown) {
        console.error(error);
        return err(err instanceof Error ? err.message : undefined);
    }
};

export const fsRm = async (path: string) => {
    try {
        await promises.unlink(path);
        return ok(true);
    } catch (error: unknown) {
        return err(error instanceof Error ? error.message : undefined);
    }
};

export const traverseDirectory = async (
    relativePath: string,
    callback: (fullPath: string) => unknown,
) => {
    const files = await fsReadDir(relativePath);

    if (files.isErr()) {
        console.error(files.error);
        return;
    }

    for (const file of files.value) {
        const fullPath = join(relativePath, file);

        const statResult = await fsStat(fullPath);

        if (statResult.isErr()) {
            console.error(statResult.error);
            return;
        }

        if (statResult.value.isDirectory()) {
            await traverseDirectory(fullPath, callback);
        } else {
            await callback(fullPath);
        }
    }
};
