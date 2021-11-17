import { build, BuildOptions } from 'esbuild';
import path from 'path';
import { exec, ExecException } from 'child_process';
import fs, { PathLike } from 'fs';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';

const copyFile = TE.taskify<PathLike, PathLike, NodeJS.ErrnoException | null, void>(fs.copyFile);

const buildBookmarklet = () => {
  const options: BuildOptions = {
    entryPoints: [path.join(__dirname, './src/bookmarklet.ts')],
    outdir: path.join(__dirname, 'out'),
    minify: true,
    bundle: true,
    target: 'chrome58',
  };

  return TE.tryCatch(
    () => build(options),
    err => err,
  );
};

const bundle = () => {
  const options: BuildOptions = {
    entryPoints: ['main.ts', 'background.ts'].map(name => path.join(__dirname, `./src/${name}`)),
    outdir: path.join(__dirname, 'dist'),
    minify: true,
    bundle: true,
    target: 'chrome58',
  };
  return TE.tryCatch(
    () => build(options),
    err => err,
  );
};

const copyAssets = () => {
  const targets = ['manifest.json', 'icon_32.png'];
  return pipe(
    targets,
    A.map(target => copyFile(path.resolve(__dirname, `./assets/${target}`), path.resolve(__dirname, `./dist/${target}`))),
    TE.sequenceArray,
  );
};

const checkTsc = () => {
  return () => new Promise<E.Either<ExecException | string, string>>(resolve => {
    exec('npx tsc --noEmit', (error, stdout, stderr) => {
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
  const r1 = await checkTsc()();
  if (E.isLeft(r1)) {
    console.error(r1);
    return;
  }
  const r2 = await bundle()();
  if (E.isLeft(r2)) {
    console.error(r2);
    return;
  }
  const r3 = await copyAssets()();
  if (E.isLeft(r3)) {
    console.error(r3);
    return;
  }
  const r4 = await buildBookmarklet()();
  if (E.isLeft(r4)) {
    console.error(r4);
  }
  console.log('ok');
})();
