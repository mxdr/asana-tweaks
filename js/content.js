async function docReady(fn) {
  if (document.readyState === "complete" || document.readyState === "interactive") setTimeout(fn, 1)
  else document.addEventListener("DOMContentLoaded", fn)
}

async function loadOptions() {
  chrome.storage.sync.get("enabledOptions", (data) => {
    let enabledOptions = data.enabledOptions || []

    for (let enabledOption of enabledOptions) {
      document.body.classList.add(`tweak-${enabledOption}`);
    }
  })
}

docReady(async () => await loadOptions())
