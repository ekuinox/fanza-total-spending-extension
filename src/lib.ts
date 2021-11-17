import * as A from 'fp-ts/lib/ReadonlyArray';
import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

// パースした結果
interface Result {
  sum: number;
}

// 結果を表示するdivのid
const resultDivId = 'fanza-total-spending-extension-result';

/**
 * 存在する月別の購入履歴を取得する
 */
const getMonthOptions = () => {
  const select = document.querySelector<HTMLSelectElement>('#purchaseDate');
  return pipe(
    O.fromNullable(select?.children),
    O.map(options => Array.from(options) as Array<HTMLInputElement>),
    O.map(A.map(option => option.value)),
    O.getOrElse((): ReadonlyArray<string> => []),
  );
};

/**
 * その月の購入履歴を取得する
 * @param purchaseDate `YYYY-MM`
 */
const getHistory = (purchaseDate: string) => {
  return pipe(
    TE.tryCatch(
      () => fetch('/history', {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: `purchaseDate=${purchaseDate}`
      }).then(r => r.text()),
      () => null,
    ),
  );
};

/**
 * 整数配列の合計を返す
 * @param arr 整数配列
 * @return 合計
 */
const sum: (arr: ReadonlyArray<number>) => number = A.foldLeft(() => 0, (head: number, tail: ReadonlyArray<number>) => head + sum(tail));

/**
 * いっぱい取得したいけど、とりあえず合計金額だけ
 * @param content 取得したHTML
 * @return 合計金額
 */
const parseHistory = (content: string) => {
  return pipe(
    Array.from(content.matchAll(/\<td class="grand-total"\>[\r\n\s]+([\d,]+)/g)),
    A.filterMap(m => {
      if (m.length < 2) return O.none;
      return O.some(parseInt(m[1].replace(',', '')));
    }),
    sum,
    (n) => {
      console.log(n);
      return n;
    }
  );
};

/**
 * とりあえず利用総額だけ取得して返す
 */
const getTotalSpending = () => {
  return pipe(
    getMonthOptions(),
    A.map(getHistory),
    TE.sequenceArray,
    TE.map(A.map(parseHistory)),
    TE.map(sum),
    TE.map((sum): Result => ({ sum }))
  );
};

/**
 * 結果表示をするためのHTMLを作成する
 * @param result
 */
const createinnerHTML = (result: Result): string => {
  // シェアしろ
  const text = `私のFANZA支出累計は${result.sum}円でした！ #fanza_total_spending`;
  return `
    <dl>
      <dt>支出累計</dt>
      <dd>${result.sum}円</dd>
    <dl>
    <a
      href="https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}"
    >
      支出累計をTweetする（シェアしろ）
    </a>
  `;
};

/**
 * 結果をHTMLに描画する
 * @param result
 */
const display = (result: Result) => {
  const parent = document.getElementById('main-history-purchase');
  if (parent == null) return;

  // resultDivIdの要素があればそれを使うし、なければ作る
  const element = pipe(
    O.fromNullable(document.getElementById(resultDivId)),
    O.getOrElseW(() => {
      const e = document.createElement('div');
      e.id = resultDivId;
      parent.appendChild(e);
      return e;
    })
  );

  // Resultの表示
  element.innerHTML = createinnerHTML(result);

  // styleを書き換える
  element.style.margin = '1rem auto';
};

export const run = async () => {
  await getTotalSpending()().then(r => {
    if (E.isLeft(r)) {
      return;
    }
    display(r.right);
  });
};
