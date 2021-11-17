import { run } from "./lib";

// ボタンのクリック
chrome.runtime.onMessage.addListener((message, sender) => {
  run();
});
