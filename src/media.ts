import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';
import { err, ok } from 'neverthrow';

export const isH265 = async (path: string) => {
    const CODEC_NAME = 'hevc';
    try {
        const metadata = await ffprobe(path, { path: ffprobeStatic.path });

        return ok(
            metadata.streams.some(
                ({ codec_name }) => codec_name === CODEC_NAME,
            ),
        );
    } catch (error: unknown) {
        return err(error instanceof Error ? error.message : undefined);
    }
};

export const transcodeToH265 = async (
    inputPath: string,
    outputPath: string,
) => {
    const command = `ffmpeg -y -i "${inputPath}" -c:v libx265 -crf 28 -preset medium "${outputPath}" `;
    try {
        await promisify(exec)(command);
        return ok(true);
    } catch (error: unknown) {
        return err(error instanceof Error ? error.message : undefined);
    }
};
