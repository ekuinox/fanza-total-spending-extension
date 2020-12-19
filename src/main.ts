import * as A from 'fp-ts/lib/ReadonlyArray';
import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

/**
 * 存在する月別の購入履歴を取得する
 */
const getMonthOptions = () => {
  const select = document.querySelector<HTMLSelectElement>('#purchaseDate');
  return pipe(
    O.fromNullable(select?.children),
    O.map(options => Array.from(options) as Array<HTMLInputElement>),
    O.map(A.map(option => option.value)),
    O.getOrElseW(() => [] as Array<string>),
  );
};

/**
 * その月の購入履歴を取得する
 */
const getHistory = (purchaseDate: string) => {
  return pipe(
    TE.tryCatch(
      () => fetch('/history', {
        method: 'POST',
        body: `purchaseDate=${purchaseDate}`
      }).then(r => r.text()),
      () => null,
    ),
  );
};

const sum: (arr: ReadonlyArray<number>) => number = A.foldLeft(() => 0, (head: number, tail: ReadonlyArray<number>) => head + sum(tail));

/**
 * いっぱい取得したいけど、とりあえず合計金額だけ
 * @param content 
 */
const parseHistory = (content: string) => {
  return pipe(
    Array.from(content.matchAll(/\<td class="grand-total"\>[\r\n\s]+([\d,]+)/g)),
    A.filterMap(m => {
      if (m.length < 2) return O.none;
      return O.some(parseInt(m[1].replace(',', '')));
    }),
    sum
  );
};

const getTotalSpending = async () => {
  const r = await pipe(
    getMonthOptions(),
    A.map(getHistory),
    TE.sequenceArray,
    TE.map(A.map(parseHistory)),
    TE.map(sum),
  )();

  console.log(r);
};

chrome.runtime.onMessage.addListener((message, sender) => {
    console.log([message, sender]);

    getTotalSpending();
});
