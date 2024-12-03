import { fsRm, traverseDirectory } from './src/fs.ts';
import { isH265, transcodeToH265 } from './src/media.ts';

(async () => {
    const startDir = '/tmp/movies';

    const clbk = async (fullPath: string) => {
        // Quick Regular expression to check if the file is a .mkv, .mp4, .avi file
        if (!fullPath.match(/\.(mkv|mp4|avi)$/)) return;

        const result = await isH265(fullPath);
        if (result.isErr()) {
            console.error(result.error);
            return;
        }

        // If the file is already in H265 format
        if (result.value) return;

        console.log(
            `${fullPath} Started processing ${new Date().toLocaleTimeString()}`,
        );

        const resultOfTranscode = await transcodeToH265(
            fullPath,
            fullPath.replace(/\.(mkv|mp4|avi)$/, '.h265.mkv'),
        );

        if (resultOfTranscode.isErr()) {
            console.error(resultOfTranscode.error);
            return;
        }

        if (resultOfTranscode.isOk()) {
            console.log(`${fullPath} Transcoded to H265`);
            console.log(
                `${fullPath} Finished processing ${new Date().toLocaleTimeString()}`,
            );
            console.log(`${fullPath} Removing original file`);
            await fsRm(fullPath);
        }
    };
    await traverseDirectory(startDir, clbk);
})();
