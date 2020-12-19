import { build, BuildOptions } from 'esbuild';
import path from 'path';
import { exec, ExecException } from 'child_process';
import fs, { PathLike } from 'fs';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';

const copyFile = TE.taskify<PathLike, PathLike, NodeJS.ErrnoException | null, void>(fs.copyFile);

const bundle = () => {
  const options: BuildOptions = {
    entryPoints: [path.join(__dirname, './src/main.ts')],
    outdir: path.join(__dirname, 'dist'),
  };
  return TE.tryCatch(
    () => build(options),
    () => {},
  );
};

const copyAssets = () => {
  const targets = ['manifest.json'];
  return pipe(
    targets,
    A.map(target => copyFile(path.resolve(__dirname, `./assets/${target}`), path.resolve(__dirname, `./dist/${target}`))),
    TE.sequenceArray,
  );
};

const checkTsc = () => {
  return () => new Promise<E.Either<ExecException | string, string>>(resolve => {
    exec('npx tsc ./src/* --noEmit', (error, stdout, stderr) => {
      if (error != null) {
        return resolve(E.left(error));
      }
      if (stderr.length > 0) {
        return resolve(E.left(stderr));
      }
      return resolve(E.right(stdout));
    });
  });
};

(async () => {
  // 面倒になった
  await checkTsc()();
  await bundle()();
  await copyAssets()();
})();
