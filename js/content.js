const TIMEOUT_TRIGGERS = ["complete", "interactive"]

async function docReady(fn) {
  if (TIMEOUT_TRIGGERS.includes(document.readyState)) setTimeout(fn, 1)
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
